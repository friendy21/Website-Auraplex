import { setRequestLocale } from 'next-intl/server';
import {
  categoryCounts,
  categoryLabel,
  getMachinesByCategory,
  type Category,
} from '@/lib/catalog';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { WhatWeMake, type Family } from '@/components/sections/what-we-make';
import { ValuePropGrid } from '@/components/sections/value-prop-grid';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { FaqSection } from '@/components/sections/faq-section';
import { CloserSection } from '@/components/sections/closer-section';
import { ScrollDrawLine } from '@/components/motion/scroll-draw-line';
import { MachineCarousel } from '@/components/sections/machine-carousel';
import { OutlineMarquee } from '@/components/sections/outline-marquee';

const FAMILY_SUMMARY: Record<Category, string> = {
  labelling:
    'Self-adhesive applicators for every container — top, side, wrap-around, print-and-apply, and custom rigs.',
  packaging:
    'Continuous-band sealing built for Malaysian production lines.',
  automation:
    'AR-series 3D printing and bespoke automation for prototyping and short runs.',
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const counts = categoryCounts();
  const repImage = (cat: Category) =>
    getMachinesByCategory(cat).find((m) => m.image)?.image ?? null;
  const families: Family[] = (['labelling', 'packaging', 'automation'] as Category[]).map(
    (key) => ({
      key,
      label: categoryLabel(key),
      count: counts[key],
      summary: FAMILY_SUMMARY[key],
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
        <WhatWeMake families={families} viewLabel="View {n} machines" />

        {/* THE catalogue moment — drag-to-spin 3D ring, every panel a
            link into the full catalogue. */}
        <MachineCarousel />

        <ValuePropGrid />
        <TestimonialMarquee />
        <FaqSection />
      </ScrollDrawLine>
      <CloserSection />
    </>
  );
}
