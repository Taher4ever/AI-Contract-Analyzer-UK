import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { analysisSchema } from "@/lib/ai/schemas";
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisUserPrompt } from "@/lib/ai/prompts";
import type { Paragraph } from "@/types/database";

const MAX_CHARS = 100_000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) return fenceMatch[1];
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function keepValidParagraphIds(ids: number[], validIds: Set<number>): number[] {
  return ids.filter((id) => validIds.has(id));
}

export async function POST(request: Request) {
  const encoder = new TextEncoder();

  let body: { contractId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const { contractId } = body;
  if (!contractId) {
    return new Response("Missing contractId.", { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Not signed in.", { status: 401 });

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, paragraphs")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();

  if (!contract) return new Response("Contract not found.", { status: 404 });

  await supabase
    .from("contracts")
    .update({ status: "processing" })
    .eq("id", contractId);

  const paragraphs = contract.paragraphs as Paragraph[];
  const validIds = new Set(paragraphs.map((p) => p.id));

  let userPrompt = buildAnalysisUserPrompt(paragraphs);
  if (userPrompt.length > MAX_CHARS) {
    userPrompt =
      userPrompt.slice(0, MAX_CHARS) +
      "\n\n[The contract was truncated here due to length. Base your analysis only on the text provided above.]";
  }

  const anthropic = new Anthropic();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = "";

      const fail = async (message: string) => {
        await supabase
          .from("contracts")
          .update({ status: "failed" })
          .eq("id", contractId);
        controller.enqueue(encoder.encode(`\n\n[[ERROR:${message}]]`));
        controller.close();
      };

      try {
        const claudeStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 16000,
          thinking: { type: "adaptive" },
          output_config: { effort: "high" },
          system: ANALYSIS_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        });

        claudeStream.on("text", (delta) => {
          fullText += delta;
          controller.enqueue(encoder.encode(delta));
        });

        await claudeStream.finalMessage();

        const jsonText = extractJson(fullText);
        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(jsonText);
        } catch {
          await fail("The AI response wasn't valid JSON.");
          return;
        }

        const result = analysisSchema.safeParse(parsedJson);
        if (!result.success) {
          await fail(
            `The AI response didn't match the expected shape: ${result.error.issues[0]?.message ?? "unknown error"}`
          );
          return;
        }

        const analysis = result.data;

        const sections = {
          riskLevel: analysis.riskLevel,
          riskExplanation: analysis.riskExplanation,
          contractType: analysis.contractType,
          findings: {
            hiddenRisks: analysis.sections.hiddenRisks.map((f) => ({
              ...f,
              paragraphIds: keepValidParagraphIds(f.paragraphIds, validIds),
            })),
            importantClauses: analysis.sections.importantClauses.map((f) => ({
              ...f,
              paragraphIds: keepValidParagraphIds(f.paragraphIds, validIds),
            })),
            financialObligations: analysis.sections.financialObligations.map(
              (f) => ({
                ...f,
                paragraphIds: keepValidParagraphIds(f.paragraphIds, validIds),
              })
            ),
            terminationClauses: analysis.sections.terminationClauses.map(
              (f) => ({
                ...f,
                paragraphIds: keepValidParagraphIds(f.paragraphIds, validIds),
              })
            ),
            cancellationRules: analysis.sections.cancellationRules.map(
              (f) => ({
                ...f,
                paragraphIds: keepValidParagraphIds(f.paragraphIds, validIds),
              })
            ),
          },
          noticePeriod: {
            ...analysis.noticePeriod,
            paragraphIds: keepValidParagraphIds(
              analysis.noticePeriod.paragraphIds,
              validIds
            ),
          },
          autoRenewal: {
            ...analysis.autoRenewal,
            paragraphIds: keepValidParagraphIds(
              analysis.autoRenewal.paragraphIds,
              validIds
            ),
          },
          missingClauses: analysis.missingClauses,
        };

        const timeline = analysis.timeline.map((t) => ({
          ...t,
          paragraphIds: keepValidParagraphIds(t.paragraphIds, validIds),
        }));

        const { error: upsertError } = await supabase
          .from("analyses")
          .upsert(
            {
              contract_id: contractId,
              risk_score: analysis.riskScore,
              summary: analysis.summary,
              sections,
              timeline,
              recommended_questions: analysis.recommendedQuestions,
              model: MODEL,
            },
            { onConflict: "contract_id" }
          );

        if (upsertError) {
          await fail("Could not save the analysis. Please try again.");
          return;
        }

        await supabase
          .from("contracts")
          .update({ status: "analyzed" })
          .eq("id", contractId);

        controller.close();
      } catch (err) {
        await fail(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
