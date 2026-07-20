"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  max,
  size = 56,
  strokeWidth = 5,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: size, height: size }}
      className={cn("-rotate-90", className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-primary"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: shouldReduceMotion ? offset : circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}
