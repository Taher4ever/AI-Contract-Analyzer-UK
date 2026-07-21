import type { WeekBucket } from "@/lib/admin/analytics";
import type { Plan } from "@/types/database";

const PLAN_COLORS: Record<Plan, string> = {
  free: "stroke-muted-foreground/40",
  pro: "stroke-primary",
  team: "stroke-violet-500",
};

const PLAN_DOT_COLORS: Record<Plan, string> = {
  free: "bg-muted-foreground/40",
  pro: "bg-primary",
  team: "bg-violet-500",
};

const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

function weekLabel(weekStart: string): string {
  return new Date(weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function WeeklyBarChart({ data }: { data: WeekBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const gap = 4;
  const barWidth = (300 - gap * (data.length - 1)) / data.length;

  return (
    <div>
      <svg viewBox="0 0 300 100" className="h-28 w-full" preserveAspectRatio="none">
        {data.map((d, i) => {
          const height = Math.max((d.count / max) * 92, d.count > 0 ? 4 : 0);
          const x = i * (barWidth + gap);
          return (
            <rect
              key={d.weekStart}
              x={x}
              y={100 - height}
              width={barWidth}
              height={height}
              rx={2}
              className="fill-primary"
            />
          );
        })}
      </svg>
      <div className="text-muted-foreground mt-2 flex justify-between text-[10px]">
        <span>{weekLabel(data[0].weekStart)}</span>
        <span>{weekLabel(data[data.length - 1].weekStart)}</span>
      </div>
    </div>
  );
}

export function PlanDonutChart({
  data,
  size = 140,
  strokeWidth = 20,
}: {
  data: { plan: Plan; count: number }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetSoFar = 0;

  return (
    <div className="flex items-center gap-6">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: size, height: size }}
        className="-rotate-90 shrink-0"
      >
        {total === 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
        ) : (
          data.map((d) => {
            if (d.count === 0) return null;
            const fraction = d.count / total;
            const dash = fraction * circumference;
            const dashArray = `${dash} ${circumference - dash}`;
            const dashOffset = -offsetSoFar;
            offsetSoFar += dash;
            return (
              <circle
                key={d.plan}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className={PLAN_COLORS[d.plan]}
              />
            );
          })
        )}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.plan} className="flex items-center gap-2 text-sm">
            <span className={`size-2.5 rounded-full ${PLAN_DOT_COLORS[d.plan]}`} />
            <span className="text-muted-foreground">{PLAN_LABELS[d.plan]}</span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
