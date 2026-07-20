"use client";

import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  disabled,
  isStreaming,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  disabled: boolean;
  isStreaming: boolean;
}) {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  return (
    <div className="border-border/60 flex items-end gap-2 border-t p-3">
      <textarea
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Ask about this contract…"
        className="text-foreground placeholder:text-muted-foreground max-h-40 flex-1 resize-none bg-transparent text-sm outline-none disabled:opacity-60"
      />
      {isStreaming ? (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onStop}
          aria-label="Stop"
        >
          <Square className="size-3.5 fill-current" />
        </Button>
      ) : (
        <Button
          type="button"
          size="icon-sm"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      )}
    </div>
  );
}
