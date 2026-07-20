"use client";

import { Copy, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RecommendedQuestions({ questions }: { questions: string[] }) {
  if (questions.length === 0) return null;

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(questions.join("\n"));
      toast.success("Questions copied to clipboard.");
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  return (
    <div className="glass shadow-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Questions to ask</h2>
        <Button variant="outline" size="sm" className="rounded-full" onClick={copyAll}>
          <Copy className="size-3.5" />
          Copy all
        </Button>
      </div>
      <ol className="mt-4 space-y-3">
        {questions.map((question, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
              <MessageCircleQuestion className="size-3.5" />
            </div>
            <p className="text-sm leading-relaxed">{question}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
