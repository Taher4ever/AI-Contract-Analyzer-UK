import "server-only";
import { extractTextItems } from "unpdf";
import mammoth from "mammoth";
import type { Paragraph } from "@/types/database";

export async function extractPdf(buffer: ArrayBuffer): Promise<string> {
  // unpdf's high-level extractText({ mergePages: true }) joins every line
  // with a single space and drops all line breaks, which destroys paragraph
  // boundaries entirely. Rebuild them from each item's hasEOL flag instead.
  const { items } = await extractTextItems(new Uint8Array(buffer));

  let text = "";
  for (const page of items) {
    for (const item of page) {
      text += item.str;
      if (item.hasEOL) text += "\n";
    }
    text += "\n\n";
  }
  return text;
}

export async function extractDocx(buffer: ArrayBuffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  return value;
}

const MIN_PARAGRAPH_LENGTH = 20;
const MAX_PARAGRAPH_LENGTH = 1200;

// Splits extracted contract text into indexed paragraphs: normalizes
// whitespace, breaks on blank lines and numbered-clause boundaries (e.g.
// "1.", "2.1", "(a)"), drops short fragments, and hard-splits anything
// still too long on a nearby sentence boundary.
export function splitIntoParagraphs(text: string): Paragraph[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  const rawChunks = normalized
    .split(/\n\s*\n+|\n(?=\d{1,2}(?:\.\d+)*\.?\s+[A-Z(])/)
    .map((chunk) => chunk.replace(/\s+/g, " ").trim())
    .filter((chunk) => chunk.length >= MIN_PARAGRAPH_LENGTH);

  const paragraphs: Paragraph[] = [];
  let id = 1;

  for (const chunk of rawChunks) {
    if (chunk.length <= MAX_PARAGRAPH_LENGTH) {
      paragraphs.push({ id: id++, text: chunk });
      continue;
    }

    let remaining = chunk;
    while (remaining.length > MAX_PARAGRAPH_LENGTH) {
      let splitAt = remaining.lastIndexOf(". ", MAX_PARAGRAPH_LENGTH);
      if (splitAt < MAX_PARAGRAPH_LENGTH * 0.5) splitAt = MAX_PARAGRAPH_LENGTH;
      paragraphs.push({ id: id++, text: remaining.slice(0, splitAt + 1).trim() });
      remaining = remaining.slice(splitAt + 1).trim();
    }
    if (remaining.length >= MIN_PARAGRAPH_LENGTH) {
      paragraphs.push({ id: id++, text: remaining });
    }
  }

  return paragraphs;
}
