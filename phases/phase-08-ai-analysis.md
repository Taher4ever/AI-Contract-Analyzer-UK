# Phase 8 — AI analysis engine

**Depends on:** Phase 7. **User setup first:** `OPENAI_API_KEY` in `.env.local`.
**Goal:** Contract text → structured analysis (risk score, summary, clauses, timeline) stored in DB, with live progress UI.

## Tasks

1. Install `ai @ai-sdk/openai`.
2. `lib/ai/schemas.ts` — zod schema `analysisSchema`:
   - `riskScore` (0–100 int) + `riskLevel` (`low`/`medium`/`high`) + `riskExplanation`.
   - `summary`: 2–3 plain-English paragraphs.
   - `contractType` (e.g. tenancy, employment, freelance, NDA, other).
   - `sections` — arrays of findings for: `hiddenRisks`, `importantClauses`, `financialObligations`, `terminationClauses`, `cancellationRules`. Each finding: `{ title, explanation (plain English), severity: 'info'|'warning'|'danger', paragraphIds: number[] }`.
   - `noticePeriod`: `{ value: string|null, explanation, paragraphIds }`.
   - `autoRenewal`: `{ present: boolean, explanation, paragraphIds }`.
   - `missingClauses`: `[{ title, whyItMatters }]`.
   - `timeline`: `[{ date: string(ISO)|null, label, type: 'renewal'|'termination'|'deadline'|'payment', explanation, paragraphIds }]`.
   - `recommendedQuestions`: string[] (5–8 questions to ask the other party).
3. `lib/ai/prompts.ts` — system prompt: senior UK contracts analyst; explain for a non-lawyer in plain British English; be specific about amounts/dates; **only reference paragraphIds that exist**; flag unfair/unusual terms (UK consumer/tenancy/employment norms); never invent facts; if something is absent say so. User prompt builds numbered paragraphs: `[1] text…`.
4. `app/api/analyze/route.ts` (POST, contract id):
   - Auth + ownership check; set contract status `processing`.
   - `streamObject` with `openai(process.env.OPENAI_MODEL)`, schema above, temperature 0.2. On finish: validate, upsert `analyses` row (sections/timeline/recommended_questions jsonb), set contract status `analyzed` (or `failed` + error toast path).
   - Handle long contracts: if total text > ~100k chars, truncate with note appended to prompt.
5. `app/(app)/dashboard/contracts/[id]/page.tsx` (temporary version): if no analysis → auto-start: client component calls the endpoint and renders **streaming progress** — animated step list ("Reading document", "Scoring risk", "Extracting clauses"…) driven by partial object keys arriving, with shimmer. When done → `router.refresh()` to show stored analysis JSON (raw `<pre>` acceptable this phase; real UI is Phase 9). If analysis exists → render raw JSON.
6. "Re-analyze" button (deletes analysis row, restarts).

## Acceptance criteria

- [ ] Uploading a real contract produces a stored, schema-valid analysis with paragraphIds that exist in the contract.
- [ ] Progress UI streams live states; failure path sets status `failed` with retry button.
- [ ] Re-running analysis replaces the old row (unique contract_id).
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: streaming AI analysis engine with structured clause extraction"
git push origin main
```
