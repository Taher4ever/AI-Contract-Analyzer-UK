"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckoutButton } from "@/components/dashboard/checkout-button";
import { PortalButton } from "@/components/dashboard/portal-button";
import { PLANS, yearlyPrice, type BillingPeriod, type PlanId } from "@/lib/stripe/plans";

export function PlanComparison({ currentPlan }: { currentPlan: PlanId }) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div>
      <div
        role="group"
        aria-label="Billing period"
        className="glass mx-auto flex w-fit items-center gap-1 rounded-full p-1"
      >
        {(["monthly", "yearly"] as const).map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => setBilling(period)}
            aria-pressed={billing === period}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              billing === period
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
            {period === "yearly" && (
              <span className="ml-1.5 text-xs font-semibold text-emerald-500">−20%</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const price = billing === "yearly" ? yearlyPrice(plan.monthlyPrice) : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={cn(
                "glass shadow-soft relative flex flex-col rounded-2xl p-6",
                plan.highlighted && "glass-strong shadow-soft-lg ring-primary ring-2"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
                  Most popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight tabular-nums">
                  £{price}
                </span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-muted-foreground mt-1 h-4 text-xs">
                {billing === "yearly" && plan.monthlyPrice > 0 ? "Billed yearly" : " "}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex-1" />
              {isCurrent ? (
                <Button disabled variant="outline" className="w-full rounded-full">
                  Current plan
                </Button>
              ) : plan.id === "free" ? (
                <PortalButton variant="outline" className="w-full rounded-full">
                  Downgrade
                </PortalButton>
              ) : (
                <CheckoutButton
                  plan={plan.id}
                  billing={billing}
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full rounded-full"
                >
                  {currentPlan === "free" ? plan.cta : "Switch plan"}
                </CheckoutButton>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
