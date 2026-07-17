# Phase 4 — Supabase & database schema

**Depends on:** Phase 0. **User setup first:** create a Supabase project, put URL + anon key + service role key in `.env.local`.
**Goal:** Supabase clients wired, full schema + RLS + storage in versioned migrations.

## Tasks

1. Install `@supabase/supabase-js @supabase/ssr`.
2. Clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server, cookie-based), `lib/supabase/admin.ts` (service role — server only, never imported client-side).
3. `middleware.ts`: Supabase session refresh (per `@supabase/ssr` docs). Route protection added in Phase 5.
4. Migration `supabase/migrations/0001_schema.sql`:
   - `profiles`: id (uuid, FK auth.users, PK), email, full_name, avatar_url, role (`user`/`admin`, default user), plan (`free`/`pro`/`team`, default free), stripe_customer_id, team_id (nullable FK), created_at. Trigger: auto-insert on auth.users insert.
   - `teams`: id, name, owner_id, created_at.
   - `team_members`: id, team_id, user_id (nullable until accepted), invited_email, role (`owner`/`member`), status (`pending`/`active`), created_at. Unique (team_id, invited_email).
   - `folders`: id, user_id, name, created_at.
   - `contracts`: id, user_id, folder_id (nullable), title, original_filename, file_type (`pdf`/`docx`), file_path, status (`uploaded`/`processing`/`analyzed`/`failed`), is_favorite (bool default false), paragraphs (jsonb — `[{id:number, text:string}]`), created_at, updated_at.
   - `analyses`: id, contract_id (FK, unique), risk_score (int 0–100), summary, sections (jsonb), timeline (jsonb), recommended_questions (jsonb), model, created_at.
   - `chat_messages`: id, contract_id, user_id, role (`user`/`assistant`), content, refs (jsonb — paragraph ids), created_at.
   - `shared_links`: id, contract_id, token (unique, random), created_at, expires_at (nullable).
   - `subscriptions`: id, user_id (unique), stripe_subscription_id, plan, status, current_period_end, created_at, updated_at.
   - `payments`: id, user_id, stripe_id, amount (int, pence), currency, status, created_at.
   - `blog_posts`: id, slug (unique), title, excerpt, content (markdown), cover_image, published (bool), author_id, created_at, updated_at.
   - Indexes on all FKs, `contracts(user_id, created_at desc)`, `blog_posts(slug)`.
5. Migration `0002_rls.sql`: enable RLS on every table. Owners CRUD their own rows (profiles/folders/contracts/analyses via contract ownership/chat_messages/shared_links/subscriptions read-own). Team members can read team + memberships. `blog_posts`: public read where published. Admin operations go through service role (no admin RLS policies needed). `payments`: read own.
6. Migration `0003_storage.sql`: private bucket `contracts`; policies: authenticated users read/write only under `contracts/{auth.uid()}/...`.
7. `types/database.ts`: TypeScript types for all rows (hand-written or supabase gen).
8. Apply migrations to the Supabase project (Supabase SQL editor or CLI) and confirm tables exist.

## Acceptance criteria

- [ ] All migrations run cleanly on a fresh Supabase project.
- [ ] RLS enabled on every table (Supabase dashboard shows no "unrestricted" tables).
- [ ] Signing up a test user (Supabase dashboard) auto-creates a `profiles` row.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: supabase clients, database schema, RLS and storage migrations"
git push origin main
```
