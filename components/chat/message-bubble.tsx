"use client";

import ReactMarkdown from "react-markdown";
import { useHighlight } from "@/components/analysis/highlight-context";

function citationsToMarkdownLinks(content: string): string {
  return content.replace(/\[\[p:([\d,\s]+)\]\]/g, (_, nums: string) =>
    nums
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((id) => `[¶${id}](#p${id})`)
      .join(" ")
  );
}

export function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const { highlight } = useHighlight();

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="glass shadow-soft max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            a: ({ href, children }) => {
              const match = href?.match(/^#p(\d+)$/);
              if (match) {
                const id = parseInt(match[1], 10);
                return (
                  <button
                    type="button"
                    onClick={() => highlight([id])}
                    className="bg-primary/10 text-primary mx-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium align-middle hover:underline"
                  >
                    {children}
                  </button>
                );
              }
              return (
                <a href={href} target="_blank" rel="noreferrer" className="underline">
                  {children}
                </a>
              );
            },
          }}
        >
          {citationsToMarkdownLinks(content)}
        </ReactMarkdown>
        {streaming && (
          <span className="bg-foreground ml-0.5 inline-block h-3.5 w-[2px] animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}
