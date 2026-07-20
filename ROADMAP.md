# ContractLens AI — Build Roadmap

AI-powered SaaS that explains UK legal documents in plain English: upload a contract (PDF/DOCX), get a risk score, plain-English summary, clause breakdown, timeline, and an AI chat about the document.

**Repo:** https://github.com/Taher4ever/AI-Contract-Analyzer-UK

## How to use this roadmap with Claude Code

1. Open Claude Code inside this project folder.
2. Do **one phase per session**. Start a fresh session (or `/clear`) between phases.
3. Paste this prompt (change the phase number):

```
Read CLAUDE.md, then implement phases/phase-01-design-system.md exactly.
Complete every task and acceptance criterion in order. Do not start work
from any other phase. Run the verification steps. Then tick this phase's
checkbox in ROADMAP.md, commit with the commit message specified in the
phase file, and push to origin main.
```

4. Review the result (run `npm run dev`, click around) before moving to the next phase.
5. Never skip a phase — later phases assume earlier ones are done.

## Global rules (apply to every phase)

- Every phase ends with: `npm run build` passes → commit → `git push origin main`.
- Conventional commit messages (`feat:`, `fix:`, `chore:`), exact message given in each phase file.
- Never commit `.env.local` or any secrets. `.env.example` documents every variable.
- TypeScript strict, no `any` unless unavoidable. Reusable components, Server Actions over ad-hoc API routes where possible.
- Every user-facing surface needs: loading skeleton, empty state, error state.
- UI bar: Apple-level premium — glassmorphism, soft shadows, rounded cards, smooth Framer Motion animations, full dark/light mode, responsive.

## Prerequisites (do once, before Phase 0)

- Node.js 20+, git, GitHub access to the repo above (already created, empty).
- Accounts/keys (needed from Phase 4 onward): Supabase project, OpenAI API key, Stripe test account, Google OAuth client (configured inside Supabase Auth).
- Vercel account (Phase 17).

## Phases

| # | Phase | File | Done |
|---|-------|------|------|
| 0 | Project init & GitHub | `phases/phase-00-setup.md` | [x] |
| 1 | Design system & layout shell | `phases/phase-01-design-system.md` | [x] |
| 2 | Landing page | `phases/phase-02-landing-page.md` | [x] |
| 3 | SEO, metadata & error pages | `phases/phase-03-seo-errors.md` | [x] |
| 4 | Supabase & database schema | `phases/phase-04-database.md` | [ ] |
| 5 | Authentication | `phases/phase-05-authentication.md` | [ ] |
| 6 | Dashboard shell | `phases/phase-06-dashboard-shell.md` | [ ] |
| 7 | Upload & text extraction | `phases/phase-07-upload.md` | [ ] |
| 8 | AI analysis engine | `phases/phase-08-ai-analysis.md` | [ ] |
| 9 | Analysis page (UI, highlights, timeline) | `phases/phase-09-analysis-page.md` | [ ] |
| 10 | AI chat | `phases/phase-10-ai-chat.md` | [ ] |
| 11 | Dashboard organization (search, folders, favorites) | `phases/phase-11-dashboard-features.md` | [ ] |
| 12 | Export & shareable links | `phases/phase-12-export.md` | [ ] |
| 13 | Stripe billing & teams | `phases/phase-13-billing.md` | [ ] |
| 14 | Admin panel & blog CMS | `phases/phase-14-admin.md` | [ ] |
| 15 | Public blog | `phases/phase-15-blog.md` | [ ] |
| 16 | Performance, accessibility & polish | `phases/phase-16-polish.md` | [ ] |
| 17 | Docker, docs & deployment | `phases/phase-17-deploy.md` | [ ] |

## Milestones

- After Phase 3: polished public marketing site, deployable.
- After Phase 10: core product works end-to-end (upload → analysis → chat).
- After Phase 13: monetized SaaS.
- After Phase 17: production on Vercel.
