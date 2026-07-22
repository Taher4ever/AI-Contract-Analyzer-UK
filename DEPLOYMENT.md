# Deployment guide

This project deploys to [Vercel](https://vercel.com) (recommended — zero-config for Next.js) or anywhere that can run the [Docker image](README.md#docker). This guide covers Vercel plus the production checklist for Supabase, Stripe and Google OAuth.

## 1. Vercel

1. **Import the repo**: [vercel.com/new](https://vercel.com/new) → select the `AI-Contract-Analyzer-UK` GitHub repo → Vercel auto-detects Next.js, no build settings need changing.
2. **Set environment variables** (Project Settings → Environment Variables — add all of these for the **Production** environment; use test-mode Stripe values for **Preview** if you want preview deployments to work too):

   | Variable | Where to get it |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
   | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
   | `ANTHROPIC_MODEL` | `claude-opus-4-8` |
   | `STRIPE_SECRET_KEY` | Stripe Dashboard, **live mode** → Developers → API keys |
   | `STRIPE_WEBHOOK_SECRET` | Signing secret of the production webhook endpoint — see §3 below |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard, **live mode** → Developers → API keys |
   | `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_YEARLY` | Stripe Dashboard, **live mode** → Products → Pro |
   | `STRIPE_PRICE_TEAM_MONTHLY` / `STRIPE_PRICE_TEAM_YEARLY` | Stripe Dashboard, **live mode** → Products → Team |
   | `NEXT_PUBLIC_APP_URL` | Your production domain, e.g. `https://contractlens.ai` (**set this before deploying** — it's baked into OG tags, the sitemap, and Stripe redirect URLs) |

3. **Deploy.** Vercel builds with `npm run build` — the same command this repo verifies before every commit.
4. Once you have a domain, add it in Project Settings → Domains, and update `NEXT_PUBLIC_APP_URL` to match (redeploy after changing it).

> ⚠️ Live Stripe keys and price IDs are **different objects** from test mode — don't reuse test-mode price IDs in production.

## 2. Supabase (production checklist)

1. **Use a separate Supabase project for production** (don't point production at your dev project).
2. Run every migration in `supabase/migrations/` **in order**, via the SQL Editor or:
   ```bash
   supabase link --project-ref <prod-project-ref>
   supabase db push
   ```
   This creates the schema, RLS policies, and the `contracts` (private), `avatars` (public) and `blog` (public) storage buckets.
3. **Authentication → URL Configuration**:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: add `https://your-domain.com/auth/callback`
4. *(If using Google sign-in)* **Authentication → Providers → Google**: same Google Cloud OAuth client as dev works fine, but add the **production** callback as an additional authorised redirect URI — see §4.
5. Promote your own account to admin once you've signed up on the live site:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

## 3. Stripe (live mode)

1. Toggle the Stripe Dashboard to **live mode** (top-left switch).
2. Re-create the **Pro** and **Team** products/prices in live mode (test-mode products don't carry over) and copy the new price IDs into Vercel's env vars.
3. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events to send: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`
4. Copy the endpoint's **signing secret** into `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.
5. Do **not** run `stripe listen` against production — that's a local-dev-only tool; the live webhook endpoint above is the production equivalent.

## 4. Google OAuth (production redirect)

In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth 2.0 Client ID → **Authorized redirect URIs**, add (alongside the existing dev one):

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

This is the same Supabase callback URL for every environment (dev and prod share one Supabase Auth callback per Supabase project) — if dev and prod use **separate** Supabase projects, add each project's callback URL separately.

## 5. Post-deploy smoke test

Run through this on the live URL before calling it done:

- [ ] **Sign up** with email/password — confirmation email arrives, account is created.
- [ ] **Google sign-in** works end-to-end (if enabled).
- [ ] **Upload** a PDF and a DOCX contract — both extract text successfully.
- [ ] **Analyze** — risk score, summary, findings, timeline all render; "Not legal advice" disclaimer is visible.
- [ ] **Chat** — ask a question, get a streamed answer, click a citation and confirm it scrolls to/highlights the right paragraph.
- [ ] **Checkout** — upgrade to Pro with a real Stripe **test card** in live mode (`4000 0025 0000 3155` etc. — Stripe issues test cards that work in live mode without moving real money) and confirm the plan updates and a payment row appears in the billing page.
- [ ] **Billing portal** — "Manage billing" opens the real Stripe customer portal.
- [ ] **Share link** — create one from an analysis, open it in a private/incognito window, confirm it's read-only and needs no login.
- [ ] **Admin panel** — `/admin` 404s for a non-admin account and shows real data for an admin account (Overview charts, Users, Payments, Documents, Blog).
- [ ] **Blog** — `/blog` and a published post render; an unpublished/unknown slug 404s; check `/sitemap.xml` includes the posts.
- [ ] Both **light and dark** themes render correctly on at least one marketing page and one dashboard page.
