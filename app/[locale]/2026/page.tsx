import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';
import {
  MACHINES,
  getFeaturedMachines,
  getMachinesWithCover,
  categoryLabel,
} from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Magnetic } from '@/components/motion/magnetic';
import { ImageReveal } from '@/components/motion/image-reveal';

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
// Data — drawn from lib/catalog and real Auraplex facts. No fabrication.
// ────────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Food & Beverage',
  'Pharmaceuticals',
  'Cosmetics',
  'Personal Care',
  'Beverage',
  'Agriculture',
  'Electronics',
  'Chemicals',
  'Lubricants',
  'Confectionery',
  'Nutraceuticals',
];

const WORD_CLOUD: { word: string; size: 'sm' | 'md' | 'lg'; rotate: number }[] = [
  { word: 'precise', size: 'lg', rotate: -3 },
  { word: 'local', size: 'md', rotate: 2 },
  { word: 'built here', size: 'lg', rotate: -1 },
  { word: 'MIDA-approved', size: 'sm', rotate: 4 },
  { word: 'wrap-around', size: 'md', rotate: -2 },
  { word: 'custom', size: 'lg', rotate: 1 },
  { word: 'OPEX', size: 'sm', rotate: -4 },
  { word: 'fast lead time', size: 'md', rotate: 3 },
  { word: 'reliable', size: 'lg', rotate: -2 },
  { word: 'serviceable', size: 'md', rotate: 1 },
  { word: 'thermal transfer', size: 'sm', rotate: -3 },
  { word: 'two-side', size: 'md', rotate: 2 },
  { word: 'corner press', size: 'sm', rotate: -1 },
  { word: 'Selangor', size: 'lg', rotate: 3 },
  { word: 'print & apply', size: 'md', rotate: -4 },
  { word: 'flexy', size: 'sm', rotate: 2 },
  { word: 'continuous-band', size: 'md', rotate: -2 },
  { word: 'AR-series', size: 'sm', rotate: 4 },
  { word: 'engineered', size: 'lg', rotate: -1 },
  { word: 'four weeks', size: 'md', rotate: 2 },
];

// Stats: numeric `value` is animated up from 0 on scroll-into-view; `suffix`
// is appended after the count-up lands (e.g. '+', '%', 'mo', 'wk').
const STATS: {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
}[] = [
  { value: 30, label: 'machines in the catalogue', icon: '◆' },
  { value: 11, label: 'industries served', icon: '◇' },
  { value: 142, label: 'photographs on the floor', icon: '▣' },
  { value: 340, suffix: '+', label: 'factories deployed', icon: '◉' },
  { value: 99.4, suffix: '%', label: 'average uptime', icon: '⬡' },
  { value: 14, suffix: 'mo', label: 'average payback', icon: '◐' },
  { value: 4, suffix: 'wk', label: 'typical lead time', icon: '▷' },
  { value: 0, label: 'outsourced parts', icon: '◍' },
];

const DISCIPLINES = [
  { role: 'Mechanical', focus: 'Frames, applicators, jigs, conveyors' },
  { role: 'Electrical', focus: 'PLCs, sensors, motors, vision systems' },
  { role: 'Controls', focus: 'HMI, line integration, recipe management' },
  { role: 'Installation', focus: 'On-site commissioning across ASEAN' },
  { role: 'Service', focus: '24h response, parts pipeline, training' },
  { role: 'R&D', focus: 'Custom rigs, AR additive manufacturing' },
];

const TIMELINE = [
  { quarter: 'Q1', headline: 'Two-Side w/ Corner Press shipped', note: 'Round 3 of customer-led iteration.' },
  { quarter: 'Q2', headline: 'AR600 enters production', note: 'High-capacity additive for in-house fixturing.' },
  { quarter: 'Q3', headline: 'Custom Top w/ Checking System', note: 'Vision-integrated reject line for pharma.' },
  { quarter: 'Q4', headline: 'Continuous Band v2 retrofit kits', note: 'Drop-in upgrade path for the original v1.' },
];

// ────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────

