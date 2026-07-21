import { createClient } from "@/lib/supabase/server";
import {
  recommendedQuestionsSchema,
  storedSectionsSchema,
  timelineSchema,
} from "@/lib/ai/schemas";
import type { PdfReportProps } from "@/lib/export/pdf-report";

export async function fetchReportData(
  contractId: string
): Promise<{ error: string; status: number } | { data: PdfReportProps }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 };

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, title, created_at")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();
  if (!contract) return { error: "Contract not found.", status: 404 };

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("contract_id", contractId)
    .maybeSingle();
  if (!analysis) {
    return { error: "No analysis available for this contract.", status: 404 };
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
    return { error: "The stored analysis is in an unexpected format.", status: 422 };
  }

  return {
    data: {
      title: contract.title,
      createdAt: contract.created_at,
      riskScore: analysis.risk_score,
      summary: analysis.summary,
      sections: sectionsResult.data,
      timeline: timelineResult.data,
      recommendedQuestions: questionsResult.data,
    },
  };
}
