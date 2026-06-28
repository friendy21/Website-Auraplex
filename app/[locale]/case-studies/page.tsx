import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { ProofRail } from '@/components/sections/proof-rail';
import { ClientLogoWall } from '@/components/sections/client-logo-wall';
import { buildMetadata } from '@/lib/seo';

// Real milestones sourced from auraplex.com.my (news/events). Images already
// shipped in /public/exhibitions. No fabricated customer claims.
const MILESTONES = [
  {
    img: '/exhibitions/mimf-2023.png',
    date: '13–15 Jul 2023',
    title: 'Malaysia International Machinery Fair 2023',
    note: 'MITEC, Kuala Lumpur — one of the largest equipment exhibitions.',
  },
  {
    img: '/exhibitions/mimf-2024.jpg',
    date: '2024',
    title: 'Metaltech Hybrid Exhibition 2024',
    note: 'MITEC, Kuala Lumpur.',
  },
  {
    img: '/exhibitions/mimf-2022.jpg',
    date: '2022',
    title: 'Malaysia International Machinery Fair 2022',
    note: 'Bringing Auraplex machines to the manufacturing floor.',
  },
  {
    img: '/exhibitions/metaltech-2022.jpg',
    date: '2022',
    title: 'Metaltech Hybrid Exhibition 2022',
    note: 'MITEC.',
  },
  {
    img: '/exhibitions/agro-2022.jpg',
    date: '2022',
    title: 'Agro Job Fair — MAHA 2022',
    note: 'Meeting agri-processing manufacturers.',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Recognition & Milestones — Auraplex',
    description:
      'Auraplex SDN BHD — recognised as a best company for innovation at MIMF 2024, and on the floor at Malaysia International Machinery Fair and Metaltech (MITEC, Kuala Lumpur).',
    path: `/${locale}/case-studies`,
  });
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.caseStudies');
  const tAbout = await getTranslations('pages.about');

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            {t('h1Line1')}
            <br />
            <span className="text-[color:var(--color-signal)]">
              {t('h1Line2')}
            </span>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      <ProofRail />

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-16 border-y border-[color:var(--color-neutral-700)]">
        <div className="grid grid-cols-12 gap-6 items-end">
          <Reveal variant="up" className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('divider.issueLabel')}
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              {t('divider.issueValue')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={80} className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('divider.subjectLabel')}
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              {t('divider.subjectValue')}
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={160}
            className="col-span-12 md:col-span-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('divider.filedLabel')}
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              {t('divider.filedValue')}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REAL RECOGNITION (sourced from auraplex.com.my) ── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-8 lg:gap-6 items-center">
          <Reveal variant="up" className="col-span-12 lg:col-span-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — Recognition · MIMF 2024
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.92]">
              Best company
              <br />
              <span className="text-[color:var(--color-signal)]">for innovation.</span>
            </h2>
            <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl">
              Auraplex SDN BHD specializes in manufacturing labelling machines,
              packaging machines, 3D printers and customized machines —
              recognised at the Malaysia International Machinery Fair as a best
              company for innovation.
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
              10 Dec 2024 · MITEC, Kuala Lumpur
            </div>
          </Reveal>
          <Reveal variant="up" delay={120} className="col-span-12 lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
              <Image
                src="/exhibitions/mimf-2024.jpg"
                alt="Auraplex recognised for innovation at MIMF, MITEC Kuala Lumpur"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REAL MILESTONES TIMELINE ── */}
      <section className="border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — On the floor
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] mb-16">
            Where we&apos;ve shown up.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.title} variant="up" delay={i * 80}>
              <article className="group h-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={m.img}
                    alt={m.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-paper)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1">
                    {m.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl tracking-[-0.01em] leading-snug mb-2">
                    {m.title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                    {m.note}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Client wall — proof consolidated onto the hub (also on About). */}
      <ClientLogoWall
        eyebrow={tAbout('trustedBy.eyebrow')}
        footnote={tAbout('trustedBy.footnote')}
      />

      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-32 text-center">
        <Reveal variant="up">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
            {t('cta.h2')}
          </h2>
          <p className="mt-6 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl mx-auto">
            {t('cta.body')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t('cta.primary')} →</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={`/${locale}/2026`}>{t('cta.secondary')} →</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