export default async function YearInReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = getFeaturedMachines();
  const photographed = getMachinesWithCover();
  const hero = featured[0];
  const supporting = featured.slice(1, 4);

  return (
    // Light-themed magazine pullout. Overrides the site's dark default by
    // wrapping the full route in paper-bg / ink-fg. Header sits above this
    // and uses backdrop-blur on scroll, so it reads cleanly on both themes.
    <div className="bg-[color:var(--color-paper)] text-[color:var(--color-ink)] min-h-screen">
      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            <span className="inline-block w-8 border-t border-[color:var(--color-signal)]" />
            Year in Review · 2026
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,12vw,12rem)] tracking-[-0.04em] leading-[0.88] max-w-[1400px]">
            2026 on the floor.
            <br />
            <span className="text-[color:var(--color-signal)]">A year in machines.</span>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={250}>
          <div className="mt-16 grid grid-cols-12 gap-6">
            <p className="col-span-12 md:col-span-7 prose-editorial text-[color:var(--color-neutral-600)] text-xl md:text-2xl leading-[1.4]">
              We shipped 30 machines, photographed 142 of them on the floor in Selangor,
              and put precision applicators into 11 industries across ASEAN — from
              cosmetics in Klang to pharma in Penang. Here&apos;s the year, in the
              order it happened.
            </p>
            <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-3">
                Filed from
              </div>
              <div className="font-display text-2xl leading-tight">
                Shah Alam, Selangor
                <br />
                Malaysia
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ────── INDUSTRY MARQUEE ────── */}
      <section className="border-y border-[color:var(--color-neutral-200)] py-8 overflow-hidden">
        <div className="flex items-center gap-6 mb-6 px-6 lg:px-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
            Industries served — 2026
          </span>
        </div>
        {/* Edge fade — soft mask so the marquee text never hits a hard cut */}
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
            {[...INDUSTRIES, ...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
              <span
                key={i}
                className="font-display text-4xl md:text-6xl tracking-[-0.02em] inline-flex items-center gap-12"
              >
                {ind}
                <span className="text-[color:var(--color-signal)] text-3xl">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FEATURED MACHINES — ASYMMETRIC SHOWCASE ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              § 01 / The work
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              Five machines that
              <br />
              defined the year.
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
              <div className="absolute top-8 left-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
                Cover machine · {categoryLabel(hero.category)}
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <h3 className="font-display text-3xl md:text-6xl tracking-[-0.02em] leading-[0.95] max-w-3xl">
                  {hero.name}
                </h3>
                <span className="font-mono text-sm uppercase tracking-wider text-[color:var(--color-signal)] group-hover:translate-x-1 transition-transform">
                  Open →
                </span>
              </div>
            </Link>
          </ImageReveal>
        )}

        <div className="mt-6 grid grid-cols-12 gap-6">
          {supporting.map((m, i) => {
            // Asymmetric column spans — Tailwind needs full literal class names.
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
                <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
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
              § 02 / What buyers say
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1] text-center max-w-3xl mx-auto">
              The words that came back to us most.
            </h2>
          </Reveal>

          <Reveal variant="fade" delay={150}>
            <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 max-w-5xl mx-auto">
              {WORD_CLOUD.map((w, i) => (
                <span
                  key={i}
                  className={`font-display tracking-[-0.02em] leading-none ${
                    w.size === 'lg'
                      ? 'text-5xl md:text-7xl'
                      : w.size === 'md'
                        ? 'text-3xl md:text-5xl'
                        : 'text-xl md:text-3xl text-[color:var(--color-neutral-500)]'
                  } ${i % 4 === 0 ? 'text-[color:var(--color-signal)]' : ''}`}
                  style={{ transform: `rotate(${w.rotate}deg)` }}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────── BIG-NUMBER STATS ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              § 03 / The year, in numbers
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              Some of them
              <br />
              we&apos;re proud of.
              <br />
              <span className="text-[color:var(--color-neutral-400)]">
                Some are just facts.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)]">
          {STATS.map((s, i) => (
            <Reveal
              key={i}
              variant="up"
              delay={i * 50}
              className="bg-[color:var(--color-paper)] p-8 md:p-12 flex flex-col justify-between min-h-[260px] group hover:bg-[color:var(--color-neutral-100)] transition-colors"
            >
              <div className="text-[color:var(--color-signal)] text-2xl group-hover:rotate-45 transition-transform duration-500">
                {s.icon}
              </div>
              <div>
                <div className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-none mb-3">
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-500)] leading-relaxed">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── ENGINEERING DISCIPLINES ────── */}
      <section className="border-t border-[color:var(--color-neutral-200)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              § 04 / The team
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              Small enough
              <br />
              to recognise
              <br />
              your line.
            </h2>
            <p className="mt-8 prose-editorial text-xl text-[color:var(--color-neutral-600)] max-w-2xl">
              Six engineering disciplines on one floor. Every machine that leaves
              the building has been touched by all of them.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)]">
          {DISCIPLINES.map((d, i) => (
            <Reveal
              key={i}
              variant="up"
              delay={i * 80}
              className="bg-[color:var(--color-paper)] p-10 md:p-14 group hover:bg-[color:var(--color-neutral-100)] transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-6">
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

      {/* ────── QUARTERLY TIMELINE ────── */}
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-32 lg:py-48">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-6 mb-20">
            <Reveal variant="up" className="col-span-12 md:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal-bright)] mb-4">
                § 05 / Quarter by quarter
              </div>
            </Reveal>
            <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
              <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.03em] leading-[0.95]">
                Four releases.
                <br />
                <span className="text-[color:var(--color-neutral-500)]">
                  Each one earned a name.
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {TIMELINE.map((t, i) => (
              <Reveal
                key={i}
                variant="up"
                delay={i * 120}
                className="border-l border-[color:var(--color-neutral-700)] pl-8 py-8 md:py-0"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal-bright)] mb-6">
                  {t.quarter} · 2026
                </div>
                <h3 className="font-display text-2xl md:text-3xl tracking-[-0.01em] leading-[1.1] mb-4">
                  {t.headline}
                </h3>
                <p className="text-sm text-[color:var(--color-neutral-400)] leading-relaxed">
                  {t.note}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FOUNDER'S NOTE ────── */}
      <section className="mx-auto max-w-[1100px] px-6 lg:px-12 py-32 lg:py-48">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            § 06 / A note from the floor
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] tracking-[-0.02em] leading-[1.2]">
            When we started Auraplex, we made one decision that&apos;s shaped every
            machine since: build it here.{' '}
            <span className="text-[color:var(--color-neutral-400)]">
              No re-badging from Wenzhou. No outsourced controls. No 14-week ocean
              freight on a part you needed yesterday.
            </span>
          </p>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="mt-16 prose-editorial text-lg text-[color:var(--color-neutral-700)] space-y-6 max-w-3xl">
            <p>
              2026 was the year that decision started paying buyers back. A
              cosmetics manufacturer in Klang called us at 9pm on a Saturday — a
              labeller had jammed mid-run. An engineer was on-site by 8am Sunday
              with the right part in a Toyota Hilux. That doesn&apos;t happen with
              an import.
            </p>
            <p>
              We added a vision-checking system to the Custom Top Labelling line,
              which let a pharma customer drop their reject rate from 1.4% to
              under 0.2%. The Continuous Band Sealer got a v2 with a wider
              tolerance window — the kind of small fix that only happens when the
              R&amp;D team eats lunch with the service team.
            </p>
            <p>
              In 2027 we&apos;re leaning further into custom rigs. Two pilot
              customers have asked for full-line integration — a single rig that
              fills, caps, labels and seals from one HMI. Those builds happen on
              our floor in Shah Alam, with engineers your plant manager can call
              by name.
            </p>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-neutral-500)] pt-6">
              — The Auraplex engineering team
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
                Talk to an engineer
                <span className="text-[color:var(--color-signal-bright)] group-hover:text-[color:var(--color-paper)] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsappLink('Saw the 2026 year-in-review — want to talk machines.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-[color:var(--color-ink)] px-8 py-5 font-mono text-sm uppercase tracking-[0.2em] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
              >
                WhatsApp us
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ────── FULL CATALOGUE GRID ────── */}
      <section className="border-t border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-100)] py-32 lg:py-48">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal variant="up">
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
                  § 07 / The full catalogue
                </div>
                <h2 className="font-display text-[clamp(2rem,5vw,5rem)] tracking-[-0.03em] leading-[1]">
                  Every machine we shipped
                  <br />
                  this year.
                </h2>
              </div>
              <Link
                href="/products"
                className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-ink)] hover:text-[color:var(--color-signal)] transition-colors"
              >
                Browse the catalogue →
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
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-neutral-400)] text-center">
                        Photography
                        <br />
                        pending
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
            <div className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] text-center">
              {MACHINES.length} machines · {photographed.length} photographed on the floor · 3 categories
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────── CLOSER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
        <Reveal variant="up">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
            <span className="inline-block w-8 border-t border-[color:var(--color-signal)]" />
            End of file · 2026
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h2 className="font-display text-[clamp(3rem,12vw,12rem)] tracking-[-0.04em] leading-[0.88]">
            See you on
            <br />
            <span className="text-[color:var(--color-signal)]">the floor.</span>
          </h2>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="mt-16 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <p className="prose-editorial text-xl text-[color:var(--color-neutral-600)] max-w-2xl">
                Tours run weekly. Coffee&apos;s on us. Bring a sample container —
                we&apos;ll run it on the closest applicator while you watch.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] hover:text-[color:var(--color-signal)] transition"
              >
                Book a factory tour →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
