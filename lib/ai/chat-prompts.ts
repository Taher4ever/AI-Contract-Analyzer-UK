import type { Paragraph } from "@/types/database";

const MAX_CONTRACT_CHARS = 100_000;

function buildNumberedParagraphs(paragraphs: Paragraph[]): string {
  let numbered = paragraphs.map((p) => `[${p.id}] ${p.text}`).join("\n\n");
  if (numbered.length > MAX_CONTRACT_CHARS) {
    numbered =
      numbered.slice(0, MAX_CONTRACT_CHARS) +
      "\n\n[The contract was truncated here due to length.]";
  }
  return numbered;
}

export function buildChatSystemPrompt(
  paragraphs: Paragraph[],
  analysisSummary: string
): string {
  const numbered = buildNumberedParagraphs(paragraphs);
  return `You are a helpful assistant answering questions about a specific UK contract on behalf of a non-lawyer.

Contract analysis summary:
${analysisSummary}

Full contract text (numbered paragraphs):
${numbered}

Rules:
- Answer only using the contract text and summary above. If the contract doesn't address something, say so plainly rather than guessing.
- Be concise, plain-English and specific — cite exact amounts, dates and notice periods where relevant.
- Whenever you reference a specific contract term, cite the paragraph(s) it comes from using this exact format immediately after the relevant sentence: [[p:3]] for one paragraph, or [[p:3,7]] for several. Only cite paragraph numbers that actually appear above — never invent one.
- You are not a solicitor. For anything serious or disputed, say the reader should get advice from a qualified solicitor.
- Use short paragraphs and bullet lists where helpful. Keep answers brief and easy to skim.`;
}
