"use client";

import { CalendarX, CreditCard, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHighlight } from "./highlight-context";
import type { TimelineEntry, TimelineType } from "@/lib/ai/schemas";

const TYPE_CONFIG: Record<
  TimelineType,
  { icon: React.ElementType; className: string }
> = {
  renewal: { icon: RefreshCw, className: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  termination: { icon: XCircle, className: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
  deadline: { icon: CalendarX, className: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  payment: { icon: CreditCard, className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
};

function relativeLabel(date: Date, now: Date): { text: string; overdue: boolean } {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round((date.getTime() - now.getTime()) / msPerDay);

  if (days < 0) return { text: "Overdue", overdue: true };
  if (days === 0) return { text: "Today", overdue: false };
  if (days === 1) return { text: "Tomorrow", overdue: false };
  if (days < 30) return { text: `In ${days} days`, overdue: false };
  const months = Math.round(days / 30);
  if (months < 12) return { text: `In ${months} month${months > 1 ? "s" : ""}`, overdue: false };
  const years = Math.round(months / 12);
  return { text: `In ${years} year${years > 1 ? "s" : ""}`, overdue: false };
}

function TimelineRow({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  const { highlight } = useHighlight();
  const { icon: Icon, className } = TYPE_CONFIG[entry.type];
  const date = entry.date ? new Date(entry.date) : null;
  const relative = date && !Number.isNaN(date.getTime()) ? relativeLabel(date, new Date()) : null;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && <span className="bg-border absolute top-8 bottom-0 left-4 w-px" aria-hidden />}
      <div className={cn("z-10 flex size-8 shrink-0 items-center justify-center rounded-full", className)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{entry.label}</p>
          {relative && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                relative.overdue
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {relative.text}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          {date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            : "Date not specified"}
        </p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{entry.explanation}</p>
        {entry.paragraphIds.length > 0 && (
          <button
            type="button"
            onClick={() => highlight(entry.paragraphIds)}
            className="text-primary mt-1.5 text-xs font-medium hover:underline"
          >
            View in contract →
          </button>
        )}
      </div>
    </li>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="glass shadow-soft rounded-2xl p-5">
      <h2 className="text-lg font-semibold">Timeline</h2>
      <ul className="mt-5">
        {sorted.map((entry, i) => (
          <TimelineRow key={i} entry={entry} isLast={i === sorted.length - 1} />
        ))}
      </ul>
    </div>
  );
}
