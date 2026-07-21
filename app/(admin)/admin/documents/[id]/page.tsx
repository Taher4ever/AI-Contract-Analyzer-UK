import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileWarning } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SharedAnalysisView } from "@/components/analysis/shared-analysis-view";
import { EmptyState } from "@/components/shared/empty-state";
import {
  recommendedQuestionsSchema,
  storedSectionsSchema,
  timelineSchema,
} from "@/lib/ai/schemas";

export const metadata: Metadata = { title: "Admin Document" };

export default async function AdminDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: contract } = await admin
    .from("contracts")
    .select("id, title, paragraphs, status, user_id")
    .eq("id", id)
    .maybeSingle();
  if (!contract) notFound();

  const { data: owner } = await admin
    .from("profiles")
    .select("email")
    .eq("id", contract.user_id)
    .maybeSingle();

  const { data: analysis } = await admin
    .from("analyses")
    .select("risk_score, summary, sections, timeline, recommended_questions")
    .eq("contract_id", contract.id)
    .maybeSingle();

  const sectionsResult = analysis ? storedSectionsSchema.safeParse(analysis.sections) : null;
  const timelineResult = analysis ? timelineSchema.safeParse(analysis.timeline) : null;
  const questionsResult = analysis
    ? recommendedQuestionsSchema.safeParse(analysis.recommended_questions)
    : null;

  const hasValidAnalysis =
    analysis &&
    sectionsResult?.success &&
    timelineResult?.success &&
    questionsResult?.success &&
    analysis.risk_score !== null &&
    analysis.summary !== null;

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/admin/documents"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" />
        Documents
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold">{contract.title}</h1>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">Owned by {owner?.email ?? "—"}</p>

      <div className="mt-6">
        {hasValidAnalysis && sectionsResult?.success && timelineResult?.success && questionsResult?.success ? (
          <SharedAnalysisView
            paragraphs={contract.paragraphs}
            riskScore={analysis!.risk_score!}
            summary={analysis!.summary!}
            sections={sectionsResult.data}
            timeline={timelineResult.data}
            recommendedQuestions={questionsResult.data}
          />
        ) : (
          <div className="glass shadow-soft rounded-2xl">
            <EmptyState
              icon={FileWarning}
              title="No analysis available"
              description={
                contract.status === "processing"
                  ? "This document is still being analyzed."
                  : contract.status === "failed"
                    ? "Analysis failed for this document."
                    : "This document hasn't been analyzed yet."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
