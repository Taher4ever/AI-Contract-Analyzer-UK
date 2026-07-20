"use client";

import { CalendarClock, RefreshCw } from "lucide-react";
import { useHighlight } from "./highlight-context";
import type { AutoRenewal, NoticePeriod } from "@/lib/ai/schemas";

function FactCard({
  icon: Icon,
  label,
  value,
  explanation,
  paragraphIds,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  explanation: string;
  paragraphIds: number[];
}) {
  const { highlight } = useHighlight();
  const clickable = paragraphIds.length > 0;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => highlight(paragraphIds)}
      className="glass shadow-soft rounded-2xl p-4 text-left transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-default"
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </div>
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
        {explanation}
      </p>
    </button>
  );
}

export function KeyFacts({
  noticePeriod,
  autoRenewal,
}: {
  noticePeriod: NoticePeriod;
  autoRenewal: AutoRenewal;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FactCard
        icon={CalendarClock}
        label="Notice period"
        value={noticePeriod.value ?? "Not specified"}
        explanation={noticePeriod.explanation}
        paragraphIds={noticePeriod.paragraphIds}
      />
      <FactCard
        icon={RefreshCw}
        label="Auto-renewal"
        value={
          <span
            className={
              autoRenewal.present
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }
          >
            {autoRenewal.present ? "Yes" : "No"}
          </span>
        }
        explanation={autoRenewal.explanation}
        paragraphIds={autoRenewal.paragraphIds}
      />
    </div>
  );
}
