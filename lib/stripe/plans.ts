export type PaidPlanId = "pro" | "team";
export type PlanId = "free" | PaidPlanId;
export type BillingPeriod = "monthly" | "yearly";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const YEARLY_DISCOUNT = 0.2;

export function yearlyPrice(monthly: number): number {
  return Math.round(monthly * (1 - YEARLY_DISCOUNT));
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    description: "Try it on your next contract.",
    monthlyPrice: 0,
    features: [
      "3 documents per month",
      "Risk score & summary",
      "Clause-by-clause analysis",
      "AI chat about your document",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For people who sign things often.",
    monthlyPrice: 19,
    features: [
      "Unlimited documents",
      "Everything in Free",
      "PDF export & share links",
      "Key dates timeline",
      "Priority processing",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For agencies, landlords and small firms.",
    monthlyPrice: 49,
    features: [
      "Everything in Pro",
      "Team members & roles",
      "Shared workspace",
      "Centralised billing",
    ],
    cta: "Start with Team",
    highlighted: false,
  },
];

export function getPlan(id: PlanId): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

export function isPaidPlan(id: PlanId): id is PaidPlanId {
  return id === "pro" || id === "team";
}
