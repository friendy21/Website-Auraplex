import { setRequestLocale, getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import {
  categoryCounts,
  getMachinesByCategory,
  getMachinesWithCover,
  type Category,
} from '@/lib/catalog';
import { localizeMachines, localizedCategoryLabel } from '@/lib/catalog-i18n';
import { HeroCinematic } from '@/components/sections/hero-cinematic';
import { LiveDataTicker } from '@/components/sections/live-data-ticker';
import { WhatWeMake, type Family } from '@/components/sections/what-we-make';
import { FaqSection } from '@/components/sections/faq-section';
import { CloserSection } from '@/components/sections/closer-section';
import { ScrollDrawLine } from '@/components/motion/scroll-draw-line';
import { MachineHyperscrollLazy } from '@/components/sections/machine-hyperscroll-lazy';

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
   * HOME ARC — "Edit to one signature". Five deliberate beats built around
   * the MachineHyperscroll flythrough as THE moment:
   *
   *   1. Overture — the PageLoader (staged brand entrance, global)
   *   2. Hero     — bespoke tunnel that flows straight INTO the flythrough
   *   3. SIGNATURE — MachineHyperscroll (3D machine dive) — the centrepiece
   *   4. Proof    — LiveDataTicker → WhatWeMake (numbers, then the families)
   *   5. Closer   — FAQ → the invitation
   *
   * Demoted OFF the homepage to keep the arc undiluted (re-homed, not
   * deleted): MachineAccordion → /products, ValuePropGrid → /about,
   * TestimonialMarquee → /about, OutlineMarquee removed so hero → Hyperscroll
   * is one continuous dive.
   * ────────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Beat 2 — hero flows into the flythrough with no interruption. */}
      <HeroCinematic />

      {/* Beat 3 — THE signature: scroll-driven 3D flythrough of real machines. */}
      <MachineHyperscrollLazy machines={flythrough} />

      {/* Beats 4–5 — proof then invitation. The cerulean rope threads this
          block; Closer stays outside so the line never reaches the finale. */}
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
        <FaqSection />
      </ScrollDrawLine>
      <CloserSection />
    </>
  );
}
