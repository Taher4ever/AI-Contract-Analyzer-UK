# Phase 13 — Stripe billing & teams

**Depends on:** Phase 11 (limits exist since Phase 7). **User setup first:** Stripe test account; create products/prices — Pro £19/mo, Team £49/mo (+ yearly at −20% if doing the toggle); put keys + price IDs in `.env.local`; run `stripe listen --forward-to localhost:3000/api/stripe/webhook` for local webhooks.
**Goal:** Paid plans enforced end-to-end + team workspaces.

## Tasks

1. Install `stripe`. `lib/stripe/client.ts` (server-side Stripe instance), `lib/stripe/plans.ts` (plan metadata: name, price, features, priceId — single source used by marketing pricing page too).
2. **Checkout**: server action `createCheckoutSession(priceId)` — create/reuse `stripe_customer_id` on profile, subscription mode, success → `/dashboard/billing?success=1`, cancel → `/dashboard/billing`. **Portal**: `createPortalSession()` for manage/cancel/update card.
3. **Webhook** `app/api/stripe/webhook/route.ts` (verify signature, use admin client):
   - `checkout.session.completed` / `customer.subscription.created|updated`: upsert `subscriptions`, set `profiles.plan` (pro/team by price ID), store period end.
   - `customer.subscription.deleted`: plan → free.
   - `invoice.paid` / `payment_intent.succeeded`: insert `payments` row.
4. **Billing page** `app/(app)/dashboard/billing/page.tsx`: current plan card (renewal date, status), usage this month (x/3 free with progress, ∞ for paid), plan comparison cards with upgrade/downgrade CTAs (checkout or portal), "Manage billing" → portal, payment history table from `payments`. Success confetti/check animation on `?success=1`.
5. **Enforcement**: central `lib/billing/limits.ts` → `canUploadContract(userId)` used by Phase 7 action (free: 3/month; pro/team: unlimited; team members inherit team plan). Share links Pro+ (Phase 12 hook-in).
6. **Teams** (Team plan): `app/(app)/dashboard/team/page.tsx` — visible when plan is team: create team (name), invite by email (insert `team_members` pending; invited existing users see a join banner on dashboard; accepting sets user_id + status active + profile.team_id), members list with remove (owner only), leave team. Team members see shared team contracts list section (owner + members' contracts visible read-only to team — extend contracts RLS with team read policy in a new migration `0004_team_read.sql`).
7. Sidebar plan badge + Upgrade link now live; marketing pricing page CTAs deep-link to checkout when logged in.

## Acceptance criteria

- [ ] Test-mode card 4242… upgrades to Pro; plan reflects in UI within a webhook round-trip; portal cancel downgrades to free.
- [ ] Free limit blocks 4th upload; Pro user unlimited.
- [ ] Team invite → accept flow works between two test accounts; member sees team contracts read-only.
- [ ] Webhook signature invalid → 400. `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: Stripe billing with checkout, webhooks, plan enforcement and teams"
git push origin main
```
