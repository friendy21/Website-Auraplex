import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';
import {
  MACHINES,
  getFeaturedMachines,
  getMachinesWithCover,
  categoryCounts,
  categoryLabel,
} from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Magnetic } from '@/components/motion/magnetic';
import { ImageReveal } from '@/components/motion/image-reveal';
import { ScanLine } from '@/components/motion/scan-line';
import { HorizontalScrollSection } from '@/components/motion/horizontal-scroll';
import { WordCloud } from '@/components/sections/word-cloud';
import { CategoryRadial } from '@/components/sections/category-radial';
import { CoverageMap } from '@/components/sections/coverage-map';
import { MachineSphere } from '@/components/sections/machine-sphere';
import { MachineCube } from '@/components/sections/machine-cube';
import { ScrollHud } from '@/components/sections/scroll-hud';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: '2026 on the floor — Auraplex',
    description:
      'A year in machines. The Auraplex 2026 year in review — 30 machines, 11 industries, 142 photographs from the floor in Selangor.',
    path: `/${locale}/2026`,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Style configs (size + rotate per index) for the word cloud — the
// actual label text comes from i18n. Keep these 20 entries aligned with
// the 20 words in messages/*.json → page2026.wordCloud.words.
// ────────────────────────────────────────────────────────────────────────
const WORD_STYLES: { size: 'sm' | 'md' | 'lg'; rotate: number }[] = [
  { size: 'lg', rotate: -3 },
  { size: 'md', rotate: 2 },
  { size: 'lg', rotate: -1 },
  { size: 'sm', rotate: 4 },
  { size: 'md', rotate: -2 },
  { size: 'lg', rotate: 1 },
  { size: 'sm', rotate: -4 },
  { size: 'md', rotate: 3 },
  { size: 'lg', rotate: -2 },
  { size: 'md', rotate: 1 },
  { size: 'sm', rotate: -3 },
  { size: 'md', rotate: 2 },
  { size: 'sm', rotate: -1 },
  { size: 'lg', rotate: 3 },
  { size: 'md', rotate: -4 },
  { size: 'sm', rotate: 2 },
  { size: 'md', rotate: -2 },
  { size: 'sm', rotate: 4 },
  { size: 'lg', rotate: -1 },
  { size: 'md', rotate: 2 },
];

// Stats numeric values + icons live in code; labels come from i18n.
const STAT_VALUES: { value: number; suffix?: string; icon: string }[] = [
  { value: 30, icon: '◆' },
  { value: 11, icon: '◇' },
  { value: 142, icon: '▣' },
  { value: 340, suffix: '+', icon: '◉' },
  { value: 99.4, suffix: '%', icon: '⬡' },
  { value: 14, suffix: 'mo', icon: '◐' },
  { value: 4, suffix: 'wk', icon: '▷' },
  { value: 0, icon: '◍' },
];

