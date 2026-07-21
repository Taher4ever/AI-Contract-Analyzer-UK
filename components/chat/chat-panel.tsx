"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { SuggestedQuestions } from "./suggested-questions";
import { useHighlight } from "@/components/analysis/highlight-context";
import { clearChatMessages } from "@/app/(app)/dashboard/contracts/[id]/actions";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({
  contractId,
  initialMessages,
  recommendedQuestions,
  className,
}: {
  contractId: string;
  initialMessages: ChatMessageData[];
  recommendedQuestions: string[];
  className?: string;
}) {
  const { chatDraft, setChatDraft } = useHighlight();
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatDraft) {
      setInput(chatDraft);
      setChatDraft("");
    }
  }, [chatDraft, setChatDraft]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");
    const userMsg: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    const assistantMsg: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, message: trimmed }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error("Could not reach the assistant. Please try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const errorMatch = buffer.match(/\[\[ERROR:([\s\S]*)\]\]$/);
        const display = errorMatch ? buffer.slice(0, errorMatch.index) : buffer;

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: display };
          return next;
        });

        if (errorMatch) {
          setError(errorMatch[1]);
          break;
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.content === "") {
            return prev.slice(0, -1);
          }
          return prev;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const onClearConfirm = async () => {
    setIsClearing(true);
    const result = await clearChatMessages(contractId);
    setIsClearing(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    setMessages([]);
  };

  return (
    <div
      className={`glass shadow-soft flex h-[calc(100vh-16rem)] flex-col rounded-2xl lg:h-full ${className ?? ""}`}
    >
      <div className="border-border/60 flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary size-4" />
          <span className="text-sm font-semibold">Ask about this contract</span>
        </div>
        {messages.length > 0 && (
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-xs" aria-label="Clear conversation" />
              }
            >
              <Trash2 className="size-3.5" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear this conversation?</DialogTitle>
                <DialogDescription>
                  This deletes all messages in this chat. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button variant="destructive" disabled={isClearing} onClick={onClearConfirm}>
                  {isClearing && <Loader2 className="size-4 animate-spin" />}
                  Yes, clear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
              <MessageCircle className="size-6" />
            </div>
            <p className="text-muted-foreground text-sm">
              Ask anything about this contract. Answers cite the exact
              paragraphs they&apos;re based on.
            </p>
            <SuggestedQuestions recommendedQuestions={recommendedQuestions} onSelect={send} />
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                streaming={isStreaming && i === messages.length - 1 && m.role === "assistant"}
              />
            ))}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <div className="flex-1">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const last = [...messages].reverse().find((m) => m.role === "user");
                      if (last) send(last.content);
                    }}
                    className="mt-1 font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => send(input)}
        onStop={stop}
        disabled={isStreaming}
        isStreaming={isStreaming}
      />
    </div>
  );
}
