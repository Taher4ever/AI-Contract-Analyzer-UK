import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/motion";
import { ProgressRing } from "@/components/shared/progress-ring";

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  ring,
}: {
  icon: LucideIcon;
  label: string;
  value: number | null;
  prefix?: string;
  suffix?: string;
  ring?: { max: number };
}) {
  return (
    <div className="glass shadow-soft rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </div>
        {ring && <ProgressRing value={value ?? 0} max={ring.max} size={44} strokeWidth={5} />}
      </div>
      <p className="text-muted-foreground mt-4 text-sm">{label}</p>
      <p className="mt-1 text-3xl font-semibold">
        {value === null ? (
          <span className="text-muted-foreground text-xl">—</span>
        ) : (
          <>
            {prefix}
            <AnimatedNumber value={value} />
            {suffix}
          </>
        )}
      </p>
    </div>
  );
}
