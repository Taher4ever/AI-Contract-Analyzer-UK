import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreditCard, Gauge } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FREE_MONTHLY_LIMIT } from "@/lib/billing/limits";
import { isPaidPlan, PLANS } from "@/lib/stripe/plans";
import { ProgressRing } from "@/components/shared/progress-ring";
import { PortalButton } from "@/components/dashboard/portal-button";
import { PlanComparison } from "@/components/dashboard/plan-comparison";
import { PaymentHistoryTable } from "@/components/dashboard/payment-history-table";
import { BillingSuccessBanner } from "@/components/dashboard/billing-success-banner";

export const metadata: Metadata = { title: "Billing" };

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Past due",
  canceled: "Canceled",
  unpaid: "Unpaid",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: profile }, { data: subscription }, { count: monthCount }, { data: payments }] =
    await Promise.all([
      supabase.from("profiles").select("plan").eq("id", user.id).single(),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("contracts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString()),
      supabase
        .from("payments")
        .select("id, amount, currency, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const plan = profile?.plan ?? "free";
  const planDefinition = PLANS.find((p) => p.id === plan) ?? PLANS[0];
  const used = monthCount ?? 0;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Manage your plan, usage and payment history.
      </p>

      <div className="mt-6">{success === "1" && <BillingSuccessBanner />}</div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="glass shadow-soft rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
              <CreditCard className="size-4.5" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">Current plan</span>
          </div>
          <p className="mt-3 text-2xl font-semibold">{planDefinition.name}</p>
          {subscription ? (
            <p className="text-muted-foreground mt-1 text-sm">
              {STATUS_LABELS[subscription.status] ?? subscription.status}
              {subscription.current_period_end &&
                ` — renews ${new Date(subscription.current_period_end).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`}
            </p>
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">
              {isPaidPlan(plan) ? "Active" : "No active subscription."}
            </p>
          )}
          {isPaidPlan(plan) && (
            <PortalButton className="mt-4 rounded-full">Manage billing</PortalButton>
          )}
        </div>

        <div className="glass shadow-soft rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <Gauge className="size-4.5" />
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                Usage this month
              </span>
            </div>
            {!isPaidPlan(plan) && (
              <ProgressRing value={used} max={FREE_MONTHLY_LIMIT} size={40} strokeWidth={4} />
            )}
          </div>
          <p className="mt-3 text-2xl font-semibold">
            {isPaidPlan(plan) ? "Unlimited" : `${used} / ${FREE_MONTHLY_LIMIT}`}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {isPaidPlan(plan)
              ? "No monthly document limit on your plan."
              : "Documents uploaded this calendar month."}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Plans</h2>
        <div className="mt-4">
          <PlanComparison currentPlan={plan} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Payment history</h2>
        <div className="mt-4">
          <PaymentHistoryTable
            payments={(payments ?? []).map((p) => ({
              id: p.id,
              amount: p.amount,
              currency: p.currency,
              status: p.status,
              createdAt: p.created_at,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
