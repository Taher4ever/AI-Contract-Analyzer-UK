# Phase 10 — AI chat

**Depends on:** Phase 9.
**Goal:** Unlimited streaming Q&A about the uploaded contract, with answers that cite and highlight paragraphs. Components in `components/chat/`.

## Tasks

1. `app/api/chat/route.ts` (POST): auth + contract ownership; system prompt = UK contracts assistant + full numbered paragraphs + stored analysis summary as context. `streamText` with message history. Instruct model to append paragraph citations in the form `[[p:3,7]]` at the end of relevant sentences. Persist user + assistant messages to `chat_messages` (assistant on stream finish, extracted refs into `refs`).
2. Chat UI (`chat-panel.tsx`) — third pane/tab on the analysis page (desktop: collapsible right drawer or tab with the contract pane; mobile: Chat tab):
   - `useChat` (Vercel AI SDK), history loaded from DB on mount.
   - Message bubbles (user accent / assistant glass), streaming text with blinking caret, markdown rendering.
   - Parse `[[p:...]]` tokens out of display text → render as small "¶ 3" citation chips; clicking a chip calls the highlight system from Phase 9.
   - Suggested question chips above input when history is empty: "What happens if I leave early?", "Can they increase the rent?", "Who owns the intellectual property?", "Is there any hidden fee?" + the analysis' `recommendedQuestions`. Clicking sends it.
   - Input: textarea autosize, Enter to send / Shift+Enter newline, disabled while streaming, stop button.
   - States: empty (illustration + suggestions), error (retry), loading history skeleton.
3. "Ask AI about this" mini-button on each finding card (Phase 9 cards) → opens chat prefilled with a question about that clause.
4. Clear-conversation action (confirm dialog, deletes messages).

## Acceptance criteria

- [ ] Questions stream answers grounded in the actual contract; citation chips highlight the right paragraphs.
- [ ] History persists across reloads; clear works.
- [ ] Suggested questions send correctly; mobile tab UX clean.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: streaming contract chat with paragraph citations and suggested questions"
git push origin main
```
