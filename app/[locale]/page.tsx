import { setRequestLocale, getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import {
  categoryCounts,
  getMachinesByCategory,
  getMachinesWithCover,
  getFeaturedMachines,
  type Category,
} from '@/lib/catalog';
import { localizeMachines, localizedCategoryLabel } from '@/lib/catalog-i18n';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { WhatWeMake, type Family } from '@/components/sections/what-we-make';
import { ValuePropGrid } from '@/components/sections/value-prop-grid';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { FaqSection } from '@/components/sections/faq-section';
import { CloserSection } from '@/components/sections/closer-section';
import { ScrollDrawLine } from '@/components/motion/scroll-draw-line';
import { MachineHyperscroll } from '@/components/sections/machine-hyperscroll';
import { MachineAccordion } from '@/components/sections/machine-accordion';
import { OutlineMarquee } from '@/components/sections/outline-marquee';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title:
      'Auraplex — Labelling, packaging & automation machines, engineered in Malaysia',
    description:
      'Auraplex Sdn Bhd designs, builds, installs and services self-adhesive labelling machines, packaging machinery and 3D-printing automation from Seri Kembangan, Selangor — 30 machines across three families, with local parts and support.',
    path: `/${locale}`,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const counts = categoryCounts();
  const repImage = (cat: Category) =>
    getMachinesByCategory(cat).find((m) => m.image)?.image ?? null;

  // Real machines (with cover art) for the Hyperscroll flythrough.
  const flythrough = localizeMachines(getMachinesWithCover(), locale).map((m) => ({
    image: m.image as string,
    slug: m.slug,
    name: m.name,
  }));

  // Featured machines for the cinematic expanding-panel accordion.
  const showcase = localizeMachines(getFeaturedMachines(), locale).map((m) => ({
    slug: m.slug,
    name: m.name,
    image: m.image as string,
    category: m.category,
    label: localizedCategoryLabel(m.category, locale),
    summary: m.summary,
    photos: m.gallery.length,
  }));
  const families: Family[] = (['labelling', 'packaging', 'automation'] as Category[]).map(
    (key) => ({
      key,
      label: localizedCategoryLabel(key, locale),
      count: counts[key],
      summary: t(`familySummaries.${key}`),
      image: repImage(key),
    }),
  );

  /* ──────────────────────────────────────────────────────────────────
   * REDESIGNED HOME ARC — decluttered, machine-first (hero untouched):
   *
   *   1. Hero            — untouched
   *   2. OutlineMarquee  — brand band, bridges hero into the body
   *   3. LiveDataTicker  — positioning / proof, in honest numbers
   *   4. WhatWeMake      — the three families → into the catalogue
   *   5. MachineCarousel — featured machines (drag-to-spin ring)
   *   6. ValuePropGrid   — why Auraplex
   *   7. Testimonials    — recognition
   *   8. FAQ             — the questions
   *   9. Closer          — the invitation
   *
   * Cut in the redesign: Manifesto, the cinematic ZoomTransition, and the
   * pinned ScrollNarrative — abstract/decorative/heavy interludes that
   * diluted the machine-first flow.
   * ────────────────────────────────────────────────────────────────── */
  return (
    <>
      <HeroCinematic />
      <OutlineMarquee />
      {/* The cerulean rope threads from just below the hero to the end
          of the FAQ — Closer stays outside so the line never reaches
          the finale or footer. */}
      <ScrollDrawLine>
        <LiveDataTicker
          machines={counts.all}
          families={3}
          since={2021}
          recognition="MIMF '24"
        />
        <WhatWeMake
          families={families}
          viewLabel={t('whatWeMake.viewLabel')}
          eyebrow={t('whatWeMake.eyebrow')}
          headingLine1={t('whatWeMake.headingLine1')}
          headingLine2={t('whatWeMake.headingLine2')}
        />

        {/* THE catalogue moment — a scroll-driven 3D flythrough of the real
            machines (Hyper Scroll). Every card links into the catalogue. */}
        <MachineHyperscroll machines={flythrough} />

        {/* Cinematic expanding-panel accordion — click a machine to expand. */}
        <MachineAccordion items={showcase} />

        <ValuePropGrid />
        <TestimonialMarquee />
        <FaqSection />
      </ScrollDrawLine>
      <CloserSection />
    </>
  );
}
