# Phase 1 — Design system & layout shell

**Depends on:** Phase 0.
**Goal:** Premium Apple-level visual foundation: theme, typography, glassmorphism, dark/light mode, navbar + footer.

## Tasks

1. Typography: load `Inter` (UI) and `Lora` or `Newsreader` (display headings) via `next/font` in root layout. Tailwind: `font-sans`, `font-display`.
2. Theme tokens in `app/globals.css` (shadcn CSS variables, both `:root` and `.dark`): refined palette — near-white warm background / deep slate dark background, one confident accent (deep blue `hsl(221 83% 53%)` area), generous radius (`--radius: 1rem`).
3. Utilities in globals.css: `.glass` (translucent bg + `backdrop-blur-xl` + subtle border), `.glass-strong`, soft shadow utilities (`shadow-soft`: large blur, low opacity). Subtle grain/gradient background for marketing pages.
4. Dark/light mode: `ThemeProvider` (next-themes) in root layout, `components/shared/theme-toggle.tsx` with animated sun/moon icon. No flash on load (`suppressHydrationWarning`).
5. `components/shared/navbar.tsx`: sticky, glassmorphism on scroll, logo ("ContractLens AI" wordmark, simple lens/document SVG mark), links (Features, Pricing, FAQ, Blog), theme toggle, "Sign in" ghost button + "Analyze Contract" primary button. Mobile: sheet menu.
6. `components/shared/footer.tsx`: 4 columns (Product, Company, Legal, Social), disclaimer line "ContractLens AI provides information, not legal advice."
7. `components/shared/logo.tsx`, `components/shared/container.tsx` (max-w-7xl px wrapper).
8. Motion primitives in `components/shared/motion.tsx`: `FadeIn`, `FadeInStagger`, `AnimatedNumber` (client components wrapping Framer Motion, viewport-triggered, respect `prefers-reduced-motion`).
9. Apply navbar+footer in `app/(marketing)/layout.tsx`; move home page to `app/(marketing)/page.tsx` (placeholder content for now).

## Acceptance criteria

- [ ] Theme toggle switches dark/light instantly, persists on reload, no flash.
- [ ] Navbar is glassy when scrolled, works on mobile (sheet).
- [ ] `.glass` and shadow utilities render correctly in both themes.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: design system, dark mode, glassmorphism, navbar and footer"
git push origin main
```
