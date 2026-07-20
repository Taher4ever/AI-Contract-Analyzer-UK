const DEFAULT_QUESTIONS = [
  "What happens if I leave early?",
  "Can they increase the rent?",
  "Who owns the intellectual property?",
  "Is there any hidden fee?",
];

export function SuggestedQuestions({
  recommendedQuestions,
  onSelect,
}: {
  recommendedQuestions: string[];
  onSelect: (question: string) => void;
}) {
  const questions = Array.from(
    new Set([...DEFAULT_QUESTIONS, ...recommendedQuestions])
  ).slice(0, 8);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="border-border/60 hover:bg-muted rounded-full border px-3 py-1.5 text-left text-xs transition-colors"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
