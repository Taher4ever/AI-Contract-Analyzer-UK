# Phase 0 — Project init & GitHub

**Depends on:** nothing.
**Goal:** Next.js 15 project scaffolded, tooling configured, pushed to GitHub.

## Tasks

1. Scaffold in the current folder: `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"` (keep existing ROADMAP.md, CLAUDE.md, phases/).
2. Install core deps: `framer-motion next-themes lucide-react zod`.
3. Init shadcn/ui: `npx shadcn@latest init` (defaults, CSS variables). Add starter components: `button card input label dropdown-menu dialog sonner skeleton badge tabs avatar separator tooltip sheet`.
4. Create empty folder structure from CLAUDE.md (`components/{marketing,dashboard,analysis,chat,admin,shared}`, `lib/{supabase,ai,stripe,extraction}`, `types`, `supabase/migrations`) with `.gitkeep` files.
5. Create `.env.example` with every variable listed in CLAUDE.md (empty values). Ensure `.gitignore` covers `.env*.local` and `.env`.
6. Add Prettier: `prettier` + `prettier-plugin-tailwindcss`, `.prettierrc`, `format` script.
7. Minimal `README.md`: project name, one-line description, "Setup" (clone, `npm i`, copy `.env.example` → `.env.local`, `npm run dev`). Will be expanded in Phase 17.
8. Git: `git init` (if needed), `git branch -M main`, `git remote add origin https://github.com/Taher4ever/AI-Contract-Analyzer-UK.git`.

## Acceptance criteria

- [ ] `npm run dev` serves the default page without errors.
- [ ] `npm run build` and `npm run lint` pass.
- [ ] shadcn/ui components exist under `components/ui/`.
- [ ] `.env.example` committed; no real secrets anywhere.

## Commit & push

```
git add -A
git commit -m "chore: scaffold Next.js 15 project with Tailwind, shadcn/ui and tooling"
git push -u origin main
```
