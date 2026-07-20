"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/ai/schemas";

const LEVEL_CONFIG: Record<
  RiskLevel,
  { label: string; ring: string; track: string; text: string }
> = {
  low: {
    label: "Low risk",
    ring: "stroke-emerald-500",
    track: "stroke-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    label: "Medium risk",
    ring: "stroke-amber-500",
    track: "stroke-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
  },
  high: {
    label: "High risk",
    ring: "stroke-rose-500",
    track: "stroke-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
  },
};

export function RiskScore({
  score,
  level,
  explanation,
}: {
  score: number;
  level: RiskLevel;
  explanation: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const config = LEVEL_CONFIG[level];

  const size = 128;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);

  return (
    <div className="glass shadow-soft-lg flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={config.track}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={config.ring}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: shouldReduceMotion ? offset : circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums">
            <AnimatedNumber value={score} />
          </span>
          <span className="text-muted-foreground text-xs">/ 100</span>
        </div>
      </div>

      <div className="flex-1">
        <span className={cn("text-sm font-semibold", config.text)}>{config.label}</span>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{explanation}</p>
        <p className="text-muted-foreground/70 mt-3 text-xs">
          Not legal advice — ContractLens AI helps you understand documents, it
          does not replace a solicitor.
        </p>
      </div>
    </div>
  );
}
