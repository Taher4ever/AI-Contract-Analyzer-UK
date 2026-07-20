"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReanalyzeButton } from "@/components/dashboard/reanalyze-button";

const STEPS: { key: string; label: string }[] = [
  { key: "start", label: "Reading document" },
  { key: "riskScore", label: "Scoring risk" },
  { key: "sections", label: "Extracting clauses" },
  { key: "timeline", label: "Building timeline" },
  { key: "recommendedQuestions", label: "Preparing questions" },
];

export function AnalysisRunner({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [seenKeys, setSeenKeys] = useState<Set<string>>(new Set(["start"]));
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });

      if (!res.body) {
        setError("No response from server.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const errorMatch = buffer.match(/\[\[ERROR:([\s\S]*)\]\]/);
        if (errorMatch) {
          setError(errorMatch[1]);
          return;
        }

        setSeenKeys((prev) => {
          const next = new Set(prev);
          for (const step of STEPS) {
            if (buffer.includes(`"${step.key}"`)) next.add(step.key);
          }
          return next;
        });
      }

      router.refresh();
    };

    run().catch((err) =>
      setError(err instanceof Error ? err.message : "Something went wrong.")
    );
  }, [contractId, router]);

  if (error) {
    return (
      <div className="glass shadow-soft rounded-2xl p-8 text-center">
        <p className="font-semibold">Analysis failed</p>
        <p className="text-muted-foreground mt-2 text-sm">{error}</p>
        <div className="mt-5 flex justify-center">
          <ReanalyzeButton contractId={contractId} label="Try again" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass shadow-soft rounded-2xl p-8">
      <ul className="space-y-3">
        {STEPS.map((step) => {
          const done = seenKeys.has(step.key);
          return (
            <li key={step.key} className="flex items-center gap-3">
              {done ? (
                <CheckCircle2 className="text-primary size-5 shrink-0" />
              ) : (
                <Loader2 className="text-muted-foreground size-5 shrink-0 animate-spin" />
              )}
              <span className={cn(!done && "text-muted-foreground")}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
