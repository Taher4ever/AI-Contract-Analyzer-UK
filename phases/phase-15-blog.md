# Phase 15 — Public blog

**Depends on:** Phase 14.
**Goal:** SEO-optimized public blog rendering CMS posts.

## Tasks

1. `app/(marketing)/blog/page.tsx`: published posts grid — cover image (`next/image`), title, excerpt, date, reading time. Featured (latest) post large on top. Empty state if none.
2. `app/(marketing)/blog/[slug]/page.tsx`: article layout — cover, title, date, reading time, markdown body via `react-markdown` with beautiful typography (`@tailwindcss/typography`, tuned prose styles both themes), "Back to blog", bottom CTA card ("Analyze your contract free").
3. SEO: `generateMetadata` per post (title, description=excerpt, OG image=cover); `Article` JSON-LD; add posts to `app/sitemap.ts` (dynamic from DB); `generateStaticParams` + ISR (`revalidate = 3600`).
4. Seed 3 real posts via the CMS (write actual useful content, ~500 words each): "10 Red Flags in UK Tenancy Agreements", "What Is a Notice Period? Plain-English Guide", "Auto-Renewal Clauses: How to Avoid Getting Trapped". Store as a seed SQL migration `0006_seed_blog.sql` so the repo ships with content.
5. Navbar/footer Blog links live; 404 for unpublished/unknown slugs.

## Acceptance criteria

- [ ] Blog index + article pages render seeded posts beautifully in both themes.
- [ ] Article metadata/OG/JSON-LD correct; posts appear in `/sitemap.xml`.
- [ ] Unpublished post is not publicly accessible.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: public blog with SEO, structured data and seeded articles"
git push origin main
```
