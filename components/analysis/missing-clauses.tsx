import { AlertTriangle } from "lucide-react";
import type { MissingClause } from "@/lib/ai/schemas";

export function MissingClauses({ clauses }: { clauses: MissingClause[] }) {
  if (clauses.length === 0) return null;

  return (
    <div className="glass shadow-soft rounded-2xl p-5">
      <h2 className="text-lg font-semibold">Missing clauses</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Standard clauses this contract doesn&apos;t appear to include.
      </p>
      <ul className="mt-4 space-y-3">
        {clauses.map((clause, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{clause.title}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {clause.whyItMatters}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
