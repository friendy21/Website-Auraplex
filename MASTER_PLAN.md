# Auraplex — Master Remediation Plan

_Generated from a deep multi-agent audit (2026-06-23). Severity: **P0** broken/user-facing · **P1** incomplete/integrity/a11y · **P2** cleanup/polish._

## Root cause behind most P0s
The app hard-depends on an **unconfigured Sanity CMS** and on **fabricated data**. `lib/sanity.ts` `sanityFetch` *throws* when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset (the default), and flagship flows call it without a fallback. The real source of truth is `lib/catalog.ts` (30 machines). **Decision taken:** make `lib/catalog.ts` the runtime source; Sanity becomes an optional, gracefully-degrading enhancement.

---

## Phase 0 — Broken & user-facing (block launch)

1. **Machine Finder hard-fails** — `actions/machine-finder.ts`: `sanityFetch` throws (no catch); detached streaming IIFE swallows errors (chat can hang); AI `recommendedSlug` never parsed/linked/stored (0 leads). → source from `lib/catalog.ts`; try/catch + `stream.error()`; guard `ANTHROPIC_API_KEY`; parse recommendation → link + `storeLead`; model → `claude-opus-4-8`.
2. **Spec-sheet download broken** — `actions/request-spec-sheet.ts`: Sanity throw → always "Product not found"; dead `placeholder.pdf`. → resolve product from `lib/catalog.ts`; honest ack until real PDFs exist.
3. **3D configurator crashes all 30 machines** — missing `/models/{slug}.glb` → `useGLTF` 404 → page error boundary. CTA shown unconditionally. `useGLTF.preload` self-recursion (`machine-model.tsx:44`). No mobile gating. → `hasModel` gate on CTA + route; error boundary + "preview coming soon" fallback; perf-tier gating; fix preload.
4. **Fabricated "live" stats** — `lib/kv.ts` + `live-data-ticker.tsx` + `2026/page.tsx`: 1,247 machines / 340 factories / 99.4% / 8.2M labels presented as live telemetry; contradicts real 30-machine catalog; nothing writes `ticker:*`. → relabel illustrative OR wire a real KV writer OR honest figures.
5. **Invalid Product schema.org** — `lib/seo.ts` + `products/[slug]/page.tsx`: `price: 0` + `InStock` for all (monthlyPrice always null); image → nonexistent `/og/default.png`. → omit `offers` when unpriced; use `/api/og` for image.

## Phase 1 — Incomplete features, content integrity, a11y
6. Placeholder testimonials & unverified client logos (Honda/Perodua/SIRIM/FGV) shown as real — verify permission or remove.
7. Case studies fully stubbed (`[slug]` → `__placeholder__` redirect) — build real (Sanity `caseStudy` schema exists) or drop from nav.
8. Privacy/Terms are holding statements — need counsel docs before launch.
9. Forms discard zod field errors → generic "Invalid input"; errors not associated (`aria-invalid`/`aria-describedby`/`role="alert"`). → return `error.flatten()`, wire `field.tsx`.
10. Lead/email coupling — `storeLead()` before email in one `try`; KV failure drops both. → decouple + guard keys.
11. 7 machines without photos (and not on the live site) — photograph, reuse, or de-list + exclude from sitemap.
12. Domain inconsistency — SEO uses `auraplex.my`, real domain `auraplex.com.my`. → confirm prod host; centralize in one constant.
13. Three.js no mobile gating — heavy WebGL + Bloom on phones.

## Phase 2 — Cleanup, DRY, perf polish
14. 8 orphaned components never imported: `product-showcase`, `featured-machines`, `case-study-feature`, `sort-tabs`, `motion/kinetic-heading`, `motion/number-counter`, `three/particle-mesh`, `three/shader-grid` — delete or wire.
15. Finish `lib/hooks.ts` consolidation: `custom-cursor.tsx` duplicated hooks; `atmosphere-provider.tsx` non-reactive reduced-motion read.
16. `dialog.tsx` close button missing `aria-label="Close"` (affects search dialog).
17. `header.tsx` animates `padding` (layout); `parallax-product-image.tsx` unthrottled pointermove animating `object-position` (paint).
18. All 25 labelling machines share one category `summary` → thin/duplicate SEO content.
19. Doc/config debt: stale README, empty `Auraplex.txt`, undocumented `SANITY_REVALIDATE_SECRET`, dead `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, dead `RoiCalculator` comment, desktop nav omits news/careers.

---

## Open decisions
- **(a)** Sanity configured for launch, or `lib/catalog.ts` as permanent runtime source? _(Default: catalog.ts; Sanity optional.)_
- **(b)** Production domain — `auraplex.my` vs `auraplex.com.my`?
