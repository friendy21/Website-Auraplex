import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTickerStats } from '@/lib/kv';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { ManifestoSection } from '@/components/sections/manifesto-section';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { ValuePropGrid } from '@/components/sections/value-prop-grid';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { ScrollNarrative } from '@/components/sections/scroll-narrative';
import { FeaturedMachines } from '@/components/sections/featured-machines';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { FaqSection } from '@/components/sections/faq-section';
import { CloserSection } from '@/components/sections/closer-section';
import { ZoomTransition } from '@/components/motion/zoom-transition';
import { ScrollDrawLine } from '@/components/motion/scroll-draw-line';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zA = await getTranslations('home.zoomA');
  const zB = await getTranslations('home.zoomB');

  const stats = await getTickerStats().catch(() => ({
    machines: 1247,
    labels: 8_200_000,
    uptime: '99.4%',
    factories: 340,
  }));

  return (
    <>
      <HeroCinematic />
      <ManifestoSection />
      <ScrollDrawLine label="The line — Shah Alam to your floor" />
      <LiveDataTicker stats={stats} />
      <ValuePropGrid />
      <ProductShowcase />

      {/* ── Snowhouse zoom-to-fullbleed signature #1 ──
          Flexy Applicator zooms from thumbnail to full bleed. Copy is
          locale-aware via home.zoomA.* keys. */}
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

      <FeaturedMachines />

      {/* ── Snowhouse zoom-to-fullbleed signature #2 ──
          Vision-checking system. Copy via home.zoomB.* keys. */}
      <ZoomTransition
        image="/products/Custom_Top_Labelling_Machine_with_Checking_System_8.png"
        alt="Custom Top Labelling Machine with Checking System"
        scrollLength={2000}
        startScale={0.12}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 text-right">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {zB('eyebrow')}
          </div>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.04em] leading-[0.88] text-[color:var(--color-paper)]">
            {zB('h2Line1')}
            <br />
            <span className="text-[color:var(--color-signal)]">
              {zB('h2Line2')}
            </span>
          </h2>
          <p className="mt-8 max-w-md ml-auto font-mono text-sm text-[color:var(--color-steel-soft)]">
            {zB('body')}
          </p>
        </div>
      </ZoomTransition>

      <ScrollNarrative />
      <TestimonialMarquee />
      <FaqSection />
      <CloserSection />
    </>
  );
}
