import Image from 'next/image';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

/**
 * Catalogue hero — a large machine image levitates on the right behind a
 * cerulean halo and a slow-spinning precision ring, parallaxing as you scroll
 * while the headline stays anchored.
 *
 * MECHANISM: this used `useScroll` + two `useTransform`s from motion/react,
 * which meant the /products header could not move (and the headline could not
 * even appear — it was gated behind `initial={{ opacity: 0 }}`) until the
 * framer bundle had downloaded, parsed and hydrated. It is now native CSS:
 * a named view timeline for the parallax, wall-clock keyframes for the
 * levitation and the copy entrance. See styles/motion/products.css, which
 * documents the range mapping, the inverted-fallback @supports gate and the
 * RULE ZERO decision behind the transform-only headline entrance.
 *
 * Because nothing here needs state, refs or event handlers any more, the
 * component has also dropped `'use client'` — it renders entirely on the
 * server and ships zero JS to the /products route.
 *
 * Performance / a11y:
 *   - The whole visual is desktop-only (`hidden lg:block`) — phones never
 *     pay for it — and is aria-hidden, being purely decorative.
 *   - Reduced motion is handled in products.css: it stops the levitation AND
 *     the scroll parallax outright (framer used to keep scrubbing the opacity
 *     even under reduced motion) and leaves the machine at rest, visible.
 *   - Only transform / opacity animate.
 */
export function ProductsHero({ eyebrow, title, subtitle, imageSrc, imageAlt }: Props) {
  return (
    <section className="products-hero relative mx-auto max-w-[1600px] px-6 lg:px-12 pt-32 pb-12 overflow-hidden">
      {/* ── Floating machine (desktop only, decorative) ──
          Scroll parallax + exit fade ride --products-hero, the view timeline
          named on the section above. */}
      <div
        aria-hidden="true"
        className="products-hero__visual pointer-events-none absolute right-0 lg:right-8 -top-2 hidden lg:block w-[42vw] max-w-[600px] aspect-square"
      >
        {/* Cerulean halo */}
        <div
          className="absolute inset-[8%] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-signal) 38%, transparent) 0%, transparent 68%)',
          }}
        />

        {/* Slow-spinning dashed precision rings */}
        <svg
          viewBox="0 0 200 200"
          className="spin-slow absolute inset-0 h-full w-full opacity-30"
        >
          <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-signal)" strokeWidth="0.4" strokeDasharray="3 9" />
          <circle cx="100" cy="100" r="74" fill="none" stroke="var(--color-signal-bright)" strokeWidth="0.3" strokeDasharray="2 12" />
        </svg>

        {/* The levitating machine. Its own wrapper so the 7s loop composes
            with the parallax on the ancestor, exactly as the two nested
            motion.divs did. */}
        <div className="products-hero__float relative h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="600px"
            priority
            className="object-contain p-10 [filter:drop-shadow(0_28px_50px_color-mix(in_oklab,var(--color-signal)_22%,transparent))]"
          />
        </div>
      </div>

      {/* ── Headline (anchored, rises once) ──
          RULE ZERO: transform-only entrance, no opacity channel — this block
          holds the h1 and the subtitle, one of which is the LCP element on
          mobile where the machine visual never renders. */}
      <div className="products-hero__copy relative z-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — {eyebrow}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.95]">
            {title}
          </h1>
          <p className="max-w-md text-[color:var(--color-steel-soft)] text-base lg:text-lg lg:max-w-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
