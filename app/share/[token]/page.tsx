import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SharedAnalysisView } from "@/components/analysis/shared-analysis-view";
import { Button } from "@/components/ui/button";
import {
  recommendedQuestionsSchema,
  storedSectionsSchema,
  timelineSchema,
} from "@/lib/ai/schemas";

export const metadata: Metadata = {
  title: "Shared analysis",
  robots: { index: false, follow: false },
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: sharedLink } = await admin
    .from("shared_links")
    .select("contract_id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!sharedLink) notFound();
  if (sharedLink.expires_at && new Date(sharedLink.expires_at) < new Date()) {
    notFound();
  }

  const { data: contract } = await admin
    .from("contracts")
    .select("id, title, paragraphs")
    .eq("id", sharedLink.contract_id)
    .maybeSingle();
  if (!contract) notFound();

  const { data: analysis } = await admin
    .from("analyses")
    .select("risk_score, summary, sections, timeline, recommended_questions")
    .eq("contract_id", contract.id)
    .maybeSingle();
  if (!analysis) notFound();

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
    notFound();
  }

  return (
    <div className="bg-grain min-h-dvh">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4" />
            Shared analysis · ContractLens AI
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full"
            nativeButton={false}
            render={<Link href="/signup" />}
          >
            Analyze your own contract
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <h1 className="text-2xl font-semibold">{contract.title}</h1>
        <p className="text-muted-foreground/80 mt-2 text-xs">
          Not legal advice — ContractLens AI helps you understand documents, it
          does not replace a solicitor.
        </p>

        <div className="mt-6">
          <SharedAnalysisView
            paragraphs={contract.paragraphs}
            riskScore={analysis.risk_score}
            summary={analysis.summary}
            sections={sectionsResult.data}
            timeline={timelineResult.data}
            recommendedQuestions={questionsResult.data}
          />
        </div>
      </div>
    </div>
  );
}
