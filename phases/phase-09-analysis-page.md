# Phase 9 — Analysis page (UI, highlights, timeline)

**Depends on:** Phase 8.
**Goal:** The flagship screen: beautiful analysis report + contract text side-by-side with paragraph highlighting + timeline. Components in `components/analysis/`.

## Layout

Two-pane on desktop (report left ~55%, contract text right ~45%, independently scrollable); tabs on mobile ("Analysis" / "Contract" / "Chat"). Header: contract title (inline-editable), contract type badge, date, actions (Favorite ★, Export — Phase 12 placeholder, Re-analyze, Delete with confirm).

## Tasks

1. **Risk score hero** (`risk-score.tsx`): animated circular gauge counting up to score, color by level (green/amber/red), risk explanation beside it. "Not legal advice" disclaimer line under it.
2. **Summary card**: plain-English summary, generous typography.
3. **Section accordions/cards** for: Hidden Risks, Important Clauses, Financial Obligations, Termination Clauses, Cancellation Rules — each finding rendered as `finding-card.tsx`: severity icon+color (info blue / warning amber / danger red), title, explanation, and a "View in contract →" link when paragraphIds exist.
4. **Key facts row**: Notice Period, Auto-Renewal (yes/no chip) as compact glass stat cards, each clickable → highlight.
5. **Missing clauses** card: amber list with "why it matters".
6. **Recommended questions** card: numbered list, copy-all button. (Each question becomes a chat shortcut in Phase 10.)
7. **Timeline** (`timeline.tsx`): vertical timeline of `timeline` entries sorted by date — icon per type (renewal/termination/deadline/payment), date formatted `en-GB`, relative badge ("in 3 months", "overdue" red). Entries with null dates listed under "Date not specified".
8. **Contract pane** (`contract-viewer.tsx`): renders `paragraphs` as readable numbered text blocks.
9. **Highlight system** (`highlight-context.tsx` — React context):
   - `highlight(paragraphIds)` → contract pane scrolls to first paragraph (smooth), flashes/holds a soft accent background on all referenced paragraphs, clears previous highlight.
   - Every "View in contract" / key-fact / timeline click uses it. On mobile it switches to the Contract tab first.
10. Polish: loading skeleton for the whole page, framer-motion entrance stagger for cards.

## Acceptance criteria

- [ ] Clicking any finding scrolls the contract pane and visibly highlights the exact paragraph(s).
- [ ] Gauge animates; severity colors consistent in both themes.
- [ ] Timeline sorted with correct relative labels; mobile tabs work.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: analysis page with risk gauge, clause findings, highlights and timeline"
git push origin main
```
