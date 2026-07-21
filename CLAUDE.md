# CLAUDE.md — ContractLens AI

SaaS that explains UK legal documents in plain English. Users upload a contract (PDF/DOCX) → AI produces risk score, summary, clause analysis, timeline → user chats with AI about the document. Includes billing (Stripe), admin panel, and blog.

**This project is built phase by phase from `ROADMAP.md` + `phases/*.md`. Only implement the phase you were asked to implement. Do not jump ahead.**

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · shadcn/ui · Framer Motion · Supabase (auth, Postgres, storage) · Stripe · Anthropic Claude via the official `@anthropic-ai/sdk` (model `claude-opus-4-8`, not the Vercel AI SDK / OpenAI) · next-themes (dark/light).

## Folder structure

```
app/
  (marketing)/          # public: home, pricing — navbar+footer layout
  blog/                 # public blog — own layout (same navbar+footer), no group-level loading.tsx so notFound() 404s work
  (auth)/               # login, signup, auth callback
  (app)/dashboard/      # protected app — sidebar layout
  (admin)/admin/        # admin-only
  share/[token]/        # public shared analysis
  api/                  # route handlers (chat stream, stripe webhook)
components/
  ui/                   # shadcn/ui only — don't hand-edit
  marketing/ dashboard/ analysis/ chat/ admin/ shared/
lib/
  supabase/             # client.ts (browser), server.ts (server), admin.ts (service role)
  ai/                   # prompts.ts, schemas.ts (zod)
  stripe/  extraction/  utils.ts
types/                  # shared TS types incl. database.ts
supabase/migrations/    # numbered SQL files — never edit old ones, add new
middleware.ts           # Supabase session refresh + route protection
```

## Conventions

- Server Components by default; `"use client"` only when needed (interactivity, hooks).
- Mutations via Server Actions in `app/**/actions.ts`; API routes only for streaming (AI) and webhooks (Stripe).
- Auth check in every protected server action/page: get user from Supabase server client, redirect or throw if absent.
- All DB access respects RLS; service-role client (`lib/supabase/admin.ts`) only in webhooks/admin server code.
- Zod-validate every external input (forms, AI output, webhooks).
- Styling: Tailwind + shadcn tokens (CSS variables), `.glass` utility for glassmorphism, `rounded-2xl` cards, soft shadows. Both themes must always work.
- Animations: Framer Motion; respect `prefers-reduced-motion`.
- Every list/detail surface: loading skeleton + empty state + error state.
- Accessibility: semantic HTML, focus states, keyboard operable, WCAG AA contrast.

## Commands

```
npm run dev        # dev server
npm run build      # must pass before every commit
npm run lint
```

## Environment variables (`.env.local`, documented in `.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-opus-4-8
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_TEAM_MONTHLY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Git rules

- Branch: `main`. After finishing a phase: `npm run build` passes → tick the phase checkbox in ROADMAP.md → `git add -A` → commit with the exact message from the phase file → `git push origin main`.
- Never commit secrets. If `npm run build` fails, fix before committing.

## Product rules

- Plans: Free = 3 documents/month, Pro = unlimited, Team = unlimited + members.
- Always show "Not legal advice" disclaimer near AI output.
- AI analysis must cite paragraph IDs from the extracted document so the UI can highlight sources.
