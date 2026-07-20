import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { buildChatSystemPrompt } from "@/lib/ai/chat-prompts";
import type { Paragraph } from "@/types/database";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

function extractRefs(text: string, validIds: Set<number>): number[] {
  const ids = new Set<number>();
  for (const match of text.matchAll(/\[\[p:([\d,\s]+)\]\]/g)) {
    for (const part of match[1].split(",")) {
      const n = parseInt(part.trim(), 10);
      if (!Number.isNaN(n) && validIds.has(n)) ids.add(n);
    }
  }
  return Array.from(ids).sort((a, b) => a - b);
}

export async function POST(request: Request) {
  const encoder = new TextEncoder();

  let body: { contractId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const { contractId } = body;
  const trimmedMessage = body.message?.trim();
  if (!contractId || !trimmedMessage) {
    return new Response("Missing contractId or message.", { status: 400 });
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

  const { data: analysis } = await supabase
    .from("analyses")
    .select("summary")
    .eq("contract_id", contractId)
    .maybeSingle();

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("contract_id", contractId)
    .order("created_at", { ascending: true });

  const { error: insertUserError } = await supabase.from("chat_messages").insert({
    contract_id: contractId,
    user_id: user.id,
    role: "user",
    content: trimmedMessage,
  });
  if (insertUserError) {
    return new Response("Could not save your message. Please try again.", {
      status: 500,
    });
  }

  const paragraphs = contract.paragraphs as Paragraph[];
  const validIds = new Set(paragraphs.map((p) => p.id));
  const systemPrompt = buildChatSystemPrompt(
    paragraphs,
    analysis?.summary ?? "No analysis available yet."
  );

  const anthropicMessages = [
    ...(history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: trimmedMessage },
  ];

  const anthropic = new Anthropic();

  let cancelled = false;
  let activeStream: ReturnType<typeof anthropic.messages.stream> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = "";

      const persistAssistant = async (content: string) => {
        if (!content.trim()) return;
        const refs = extractRefs(content, validIds);
        await supabase.from("chat_messages").insert({
          contract_id: contractId,
          user_id: user.id,
          role: "assistant",
          content,
          refs,
        });
      };

      try {
        const claudeStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 4096,
          thinking: { type: "adaptive" },
          system: systemPrompt,
          messages: anthropicMessages,
        });
        activeStream = claudeStream;

        claudeStream.on("text", (delta) => {
          fullText += delta;
          if (!cancelled) controller.enqueue(encoder.encode(delta));
        });

        await claudeStream.finalMessage();
        await persistAssistant(fullText);
        if (!cancelled) controller.close();
      } catch (err) {
        await persistAssistant(fullText);
        if (!cancelled) {
          const messageText =
            err instanceof Error ? err.message : "Something went wrong.";
          controller.enqueue(encoder.encode(`\n\n[[ERROR:${messageText}]]`));
          controller.close();
        }
      }
    },
    cancel() {
      cancelled = true;
      activeStream?.abort();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
