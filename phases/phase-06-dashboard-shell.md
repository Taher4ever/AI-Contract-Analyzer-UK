# Phase 6 — Dashboard shell

**Depends on:** Phase 5.
**Goal:** Protected app layout: sidebar, topbar, dashboard home with stats and empty states.

## Tasks

1. `app/(app)/layout.tsx`: auth check (redirect if no session), fetch profile once, render sidebar + topbar + content area.
2. `components/dashboard/sidebar.tsx`: logo, nav — Dashboard, Contracts, Folders, Favorites, Billing, Settings (lucide icons, active state with animated indicator), plan badge at bottom (Free/Pro/Team) with "Upgrade" link. Collapsible on desktop, sheet drawer on mobile.
3. `components/dashboard/topbar.tsx`: page title slot, global search input (wired in Phase 11 — disabled placeholder now), theme toggle, avatar dropdown (Settings, Sign out).
4. `app/(app)/dashboard/page.tsx`: greeting ("Good morning, {name}"), stat cards (Contracts analyzed, This month usage `n/3` for free plan with progress ring, Average risk score) using AnimatedNumber, "Recent contracts" list (empty for now) and a prominent "Upload contract" glass card CTA → `/dashboard/upload`.
5. Empty state component `components/shared/empty-state.tsx` (icon, title, description, action button) — used everywhere later.
6. Loading skeletons: `app/(app)/dashboard/loading.tsx` with skeleton cards.
7. `app/(app)/dashboard/settings/page.tsx`: profile form (full name, avatar upload to storage), email display, delete account (confirm dialog, danger zone).
8. Page transition animation for dashboard routes (subtle fade/slide via template.tsx).

## Acceptance criteria

- [ ] Sidebar responsive (collapsible desktop, drawer mobile), active states correct.
- [ ] Dashboard shows real user name + zero-state stats from DB.
- [ ] Settings updates profile row and avatar.
- [ ] Skeletons appear during navigation; both themes clean.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: dashboard shell with sidebar, stats, settings and empty states"
git push origin main
```
