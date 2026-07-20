"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import { tiers } from "@/components/marketing/data";

type Billing = "monthly" | "yearly";

function price(monthly: number, billing: Billing) {
  return billing === "yearly" ? Math.round(monthly * 0.8) : monthly;
}

function AnimatedPrice({ value }: { value: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className="relative inline-flex overflow-hidden">
      <motion.span
        key={value}
        initial={
          shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-5xl font-bold tracking-tight tabular-nums"
      >
        £{value}
      </motion.span>
    </span>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="scroll-mt-24 py-20 lg:py-28">
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Pricing
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Simple pricing, no small print
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Start free. Upgrade when you need more.
          </p>

          <div
            role="group"
            aria-label="Billing period"
            className="glass mx-auto mt-8 inline-flex items-center gap-1 rounded-full p-1"
          >
            {(["monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBilling(period)}
                aria-pressed={billing === period}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  billing === period
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {billing === period && (
                  <motion.span
                    layoutId="billing-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="bg-primary absolute inset-0 rounded-full"
                  />
                )}
                <span className="relative">
                  {period === "monthly" ? "Monthly" : "Yearly"}
                  {period === "yearly" && (
                    <span
                      className={cn(
                        "ml-1.5 text-xs font-semibold",
                        billing === "yearly"
                          ? "text-primary-foreground/80"
                          : "text-primary"
                      )}
                    >
                      −20%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeInStagger className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <FadeIn key={tier.name} className="h-full">
              <div
                className={cn(
                  "glass shadow-soft relative flex h-full flex-col rounded-2xl p-7",
                  tier.highlighted &&
                    "glass-strong shadow-soft-lg ring-primary ring-2"
                )}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {tier.description}
                </p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <AnimatedPrice value={price(tier.monthly, billing)} />
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-muted-foreground mt-1 h-4 text-xs">
                  {billing === "yearly" && tier.monthly > 0
                    ? "Billed yearly — save 20%"
                    : " "}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex-1" />
                <Button
                  size="lg"
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full rounded-full"
                  nativeButton={false}
                  render={<Link href="/signup" />}
                >
                  {tier.cta}
                </Button>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>

        <p className="text-muted-foreground mt-8 text-center text-xs">
          Prices in GBP, VAT included where applicable. Cancel any time.
        </p>
      </Container>
    </section>
  );
}
