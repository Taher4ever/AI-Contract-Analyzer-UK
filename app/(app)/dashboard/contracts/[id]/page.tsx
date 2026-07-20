import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnalysisRunner } from "@/components/dashboard/analysis-runner";
import { ReanalyzeButton } from "@/components/dashboard/reanalyze-button";
import { AnalysisPageClient } from "@/components/analysis/analysis-page-client";
import {
  recommendedQuestionsSchema,
  storedSectionsSchema,
  timelineSchema,
} from "@/lib/ai/schemas";

export const metadata: Metadata = { title: "Contract" };

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, title, original_filename, status, is_favorite, paragraphs, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!contract) notFound();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("contract_id", id)
    .maybeSingle();

  if (!analysis) {
    return (
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <h1 className="text-2xl font-semibold">{contract.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {contract.original_filename}
        </p>
        <div className="mt-6">
          <AnalysisRunner contractId={contract.id} />
        </div>
      </div>
    );
  }

  const sectionsResult = storedSectionsSchema.safeParse(analysis.sections);
  const timelineResult = timelineSchema.safeParse(analysis.timeline);
  const questionsResult = recommendedQuestionsSchema.safeParse(
    analysis.recommended_questions
  );

  if (
    !sectionsResult.success ||
    !timelineResult.success ||
    !questionsResult.success ||
    analysis.risk_score === null ||
    analysis.summary === null
  ) {
    return (
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <h1 className="text-2xl font-semibold">{contract.title}</h1>
        <div className="glass shadow-soft mt-6 flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="font-semibold">This analysis couldn&apos;t be loaded</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            The stored analysis doesn&apos;t match the expected format. Try
            re-analyzing the document.
          </p>
          <ReanalyzeButton contractId={contract.id} label="Re-analyze" />
        </div>
      </div>
    );
  }

  return (
    <AnalysisPageClient
      contractId={contract.id}
      title={contract.title}
      createdAt={contract.created_at}
      isFavorite={contract.is_favorite}
      paragraphs={contract.paragraphs}
      riskScore={analysis.risk_score}
      summary={analysis.summary}
      sections={sectionsResult.data}
      timeline={timelineResult.data}
      recommendedQuestions={questionsResult.data}
    />
  );
}