export default async function YearInReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('page2026');
  const tCommon = await getTranslations('common');

  const industries = t.raw('industries') as string[];
  const words = t.raw('wordCloud.words') as string[];
  const statLabels = (t.raw('stats.items') as { label: string }[]).map(
    (s) => s.label,
  );
  const disciplines = tCommon.raw('disciplines') as {
    role: string;
    focus: string;
  }[];
  const timeline = t.raw('timeline.items') as {
    q: string;
    h: string;
    note: string;
  }[];

  const featured = getFeaturedMachines();
  const photographed = getMachinesWithCover();
  const hero = featured[0];
  const supporting = featured.slice(1, 4);
  const counts = categoryCounts();

  return (
    <div className="bg-[color:var(--color-paper)] text-[color:var(--color-ink)] min-h-screen">
      {/* Cinematic HUD overlay (desktop) */}
      <ScrollHud label="AURAPLEX // 2026 REVIEW" />

      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            <span className="inline-block w-8 border-t border-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,12vw,12rem)] tracking-[-0.04em] leading-[0.88] max-w-[1400px]">
            {t('h1Line1')}
            <br />
            <span className="text-[color:var(--color-signal)]">
              {t('h1Line2')}
            </span>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={250}>
          <div className="mt-16 grid grid-cols-12 gap-6">
            <p className="col-span-12 md:col-span-7 prose-editorial text-[color:var(--color-neutral-600)] text-xl md:text-2xl leading-[1.4]">
              {t('lede')}
            </p>
            <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)] mb-3">
                {t('filedFromLabel')}
              </div>
              <div className="font-display text-2xl leading-tight whitespace-pre-line">
                {t('filedFromValue')}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ────── INDUSTRY MARQUEE ────── */}
      <section className="border-y border-[color:var(--color-neutral-200)] py-8 overflow-hidden">
        <div className="flex items-center gap-6 mb-6 px-6 lg:px-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)]">
            {t('industriesLabel')}
          </span>
        </div>
        <div
          className="relative group"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
          }}
        >
          <div className="flex gap-12 animate-[scroll-x_60s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...industries, ...industries, ...industries].map((ind, i) => (
              <span
                key={i}
                className="font-display text-4xl md:text-6xl tracking-[-0.02em] inline-flex items-center gap-12"
              >
                {ind}
                <span className="text-[color:var(--color-signal)] text-3xl">
                  ◆
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FEATURED MACHINES ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              {t('work.eyebrow')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              {t('work.h2Line1')}
              <br />
              {t('work.h2Line2')}
            </h2>
          </Reveal>
        </div>

        {hero && (
          <ImageReveal direction="up" className="group">
            <Link
              href={`/products/${hero.slug}`}
              className="block relative aspect-[16/9] overflow-hidden border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-100)]"
            >
              {hero.image && (
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain p-20 transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute top-8 left-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)]">
                {t('work.coverLabel')} · {categoryLabel(hero.category)}
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <h3 className="font-display text-3xl md:text-6xl tracking-[-0.02em] leading-[0.95] max-w-3xl">
                  {hero.name}
                </h3>
                <span className="font-mono text-sm uppercase tracking-wider text-[color:var(--color-signal)] group-hover:translate-x-1 transition-transform">
                  {t('work.open')} →
                </span>
              </div>
            </Link>
          </ImageReveal>
        )}

        <div className="mt-6 grid grid-cols-12 gap-6">
          {supporting.map((m, i) => {
            const span =
              i === 0
                ? 'col-span-12 md:col-span-4'
                : i === 1
                  ? 'col-span-12 md:col-span-6'
                  : 'col-span-12 md:col-span-8';
            return (
              <Reveal
                key={m.id}
                variant="scale"
                delay={i * 100}
                className={`group ${span}`}
              >
                <Link
                  href={`/products/${m.slug}`}
                  className="block relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-100)]"
                >
                  {m.image && (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)]">
                    0{i + 2} / {categoryLabel(m.category)}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-display text-xl md:text-3xl tracking-[-0.01em] leading-[1.05]">
                      {m.name}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ────── WORD CLOUD ────── */}
      <section className="border-y border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-100)] py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal variant="up">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 text-center">
              {t('wordCloud.eyebrow')}
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1] text-center max-w-3xl mx-auto">
              {t('wordCloud.h2')}
            </h2>
          </Reveal>

          <WordCloud
            words={words.map((w, i) => ({
              word: w,
              size: WORD_STYLES[i]?.size ?? 'md',
              rotate: WORD_STYLES[i]?.rotate ?? 0,
            }))}
          />
        </div>
      </section>

      {/* ────── BIG-NUMBER STATS ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              {t('stats.eyebrow')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              {t('stats.h2Line1')}
              <br />
              {t('stats.h2Line2')}
              <br />
              <span className="text-[color:var(--color-neutral-600)]">
                {t('stats.h2Line3')}
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)]">
          {STAT_VALUES.map((s, i) => (
            <ScanLine
              key={i}
              direction="down"
              duration={650}
              delay={i * 80}
              className="bg-[color:var(--color-paper)] p-8 md:p-12 min-h-[260px] group hover:bg-[color:var(--color-neutral-100)] transition-colors"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="text-[color:var(--color-signal)] text-2xl group-hover:rotate-45 transition-transform duration-500">
                  {s.icon}
                </div>
                <div>
                  <div className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-none mb-3">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-600)] leading-relaxed">
                    {statLabels[i]}
                  </div>
                </div>
              </div>
            </ScanLine>
          ))}
        </div>
      </section>

      {/* ────── THE RANGE + COVERAGE (real catalogue data) ────── */}
      <section className="border-t border-[color:var(--color-neutral-200)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-12 lg:gap-6 items-center">
          <div className="col-span-12 lg:col-span-5">
            <Reveal variant="up">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                — The range, 2026
              </div>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.03em] leading-[0.95] mb-12">
                Thirty machines,
                <br />
                three families.
              </h2>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <CategoryRadial
                total={counts.all}
                centerLabel="machines"
                segments={[
                  { label: 'Labelling', value: counts.labelling, color: 'var(--color-signal)' },
                  { label: 'Automation', value: counts.automation, color: 'var(--color-ink)' },
                  { label: 'Packaging', value: counts.packaging, color: 'var(--color-steel)' },
                ]}
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <Reveal variant="up" delay={150}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                — Where they run
              </div>
              <CoverageMap />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ────── ROTATING MACHINE SPHERE (immersive, dark band) ────── */}
      <MachineSphere
        items={photographed.map((m) => ({
          image: m.image as string,
          slug: m.slug,
          name: m.name,
        }))}
        slides={[
          { title: 'Engineered in Selangor', desc: 'Every machine designed, built and tested on our Seri Kembangan floor.' },
          { title: 'Thirty machines', desc: 'Labelling, packaging and automation — one catalogue, built for ASEAN lines.' },
          { title: 'Precision, repeated', desc: 'Axis-true applicators tuned to your container shapes and throughput.' },
          { title: 'Local support', desc: 'Installation, training and parts from the same engineers who build them.' },
        ]}
      />

      {/* ────── ENGINEERING DISCIPLINES ────── */}
      <section className="border-t border-[color:var(--color-neutral-200)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              {t('team.eyebrow')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              {t('team.h2Line1')}
              <br />
              {t('team.h2Line2')}
              <br />
              {t('team.h2Line3')}
            </h2>
            <p className="mt-8 prose-editorial text-xl text-[color:var(--color-neutral-600)] max-w-2xl">
              {t('team.body')}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)]">
          {disciplines.map((d, i) => (
            <Reveal
              key={i}
              variant="up"
              delay={i * 80}
              className="bg-[color:var(--color-paper)] p-10 md:p-14 group hover:bg-[color:var(--color-neutral-100)] transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)] mb-6">
                0{i + 1}
              </div>
              <h3 className="font-display text-4xl md:text-5xl tracking-[-0.02em] mb-4">
                {d.role}
              </h3>
              <p className="text-[color:var(--color-neutral-600)] leading-relaxed">
                {d.focus}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── QUARTERLY TIMELINE — horizontal scroll ────── */}
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mb-16">
          <div className="grid grid-cols-12 gap-6">
            <Reveal variant="up" className="col-span-12 md:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal-bright)] mb-4">
                {t('timeline.eyebrow')}
              </div>
            </Reveal>
            <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
              <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
                {t('timeline.h2Line1')}
                <br />
                <span className="text-[color:var(--color-neutral-600)]">
                  {t('timeline.h2Line2')}
                </span>
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      <HorizontalScrollSection overscroll={1.4}>
        {timeline.map((q, i) => (
          <div
            key={i}
            className="relative w-screen h-[100dvh] flex-shrink-0 flex flex-col justify-center px-6 lg:px-24"
          >
            {/* Background watermark quarter number */}
            <div
              className="absolute inset-0 flex items-center justify-end pr-12 lg:pr-24 pointer-events-none select-none"
              aria-hidden="true"
            >
              <span className="font-display text-[35vw] leading-none tracking-[-0.04em] text-[color:var(--color-neutral-800)] opacity-30">
                {q.q.replace('Q', '')}
              </span>
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal-bright)] mb-8">
                {q.q} · 2026
              </div>
              <h3 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1.05] mb-8">
                {q.h}
              </h3>
              <p className="text-lg md:text-xl text-[color:var(--color-neutral-600)] leading-relaxed max-w-xl">
                {q.note}
              </p>

              {/* Signal dots + divider */}
              <div className="mt-16 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      className={`inline-block h-2 w-2 ${
                        j <= i ? 'bg-[color:var(--color-signal)]' : 'bg-[color:var(--color-neutral-700)]'
                      }`}
                    />
                  ))}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[color:var(--color-neutral-700)] to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)]">
                  0{i + 1} / 04
                </span>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScrollSection>

      {/* ────── FOUNDER'S NOTE ────── */}
      <section className="mx-auto max-w-[1100px] px-6 lg:px-12 py-32 lg:py-48">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            {t('founder.eyebrow')}
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] tracking-[-0.02em] leading-[1.2]">
            {t('founder.lead')}{' '}
            <span className="text-[color:var(--color-neutral-600)]">
              {t('founder.leadSub')}
            </span>
          </p>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="mt-16 prose-editorial text-lg text-[color:var(--color-neutral-700)] space-y-6 max-w-3xl">
            <p>{t('founder.p1')}</p>
            <p>{t('founder.p2')}</p>
            <p>{t('founder.p3')}</p>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-neutral-600)] pt-6">
              {t('founder.signature')}
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={300}>
          <div className="mt-16 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-[color:var(--color-ink)] text-[color:var(--color-paper)] px-8 py-5 font-mono text-sm uppercase tracking-[0.2em] hover:bg-[color:var(--color-signal)] transition-colors group"
              >
                {t('founder.ctaPrimary')}
                <span className="text-[color:var(--color-signal-bright)] group-hover:text-[color:var(--color-paper)] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsappLink(t('founder.ctaWhatsappMsg'))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-[color:var(--color-ink)] px-8 py-5 font-mono text-sm uppercase tracking-[0.2em] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
              >
                {t('founder.ctaWhatsapp')}
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ────── SIX-FACE MACHINE CUBE (immersive, dark band) ────── */}
      <MachineCube
        faces={photographed.slice(0, 6).map((m) => ({
          image: m.image as string,
          label: m.name,
          slug: m.slug,
        }))}
      />

      {/* ────── FULL CATALOGUE GRID ────── */}
      <section className="border-t border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-100)] py-32 lg:py-48">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal variant="up">
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
                  {t('catalogue.eyebrow')}
                </div>
                <h2 className="font-display text-[clamp(2rem,5vw,5rem)] tracking-[-0.03em] leading-[1]">
                  {t('catalogue.h2Line1')}
                  <br />
                  {t('catalogue.h2Line2')}
                </h2>
              </div>
              <Link
                href="/products"
                className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-ink)] hover:text-[color:var(--color-signal)] transition-colors"
              >
                {t('catalogue.browse')} →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {MACHINES.map((m, i) => (
              <Reveal
                key={m.id}
                variant="up"
                delay={Math.min(i * 30, 600)}
                className="group"
              >
                <Link
                  href={`/products/${m.slug}`}
                  className="block aspect-square relative overflow-hidden border border-[color:var(--color-neutral-200)] bg-[color:var(--color-paper)]"
                >
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-neutral-600)] text-center whitespace-pre-line">
                        {t('catalogue.pending')}
                      </div>
                    </div>
                  )}
                </Link>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-neutral-600)] leading-tight px-1">
                  {m.name}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up" delay={200}>
            <div className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)] text-center">
              {t('catalogue.summary', {
                total: MACHINES.length,
                photo: photographed.length,
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────── CLOSER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <Reveal variant="up">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            <span className="inline-block w-8 border-t border-[color:var(--color-signal)]" />
            {t('closer.eyebrow')}
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h2 className="font-display text-[clamp(3rem,12vw,12rem)] tracking-[-0.04em] leading-[0.88]">
            {t('closer.h2Line1')}
            <br />
            <span className="text-[color:var(--color-signal)]">
              {t('closer.h2Line2')}
            </span>
          </h2>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="mt-16 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <p className="prose-editorial text-xl text-[color:var(--color-neutral-600)] max-w-2xl">
                {t('closer.body')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] hover:text-[color:var(--color-signal)] transition"
              >
                {t('closer.cta')} →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
