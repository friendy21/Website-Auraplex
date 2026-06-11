import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTickerStats } from '@/lib/kv';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { ManifestoSection } from '@/components/sections/manifesto-section';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { ValuePropGrid } from '@/components/sections/value-prop-grid';
import { ScrollNarrative } from '@/components/sections/scroll-narrative';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { FaqSection } from '@/components/sections/faq-section';
import { CloserSection } from '@/components/sections/closer-section';
import { ZoomTransition } from '@/components/motion/zoom-transition';
import { ScrollDrawLine } from '@/components/motion/scroll-draw-line';
import { MachineCarousel } from '@/components/sections/machine-carousel';
import { OutlineMarquee } from '@/components/sections/outline-marquee';

// Static fallback stats — used both as the Suspense fallback (so the
// ticker section's height is reserved while the KV call streams) and as
// the error fallback when KV is unreachable.
const FALLBACK_STATS = {
  machines: 1247,
  labels: 8_200_000,
  uptime: '99.4%',
  factories: 340,
};

/**
 * The KV stats fetch is the ONLY dynamic data on the home page. Awaiting
 * it at page level made the entire page body part of the dynamic stream:
 * with PPR the static shell (header/footer) painted first and then the
 * whole page content inserted above the footer — Lighthouse measured the
 * insertion as a 0.235 layout shift. Isolating the await in its own
 * Suspense boundary keeps every other section in the static shell, and
 * the fallback renders the identical ticker layout with placeholder
 * numbers so the streamed swap is pixel-stable.
 */
async function TickerSlot() {
  const stats = await getTickerStats().catch(() => FALLBACK_STATS);
  return <LiveDataTicker stats={stats} />;
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zA = await getTranslations('home.zoomA');

  /* ──────────────────────────────────────────────────────────────────
   * UNIFIED HOME ARC — one narrative, each section with ONE job:
   *
   *   1. Hero            — the floor (video) + the claim
   *   2. OutlineMarquee  — brand band, bridges hero into the body
   *   3. Manifesto       — the belief (pinned statement)
   *   4. LiveDataTicker  — the proof, in numbers
   *   5. ValuePropGrid   — the three reasons buyers choose us
   *   6. ZoomTransition  — cinematic pivot from "why" into "what"
   *   7. MachineCarousel — THE catalogue moment (interactive 3D ring)
   *   8. ScrollNarrative — one machine, told in depth
   *   9. Testimonials    — the voices
   *  10. FAQ             — the questions
   *  11. Closer          — the invitation
   *
   * Removed in the unification pass: ProductShowcase and
   * FeaturedMachines (both showed the catalogue a 2nd and 3rd time —
   * the carousel is now the single catalogue moment) and the second
   * ZoomTransition (one cinematic pivot reads intentional; two reads
   * like a repeated trick).
   * ────────────────────────────────────────────────────────────────── */
  return (
    <>
      <HeroCinematic />
      <OutlineMarquee />
      {/* The cerulean rope threads from just below the hero to the end
          of the FAQ — Closer stays outside so the line never reaches
          the finale or footer. */}
      <ScrollDrawLine>
        <ManifestoSection />
        <Suspense fallback={<LiveDataTicker stats={FALLBACK_STATS} />}>
          <TickerSlot />
        </Suspense>
        <ValuePropGrid />

        {/* Cinematic pivot — Flexy Applicator zooms from thumbnail to
            full bleed, turning the page from "why us" to "the machines". */}
        <ZoomTransition
          image="/products/Flexy_Applicator_11.png"
          alt="Flexy Applicator"
          scrollLength={2400}
        >
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[color:var(--color-signal)]" />
              {zA('eyebrow')}
            </div>
            <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.04em] leading-[0.88] text-[color:var(--color-paper)] max-w-5xl">
              {zA('h2Line1')}
              <br />
              <span className="text-[color:var(--color-signal)]">
                {zA('h2Line2')}
              </span>
            </h2>
            <p className="mt-8 max-w-xl font-mono text-sm text-[color:var(--color-steel-soft)]">
              {zA('body')}
            </p>
          </div>
        </ZoomTransition>

        {/* THE catalogue moment — drag-to-spin 3D ring, every panel a
            link into the full catalogue. */}
        <MachineCarousel />

        <ScrollNarrative />
        <TestimonialMarquee />
        <FaqSection />
      </ScrollDrawLine>
      <CloserSection />
    </>
  );
}
