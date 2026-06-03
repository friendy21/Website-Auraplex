import { setRequestLocale } from 'next-intl/server';
import { getTickerStats } from '@/lib/kv';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { ValuePropGrid } from '@/components/sections/value-prop-grid';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { ScrollNarrative } from '@/components/sections/scroll-narrative';
import { FeaturedMachines } from '@/components/sections/featured-machines';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { FaqSection } from '@/components/sections/faq-section';
import { CtaFooter } from '@/components/sections/cta-footer';
import { ZoomTransition } from '@/components/motion/zoom-transition';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = await getTickerStats().catch(() => ({
    machines: 1247,
    labels: 8_200_000,
    uptime: '99.4%',
    factories: 340,
  }));

  return (
    <>
      <HeroCinematic />
      <LiveDataTicker stats={stats} />
      <ValuePropGrid />
      <ProductShowcase />

      {/* ── Snowhouse zoom-to-fullbleed signature #1 ──
          Bridges ProductShowcase → FeaturedMachines. Flexy Applicator shot
          11 zooms from thumbnail to full bleed, "Engineered on this floor"
          fades in over the dimmed image. */}
      <ZoomTransition
        image="/products/Flexy_Applicator_11.png"
        alt="Flexy Applicator on the Auraplex floor"
        scrollLength={2400}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            Precision · 120 units / min
          </div>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.04em] leading-[0.88] text-[color:var(--color-paper)] max-w-5xl">
            Engineered
            <br />
            <span className="text-[color:var(--color-signal)]">
              on this floor.
            </span>
          </h2>
          <p className="mt-8 max-w-xl font-mono text-sm text-[color:var(--color-steel-soft)]">
            Mechanical, electrical, controls, installation — all under one
            roof in Shah Alam. No re-badge, no outsourced engineering.
          </p>
        </div>
      </ZoomTransition>

      <FeaturedMachines />

      {/* ── Snowhouse zoom-to-fullbleed signature #2 ──
          Bridges FeaturedMachines → ScrollNarrative. Vision-checking
          system from the Custom Top Labelling Machine — quantified claim. */}
      <ZoomTransition
        image="/products/Custom_Top_Labelling_Machine_with_Checking_System_8.png"
        alt="Vision-checking system on a Custom Top Labelling Machine"
        scrollLength={2000}
        startScale={0.12}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 text-right">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            Vision · 1 ms detection
          </div>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.04em] leading-[0.88] text-[color:var(--color-paper)]">
            Vision-grade
            <br />
            <span className="text-[color:var(--color-signal)]">
              rejection.
            </span>
          </h2>
          <p className="mt-8 max-w-md ml-auto font-mono text-sm text-[color:var(--color-steel-soft)]">
            0.2% reject rate. Down from 1.4%. Same line. Different machine.
          </p>
        </div>
      </ZoomTransition>

      <ScrollNarrative />
      <TestimonialMarquee />
      <FaqSection />
      <CtaFooter />
    </>
  );
}
