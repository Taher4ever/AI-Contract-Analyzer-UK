# Phase 11 — Dashboard organization

**Depends on:** Phase 10.
**Goal:** Contracts list, search, folders, favorites, history — the daily-driver dashboard.

## Tasks

1. `app/(app)/dashboard/contracts/page.tsx`: all contracts as rows/cards — file-type icon, title, contract type badge, risk score chip, folder, date (`en-GB`), status. Actions per row: open, favorite toggle (optimistic star animation), move to folder, rename (inline), delete (confirm). Sort: newest / oldest / risk high→low. Filter chips: All, Favorites, by folder, by status.
2. **Search**: wire the topbar input from Phase 6 — debounced, searches title + contract type (Postgres `ilike`), results dropdown with keyboard navigation (↑↓ Enter), `⌘K` opens it (shadcn command palette style).
3. **Folders** `app/(app)/dashboard/folders/page.tsx`: create/rename/delete folders (delete keeps contracts, un-filed), folder cards with counts, click → filtered contracts view `/dashboard/folders/[id]`. Move-to-folder also available from the contract page header.
4. **Favorites** `app/(app)/dashboard/favorites/page.tsx`: favorited contracts, same row component (reuse `contract-row.tsx`).
5. **Dashboard home** (Phase 6 page) now real: Recent contracts (last 5, clickable), stats computed from data (total, this-month usage, average risk score).
6. Server actions in `app/(app)/dashboard/contracts/actions.ts`: rename, toggleFavorite, moveToFolder, deleteContract (also removes storage file + cascades analysis/chat), createFolder, renameFolder, deleteFolder. All auth-checked + revalidated.
7. Empty states everywhere (no contracts yet → upload CTA; no favorites; empty folder; no search results).

## Acceptance criteria

- [ ] Search finds contracts by partial title; ⌘K works; keyboard navigation works.
- [ ] Folders CRUD + moving contracts works; counts correct.
- [ ] Favorite toggle is optimistic and persists; delete removes storage file too.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: contracts list, search, folders and favorites"
git push origin main
```
