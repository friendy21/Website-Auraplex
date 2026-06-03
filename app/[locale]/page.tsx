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
      <ScrollNarrative />
      <FeaturedMachines />
      <TestimonialMarquee />
      <FaqSection />
      <CtaFooter />
    </>
  );
}
