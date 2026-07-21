"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/(app)/dashboard/billing/actions";
import type { BillingPeriod, PaidPlanId } from "@/lib/stripe/plans";

export function CheckoutButton({
  plan,
  billing,
  children,
  className,
  variant = "default",
  size = "default",
}: {
  plan: PaidPlanId;
  billing: BillingPeriod;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
}) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await createCheckoutSession(plan, billing);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.url;
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={onClick}
      className={className}
    >
      {isPending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}
