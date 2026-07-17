# Phase 17 — Docker, docs & deployment

**Depends on:** Phase 16.
**Goal:** Ship it: Docker support, full docs, live on Vercel.

## Tasks

1. **Docker**: multi-stage `Dockerfile` (deps → build → `output: 'standalone'` runner, node:20-alpine, non-root user) + `docker-compose.yml` (app + env file) + `.dockerignore`. Verify `docker build` + `docker run` serves the app locally.
2. **README.md** (rewrite, professional): banner/screenshot, feature list, tech stack badges, architecture overview (folder structure summary), local setup step-by-step (Supabase project + migrations, Google OAuth, Stripe products + webhook listen, OpenAI key), env var table, scripts, Docker usage, link to DEPLOYMENT.md, license, "not legal advice" disclaimer.
3. **DEPLOYMENT.md**: Vercel guide — import repo, set all env vars (table with where to get each), set `NEXT_PUBLIC_APP_URL` to prod domain; Supabase prod checklist (Site URL + redirect URLs for auth, run all migrations, buckets); Stripe live mode (live keys, prod webhook endpoint `https://domain/api/stripe/webhook`, price IDs); Google OAuth prod redirect; post-deploy smoke-test checklist (signup, upload, analyze, chat, checkout with live test, share link, admin).
4. **Screenshots**: add 3–4 app screenshots to `public/screenshots/` and embed in README.
5. **Deploy to Vercel** (user runs the dashboard steps; Claude Code prepares everything and verifies build works with `npm run build` matching Vercel's).
6. Final QA sweep using the DEPLOYMENT.md smoke-test checklist on the live URL.

## Acceptance criteria

- [ ] `docker build . && docker run` serves the production app.
- [ ] README lets a stranger set the project up without help.
- [ ] Live Vercel deployment passes the full smoke-test checklist.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "chore: docker support, documentation and production deployment guide"
git push origin main
```

🎉 **Project complete.** Tag it: `git tag v1.0.0 && git push --tags`
