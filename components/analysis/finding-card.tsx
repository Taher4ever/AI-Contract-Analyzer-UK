"use client";

import { AlertTriangle, ArrowRight, Info, MessageCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHighlight } from "./highlight-context";
import type { Finding } from "@/lib/ai/schemas";

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    iconClassName: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  danger: {
    icon: ShieldAlert,
    iconClassName: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  },
} as const;

export function FindingCard({
  finding,
  showAskAi = true,
}: {
  finding: Finding;
  showAskAi?: boolean;
}) {
  const { highlight, askAboutFinding } = useHighlight();
  const { icon: Icon, iconClassName } = SEVERITY_CONFIG[finding.severity];

  return (
    <div className="border-border/60 rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{finding.title}</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {finding.explanation}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {finding.paragraphIds.length > 0 && (
              <button
                type="button"
                onClick={() => highlight(finding.paragraphIds)}
                className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
              >
                View in contract
                <ArrowRight className="size-3" />
              </button>
            )}
            {showAskAi && (
              <button
                type="button"
                onClick={() =>
                  askAboutFinding(`Can you tell me more about this: "${finding.title}"?`)
                }
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium hover:underline"
              >
                <MessageCircle className="size-3" />
                Ask AI about this
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
