"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useHighlight } from "./highlight-context";
import type { Paragraph } from "@/types/database";

export function ContractViewer({ paragraphs }: { paragraphs: Paragraph[] }) {
  const { highlightedIds } = useHighlight();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedIds.size === 0) return;
    const firstId = Math.min(...highlightedIds);
    const el = containerRef.current?.querySelector(
      `[data-paragraph-id="${firstId}"]`
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }, [highlightedIds]);

  if (paragraphs.length === 0) {
    return (
      <p className="text-muted-foreground p-6 text-sm">
        No contract text is available for this document.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3 p-1">
      {paragraphs.map((p) => (
        <p
          key={p.id}
          data-paragraph-id={p.id}
          className={cn(
            "rounded-xl px-3 py-2 text-sm leading-relaxed transition-colors duration-700",
            highlightedIds.has(p.id) && "bg-primary/15 ring-primary/30 ring-1"
          )}
        >
          <span className="text-muted-foreground/60 mr-2 font-mono text-xs">
            {p.id}
          </span>
          {p.text}
        </p>
      ))}
    </div>
  );
}
