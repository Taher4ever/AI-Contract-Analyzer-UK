# Phase 7 — Upload & text extraction

**Depends on:** Phase 6.
**Goal:** Upload PDF/DOCX (click or drag & drop), store file, extract text into indexed paragraphs, enforce free-plan limit.

## Tasks

1. Install `unpdf` (PDF text extraction, serverless-safe) and `mammoth` (DOCX).
2. `app/(app)/dashboard/upload/page.tsx` + `components/dashboard/upload-dropzone.tsx`:
   - Large glass dropzone: drag & drop + click to browse. Accept only `.pdf`/`.docx`, max 10 MB; instant client-side validation with shake animation + toast on invalid file.
   - States: idle → dragging (glow border) → uploading (progress) → processing (animated steps: "Uploading… Extracting text… Preparing analysis") → done (success check animation, redirect to analysis page).
3. Server action `app/(app)/dashboard/upload/actions.ts` → `uploadContract(formData)`:
   - Auth check. **Plan limit:** if profile plan is `free` and user already has ≥3 contracts created this calendar month → return `limit_reached` (UI shows upgrade dialog linking to `/dashboard/billing`).
   - Upload file to storage bucket `contracts/{userId}/{uuid}.{ext}`.
   - Extract text (unpdf/mammoth by type). Fail with friendly error if no extractable text (likely scanned PDF).
   - Split into paragraphs: normalize whitespace, split on blank lines/numbered-clause boundaries, drop fragments < 20 chars, cap paragraph length ~1200 chars (split longer). Result: `[{id: 1..n, text}]`.
   - Insert `contracts` row (title = filename without extension, status `uploaded`, paragraphs jsonb). Return contract id; client redirects to `/dashboard/contracts/{id}` (page built next phases — placeholder route with "Analysis coming in Phase 8" is fine).
4. `lib/extraction/extract.ts`: pure functions `extractPdf(buffer)`, `extractDocx(buffer)`, `splitIntoParagraphs(text)` — unit-testable, typed.
5. Show current month usage (`n/3`) on the upload page for free users.

## Acceptance criteria

- [ ] Real PDF and DOCX upload end-to-end; contract row has sensible paragraphs jsonb (spot-check in Supabase).
- [ ] Drag & drop and click both work; invalid type/size rejected client-side.
- [ ] 4th upload in a month on free plan blocked with upgrade dialog.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: contract upload with drag-and-drop, text extraction and plan limits"
git push origin main
```
