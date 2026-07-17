# Phase 5 — Authentication

**Depends on:** Phase 4. **User setup first:** in Supabase Auth enable Email provider + Google provider (Google OAuth client ID/secret), set Site URL to `http://localhost:3000`.
**Goal:** Google login, email+password, magic link, protected routes.

## Tasks

1. `app/(auth)/layout.tsx`: centered glass card on gradient background, logo on top.
2. `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`:
   - "Continue with Google" button (official G icon, loading state).
   - Email + password form (zod + react-hook-form, inline errors).
   - "Email me a magic link" tab/toggle — email only, success state "Check your inbox" with animation.
   - Links between login/signup; "Forgot password" flow (`/forgot-password`, `/reset-password`).
3. Server actions in `app/(auth)/actions.ts`: `signInWithPassword`, `signUp`, `signInWithMagicLink`, `signInWithGoogle` (OAuth redirect), `signOut`, `resetPassword`. Friendly error messages (wrong password, user exists, rate limit).
4. `app/(auth)/auth/callback/route.ts`: exchange code for session, redirect to `/dashboard`.
5. Route protection in `middleware.ts`: no session on `/dashboard/**` or `/admin/**` → redirect `/login?next=...`; session on `/login`/`/signup` → redirect `/dashboard`. Honor `next` param after login.
6. Navbar: session-aware — show avatar dropdown (Dashboard, Sign out) when logged in, using a small server component wrapper.
7. Toasts (sonner) for auth errors/success.

## Acceptance criteria

- [ ] Email+password signup → lands in `/dashboard` (empty page ok); logout works.
- [ ] Magic link email arrives and logs in via callback.
- [ ] Google OAuth round-trip works locally.
- [ ] `/dashboard` redirects to `/login` when logged out; `?next=` returns you to the original URL.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: authentication with Google, email/password and magic links"
git push origin main
```
