# Phase 14 — Admin panel & blog CMS

**Depends on:** Phase 13.
**Goal:** Admin-only area: users, payments, documents, analytics, blog CMS.

## Tasks

1. **Access**: `app/(admin)/admin/layout.tsx` — require session AND `profiles.role = 'admin'` (server check, 404 for non-admins so the route stays hidden). Own minimal sidebar: Overview, Users, Payments, Documents, Blog. Set your own account to admin via SQL for testing.
2. All admin data fetching uses the service-role client in server components/actions (never exposed client-side).
3. **Overview** `admin/page.tsx` — analytics: stat cards (total users, active subscriptions, MRR from subscriptions×plan price, contracts analyzed, this-month signups) + charts (recharts or minimal custom SVG): signups per week (last 12), contracts per week, plan distribution donut.
4. **Users** `admin/users/page.tsx`: paginated table — email, name, plan, role, contracts count, joined. Search by email. Actions: change role (confirm), change plan (manual override), delete user (confirm, cascades).
5. **Payments** `admin/payments/page.tsx`: payments table (user, amount £, status, date), total revenue card, link to Stripe dashboard per payment.
6. **Documents** `admin/documents/page.tsx`: contracts table (title, owner email, status, risk score, created), view analysis (read-only), delete (moderation).
7. **Blog CMS** `admin/blog/`:
   - List: posts with status (draft/published), edit/delete/new.
   - Editor `admin/blog/[id]/page.tsx`: title, slug (auto from title, editable), excerpt, cover image upload (public `blog` storage bucket — new migration `0005_blog_bucket.sql`), markdown content textarea with live preview pane (`react-markdown`), publish toggle, save (server action, zod-validated).
8. Every table: loading skeleton, empty state, error state; shared `admin/data-table.tsx` component.

## Acceptance criteria

- [ ] Non-admin hitting `/admin` gets 404; admin sees all pages with real data.
- [ ] Role/plan changes persist; charts render with real aggregates.
- [ ] Creating + publishing a blog post works end-to-end (public page in Phase 15).
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: admin panel with users, payments, documents, analytics and blog CMS"
git push origin main
```
