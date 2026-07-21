"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import type { BillingPeriod, PaidPlanId } from "@/lib/stripe/plans";

export type CheckoutResult = { url: string } | { error: string };

const PRICE_IDS: Record<PaidPlanId, Record<BillingPeriod, string | undefined>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  team: {
    monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
    yearly: process.env.STRIPE_PRICE_TEAM_YEARLY,
  },
};

export async function createCheckoutSession(
  plan: PaidPlanId,
  billing: BillingPeriod
): Promise<CheckoutResult> {
  const priceId = PRICE_IDS[plan]?.[billing];
  if (!priceId) return { error: "This plan is not available right now." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : (profile?.email ?? user.email ?? undefined),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?success=1`,
      cancel_url: `${appUrl}/dashboard/billing`,
    });
    if (!session.url) return { error: "Could not start checkout." };
    return { url: session.url };
  } catch {
    return { error: "Could not start checkout. Please try again." };
  }
}

export async function createPortalSession(): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_customer_id) {
    return { error: "No billing account found yet. Subscribe to a plan first." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    });
    return { url: session.url };
  } catch {
    return { error: "Could not open the billing portal. Please try again." };
  }
}
