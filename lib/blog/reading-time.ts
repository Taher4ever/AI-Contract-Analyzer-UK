const WORDS_PER_MINUTE = 200;

export function readingTime(markdown: string): number {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_>`~-]/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
