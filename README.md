# ContractLens AI

**AI-powered SaaS that explains UK legal contracts in plain English.**

Upload a PDF or DOCX contract and get a risk score, a plain-English summary, clause-by-clause findings, a key-dates timeline, and an AI you can chat with about the document — every answer cites the exact paragraph it's based on.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Anthropic](https://img.shields.io/badge/Claude-Opus%204.8-D97757)](https://www.anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> ⚠️ **Not legal advice.** ContractLens AI helps you understand documents — it does not replace a solicitor.

---

## Screenshots

<!--
  Drop PNG/JPG screenshots into public/screenshots/ and they'll render here.
  Suggested set: landing page, an analysis report, the AI chat panel, pricing.
-->

| Landing page | Analysis report |
|---|---|
| ![Landing page](public/screenshots/landing.png) | ![Analysis report](public/screenshots/analysis.png) |

| AI chat | Pricing |
|---|---|
| ![AI chat](public/screenshots/chat.png) | ![Pricing](public/screenshots/pricing.png) |

## Features

- **AI contract analysis** — risk score (0–100), plain-English summary, categorised findings (unfair terms, missing protections, red flags), key facts (notice period, auto-renewal), and a key-dates timeline. Every finding cites the source paragraph.
- **AI chat about your document** — streamed answers grounded in the actual contract text, with clickable citations that scroll to and highlight the source paragraph.
- **Dashboard** — folders, favourites, search (⌘K), contract list with filters, export to PDF/DOCX, shareable read-only links.
- **Billing** — Stripe Checkout (monthly/yearly), customer portal, plan enforcement (Free = 3 docs/month, Pro = unlimited, Team = unlimited + shared workspace).
- **Teams** — invite by email, shared read-only access to team contracts, centralised billing.
- **Admin panel** — users, payments, documents (moderation), analytics (signups/contracts/plan-mix charts), and a full blog CMS.
- **Public blog** — SEO-optimised (`generateMetadata`, `Article` JSON-LD, dynamic sitemap, ISR), Markdown articles via the admin CMS.
- **Auth** — email/password, magic link, Google OAuth (Supabase Auth), route protection via middleware.
- Dark/light mode, WCAG AA accessibility, `prefers-reduced-motion` support throughout, and a fully responsive layout.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Server Components, Server Actions) |
| Language | TypeScript (strict), [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (Base UI edition), [Framer Motion](https://www.framer.com/motion/) |
| Database / Auth / Storage | [Supabase](https://supabase.com) (Postgres, Row Level Security, Auth, Storage) |
| AI | [Anthropic Claude](https://www.anthropic.com) via the official `@anthropic-ai/sdk` (model `claude-opus-4-8`) |
| Payments | [Stripe](https://stripe.com) (Checkout, Billing Portal, webhooks) |
| Validation | [Zod](https://zod.dev) |
| Deployment | [Vercel](https://vercel.com) (or Docker — see below) |

## Architecture overview

```
app/
  (marketing)/          # public: home, pricing — shared navbar+footer layout
  blog/                 # public blog — own layout (kept out of (marketing) so
                         # notFound() returns a real 404 for unpublished/unknown slugs)
  (auth)/                # login, signup, password reset
  (app)/dashboard/       # protected app — sidebar layout, requires a session
  (admin)/admin/         # admin-only (requires profiles.role = 'admin')
  share/[token]/         # public, unauthenticated read-only analysis view
  api/                   # route handlers: AI chat stream, PDF/DOCX export, Stripe webhook
components/
  ui/                    # shadcn/ui primitives — generated, not hand-edited
  marketing/ dashboard/ analysis/ chat/ admin/ shared/
lib/
  supabase/              # client.ts (browser), server.ts (server, cookie-based), admin.ts (service role)
  ai/                    # Claude prompts + Zod schemas for structured output
  stripe/  extraction/   # Stripe plans/client, PDF/DOCX text extraction
  blog/                  # public blog data access + reading-time helper
types/                   # shared TypeScript types, incl. the hand-written Database type
supabase/migrations/     # numbered SQL migrations — run in order, never edited after merge
middleware.ts            # Supabase session refresh + protected-route redirects
```

Every protected page/action re-checks auth server-side and relies on Postgres Row Level Security as the source of truth — the service-role client is only ever used in the Stripe webhook and admin server code, never in user-facing paths.

## Local setup

### 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Stripe](https://stripe.com) account in **test mode**
- An [Anthropic](https://console.anthropic.com) API key
- (Optional, for Google sign-in) a [Google Cloud](https://console.cloud.google.com) OAuth client

### 2. Clone and install

```bash
git clone https://github.com/Taher4ever/AI-Contract-Analyzer-UK.git
cd AI-Contract-Analyzer-UK
npm install
cp .env.example .env.local
```

### 3. Supabase

1. Create a new Supabase project.
2. In **Project Settings → API**, copy the Project URL and the `anon`/`service_role` keys into `.env.local`.
3. Run every migration in `supabase/migrations/` **in order** (`0001_...` → `0011_...`) via the SQL Editor, or via the CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   These create the schema, RLS policies, and the `contracts` / `avatars` / `blog` storage buckets.
4. **Authentication → URL Configuration**: set Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` as a redirect URL.
5. *(Optional)* **Authentication → Providers → Google**: create an OAuth 2.0 Client ID in Google Cloud Console (Web application), add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorised redirect URI, then paste the Client ID/Secret into Supabase's Google provider settings and enable it.

### 4. Anthropic

Create an API key at [console.anthropic.com](https://console.anthropic.com) and set `ANTHROPIC_API_KEY`. Leave `ANTHROPIC_MODEL` as `claude-opus-4-8` unless you want to point at a different model.

### 5. Stripe (test mode)

1. In the [Stripe Dashboard](https://dashboard.stripe.com) (test mode), create two products — **Pro** and **Team** — each with a monthly and a yearly price.
2. Copy `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from **Developers → API keys**, and the four price IDs into `.env.local`.
3. Forward webhooks to your local server and copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 6. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To try the admin panel, promote your own account after signing up:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (**server-only, never expose client-side**) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `ANTHROPIC_MODEL` | Defaults to `claude-opus-4-8` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Output of `stripe listen`, or your webhook endpoint's signing secret in production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_YEARLY` | Stripe Dashboard → Products → Pro |
| `STRIPE_PRICE_TEAM_MONTHLY` / `STRIPE_PRICE_TEAM_YEARLY` | Stripe Dashboard → Products → Team |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your production domain when deployed |

See [`.env.example`](.env.example) for the full template and [`DEPLOYMENT.md`](DEPLOYMENT.md) for the production/live-mode checklist.

## Scripts

```bash
npm run dev       # start the dev server (Turbopack)
npm run build     # production build (must pass before every commit)
npm run start     # run a production build (NOT compatible with output: "standalone" — use Docker/node server.js instead)
npm run lint      # ESLint
npm run format    # Prettier
```

## Docker

The app builds as a multi-stage, non-root, `output: "standalone"` image.

```bash
# build (NEXT_PUBLIC_* vars are needed at build time — they're inlined into the client bundle)
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
  --build-arg NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
  -t contractlens-ai .

# run (server-only secrets are read at container runtime)
docker run -p 3000:3000 --env-file .env.local contractlens-ai
```

Or with Compose, which reads build args and runtime env from `.env.local` in one step:

```bash
docker compose --env-file .env.local up --build
```

> Compose's own `${VAR}` interpolation only auto-loads a file literally named `.env`, not `.env.local` — the `--env-file .env.local` flag above points it at the right file.

## Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full Vercel deployment guide, production Supabase/Stripe/Google checklist, and a post-deploy smoke-test checklist.

## License

[MIT](LICENSE) — this is a portfolio/demo project. It is **not legal advice** and comes with no warranty; do not rely on it for real legal decisions.
