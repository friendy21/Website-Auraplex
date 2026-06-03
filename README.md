# Auraplex — v2.0

Industrial-editorial website for Auraplex SDN BHD. Next.js 16, React 19, Tailwind v4, Motion 12, R3F + Theatre.js, Sanity CMS, trilingual (EN/BM/ZH).

## Quickstart

```bash
pnpm install
cp .env.example .env.local      # fill in keys
pnpm dev
```

Visit http://localhost:3000 — middleware redirects to `/en`.

## Structure

```
app/[locale]/        — App Router pages (en, ms, zh)
actions/             — React Server Actions (forms, AI)
components/          — primitives, sections, motion, three, forms, layout
lib/                 — sanity, seo, kv, animations, utils, i18n
messages/            — i18n JSON
sanity/              — Studio schemas
styles/              — globals.css with @theme tokens, view transitions, scroll-driven anims
public/              — fonts/, video/, models/, products/
```

## Stack notes

- **Tailwind v4** — CSS-first config in `styles/globals.css` using `@theme`. OKLCH tokens.
- **next-intl** — `/[locale]` segment with `en | ms | zh`. Middleware handles routing.
- **View Transitions API** — `viewTransitionName` on product images for shared-element morph.
- **CSS scroll-driven** — `.reveal`, `.reveal-up`, `.reveal-scale` classes drive animations off the compositor.
- **Motion 12** — UI micro-interactions only.
- **GSAP** — pinned scroll narrative on homepage (`<ScrollNarrative>`), kinetic heading variable-weight reveal.
- **R3F** — homepage shader background, product configurator at `/products/[slug]/configurator`.
- **Sanity** — products, case studies, settings. Studio at `/studio` (after `sanity:dev`).
- **Resend** — quote/contact confirmations + internal notifications.
- **Vercel KV** — lead storage, ticker counters.
- **Anthropic Claude** — Machine Finder, streamed via Vercel AI SDK.

## Assets to drop in

- `/public/fonts/` — PP Editorial New, Inter, Berkeley Mono `.woff2`
- `/public/video/factory-hero.mp4` + poster
- `/public/video/about-reel.mp4` + poster
- `/public/models/solo-wrap.glb` (Draco-compressed)
- `/public/products/*.jpg` for category hero images
- `/public/case-studies/*.jpg`
- `/public/og/default.png` (1200×630)

## Deploy

Vercel. Region: `sin1` (Singapore). Set env vars from `.env.example`. KV + Sanity + Resend + Anthropic keys required.

## Performance budget

- Initial JS (homepage) < 40KB
- LCP (4G) < 1.0s
- INP < 100ms
- Configurator route lazy-loaded (~500KB acceptable)
