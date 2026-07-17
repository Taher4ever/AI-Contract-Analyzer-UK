# Phase 16 — Performance, accessibility & polish

**Depends on:** Phase 15.
**Goal:** 95+ Lighthouse, WCAG AA, and final micro-interaction polish across the app.

## Tasks

1. **Performance audit**: run Lighthouse (or `npx unlighthouse`) on home, pricing, blog, login. Fix to ≥95 performance/SEO/best-practices:
   - All images via `next/image` with proper `sizes`; fonts already via `next/font` (verify no layout shift).
   - Dynamic-import heavy client components (chat panel, charts, pdf renderer) with `next/dynamic`.
   - Check bundle: `@next/bundle-analyzer`; remove accidental client-side imports of server-only libs (stripe, docx, unpdf must never reach the client bundle).
   - Edge runtime for `app/api/chat/route.ts` if compatible; static/ISR for all marketing pages (verify with build output — marketing routes should be ○/ISR, not λ).
2. **Accessibility (WCAG AA)**:
   - Keyboard pass: every interactive element tabbable, visible focus rings (styled, not removed), dialogs trap focus + Esc, dropzone operable via keyboard (Enter opens file picker), chat send on Enter documented via `aria-label`.
   - Semantics: single h1 per page, landmarks (nav/main/footer), labels on all inputs, `aria-live="polite"` for streaming chat + analysis progress, alt text everywhere.
   - Contrast check both themes (fix any AA failures, esp. muted text on glass).
   - `prefers-reduced-motion` verified globally.
3. **Micro-interactions sweep**: consistent button press scale (0.98), card hover lifts, toast animations, page transitions (marketing + dashboard), success states (upload done, payment success, share copied) — small spring animations, no jank.
4. **States sweep**: click through every route logged-out/free/pro/admin — confirm every surface has loading skeleton, empty state, error state; fix gaps.
5. Cross-browser/mobile pass: Safari + Chrome, 360px width, iOS safe areas.

## Acceptance criteria

- [ ] Lighthouse ≥95 (performance, SEO, best practices) and ≥95 accessibility on home, pricing, blog post, login.
- [ ] Full keyboard-only journey: land → sign in → upload → read analysis → chat → export.
- [ ] Marketing routes static/ISR in build output; no server-only lib in client bundle.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "perf: lighthouse 95+, WCAG AA accessibility and interaction polish"
git push origin main
```
