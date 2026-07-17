# Phase 3 — SEO, metadata & error pages

**Depends on:** Phase 2.
**Goal:** Full SEO layer + polished error/loading surfaces. Marketing site is deployable after this phase.

## Tasks

1. Root metadata in `app/layout.tsx` using Metadata API: title template (`%s · ContractLens AI`), description, keywords, `metadataBase` from `NEXT_PUBLIC_APP_URL`, OpenGraph + Twitter cards, icons.
2. OG image: static `app/opengraph-image.png` styled like the brand (or `opengraph-image.tsx` with ImageResponse) — dark panel, logo, tagline.
3. `app/sitemap.ts`: home, pricing, blog index (blog posts added in Phase 15). `app/robots.ts`: allow all, disallow `/dashboard`, `/admin`, `/api`; reference sitemap.
4. Structured data (JSON-LD) on home: `SoftwareApplication` (+ offers from pricing) and `FAQPage` from the FAQ content. Component `components/shared/json-ld.tsx`.
5. Per-page metadata for `/pricing`.
6. `app/not-found.tsx`: branded 404 — big friendly headline, small illustration/animation, buttons Home + Dashboard.
7. `app/error.tsx` and `app/global-error.tsx`: apology, "Try again" (reset), report hint. Same premium styling.
8. `app/(marketing)/loading.tsx`: minimal top progress/skeleton.
9. Favicon + `apple-icon`.

## Acceptance criteria

- [ ] View-source shows correct meta/OG tags; `/sitemap.xml` and `/robots.txt` respond.
- [ ] JSON-LD validates (paste into Google Rich Results test format — well-formed JSON).
- [ ] Visiting a bad URL shows branded 404; thrown error shows error page.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: SEO metadata, sitemap, robots, structured data and error pages"
git push origin main
```
