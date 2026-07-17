# Phase 2 — Landing page

**Depends on:** Phase 1.
**Goal:** Complete premium marketing home page + pricing page. All components in `components/marketing/`.

## Tasks

1. **Hero** (`hero.tsx`): headline "Understand Any Contract in Minutes", subheadline "Upload a legal document and receive a plain-English explanation, risk analysis, and key clauses.", primary CTA "Analyze Contract" (→ `/signup`), secondary "See how it works" (scrolls to features). Staggered FadeIn, soft gradient/glow background, and a floating glassmorphism mockup card showing a fake analysis (risk score ring 72/100, sample clause chips) with slow float animation. Trust row: "Built for UK contracts · Tenancy · Employment · Freelance · NDAs".
2. **Logo/social-proof strip**: subtle marquee of contract types or testimonial one-liners.
3. **How it works** (`how-it-works.tsx`): 3 steps — Upload, AI analyses, Ask anything — numbered glass cards, connecting line, scroll-triggered animation.
4. **Features grid** (`features.tsx`): 6 glass cards with lucide icons: Risk Score, Plain-English Summary, Hidden Risks, Key Dates Timeline, AI Chat, Export Reports. Hover lift micro-interaction.
5. **Pricing** (`pricing.tsx`, reused on `/pricing` page): 3 tiers — Free (£0, 3 documents/month), Pro (£19/mo, unlimited, exports, priority), Team (£49/mo, everything + members, shared workspace). Pro highlighted "Most popular". Monthly/yearly toggle (yearly −20%) with animated price. CTAs → `/signup`.
6. **FAQ** (`faq.tsx`): shadcn accordion, 6–8 questions (Is this legal advice? No. · Which files? PDF & DOCX · Is my contract private? · Can I cancel? · What contracts work best? · How accurate is it?).
7. **Final CTA** (`cta.tsx`): full-width glass panel, headline + "Analyze Contract" button.
8. Assemble in `app/(marketing)/page.tsx`; create `app/(marketing)/pricing/page.tsx` (pricing + FAQ + CTA).
9. Navbar links scroll to sections (`/#features`, `/#faq`).

## Acceptance criteria

- [ ] Page feels premium in both themes; responsive from 360px to desktop.
- [ ] All scroll animations trigger once, smooth, disabled with `prefers-reduced-motion`.
- [ ] Pricing toggle animates; `/pricing` route works.
- [ ] `npm run build` passes.

## Commit & push

```
git add -A
git commit -m "feat: landing page with hero, features, pricing and FAQ"
git push origin main
```
