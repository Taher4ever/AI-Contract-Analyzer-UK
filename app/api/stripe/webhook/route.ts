import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types/database";

const PRICE_TO_PLAN: Record<string, Plan> = {};
for (const [envVar, plan] of [
  ["STRIPE_PRICE_PRO_MONTHLY", "pro"],
  ["STRIPE_PRICE_PRO_YEARLY", "pro"],
  ["STRIPE_PRICE_TEAM_MONTHLY", "team"],
  ["STRIPE_PRICE_TEAM_YEARLY", "team"],
] as const) {
  const priceId = process.env[envVar];
  if (priceId) PRICE_TO_PLAN[priceId] = plan;
}

function planFromPriceId(priceId: string | undefined): Plan | null {
  if (!priceId) return null;
  return PRICE_TO_PLAN[priceId] ?? null;
}

function customerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) return new Response("Missing signature.", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(
      `Webhook signature verification failed: ${err instanceof Error ? err.message : "unknown error"}`,
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const custId = customerId(session.customer);
      if (userId && custId) {
        await admin.from("profiles").update({ stripe_customer_id: custId }).eq("id", userId);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const custId = customerId(subscription.customer);
      const item = subscription.items.data[0];
      const plan = planFromPriceId(item?.price.id);
      if (!custId || !plan) break;

      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", custId)
        .maybeSingle();
      if (!profile) break;

      await admin.from("profiles").update({ plan }).eq("id", profile.id);
      await admin.from("subscriptions").upsert(
        {
          user_id: profile.id,
          stripe_subscription_id: subscription.id,
          plan,
          status: subscription.status,
          current_period_end: item
            ? new Date(item.current_period_end * 1000).toISOString()
            : null,
        },
        { onConflict: "user_id" }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const custId = customerId(subscription.customer);
      if (!custId) break;

      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", custId)
        .maybeSingle();
      if (!profile) break;

      await admin.from("profiles").update({ plan: "free" }).eq("id", profile.id);
      await admin
        .from("subscriptions")
        .update({ status: "canceled", plan: "free" })
        .eq("user_id", profile.id);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const custId = customerId(invoice.customer);
      if (!custId || !invoice.id) break;

      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", custId)
        .maybeSingle();
      if (!profile) break;

      await admin.from("payments").upsert(
        {
          user_id: profile.id,
          stripe_id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "paid",
        },
        { onConflict: "stripe_id" }
      );
      break;
    }

    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
