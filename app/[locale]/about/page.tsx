import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';
import { MACHINES, getFeaturedMachines } from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'About — Auraplex',
    description:
      'Engineered in Malaysia. Built to outlast the line. Inside the Auraplex factory floor in Shah Alam.',
    path: `/${locale}/about`,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.about');

  const featured = getFeaturedMachines();
  const photographed = MACHINES.filter((m) => m.image !== null).length;

  return (
    <>
      <section className="relative min-h-[80dvh] w-full overflow-hidden bg-[color:var(--color-ink)] flex items-end">
        <div
          className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-25"
          aria-hidden="true"
        >
          {featured
            .concat(featured)
            .concat(featured)
            .slice(0, 12)
            .map((m, i) =>
              m.image ? (
                <div key={`${m.id}-${i}`} className="relative overflow-hidden">
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  key={`empty-${i}`}
                  className="bg-[color:var(--color-neutral-800)]"
                />
              ),
            )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/85 to-[color:var(--color-ink)]/60" />

        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 lg:px-12 pb-20 pt-40">
          <Reveal variant="up">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — {t('eyebrow')}
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
              {t('h1Line1')}
              <br />
              {t('h1Line2')}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-32 prose-editorial text-[color:var(--color-steel-soft)] text-lg space-y-6">
        <Reveal variant="up">
          <p>{t('p1')}</p>
        </Reveal>
        <Reveal variant="up" delay={80}>
          <p>{t('p2')}</p>
        </Reveal>
        <Reveal variant="up" delay={160}>
          <p>{t('p3')}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-y border-[color:var(--color-neutral-700)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat n={String(MACHINES.length)} l={t('stat.catalog')} />
          <Stat n={String(photographed)} l={t('stat.photographed')} />
          <Stat n="3" l={t('stat.families')} />
          <Stat n="6" l={t('stat.disciplines')} />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {t('disciplines.eyebrow')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {t('disciplines.h2Line1')}
              <br />
              {t('disciplines.h2Line2')}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {DISCIPLINES.map((d, i) => (
            <Reveal
              key={i}
              variant="up"
              delay={i * 80}
              className="bg-[color:var(--color-ink)] p-10 md:p-12"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-4">
                0{i + 1}
              </div>
              <h3 className="font-display text-3xl tracking-[-0.01em] mb-3">
                {d.role}
              </h3>
              <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                {d.focus}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="tour"
        className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 border-t border-[color:var(--color-neutral-700)]"
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <Reveal variant="up">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
                — {t('tour.eyebrow')}
              </div>
              <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
                {t('tour.h2')}
              </h2>
            </Reveal>
          </div>
          <Reveal
            variant="up"
            delay={120}
            className="col-span-12 md:col-span-6 md:col-start-7 prose-editorial text-[color:var(--color-steel-soft)]"
          >
            <p>{t('tour.body')}</p>
            <p className="mt-6 font-mono text-sm uppercase tracking-widest text-[color:var(--color-paper)]">
              {t('tour.address')}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">{t('tour.book')} →</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a
                  href={whatsappLink(t('tour.whatsappMsg'))}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('tour.whatsapp')} →
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// Disciplines stay in English — they're technical labels (Mechanical /
// Electrical / Controls / Installation / Service / R&D) that engineering
// candidates and customers recognize globally. Adding them to i18n would
// invite inconsistent translations of well-known industry terms.
const DISCIPLINES = [
  { role: 'Mechanical', focus: 'Frames, applicators, jigs, conveyors.' },
  { role: 'Electrical', focus: 'PLCs, sensors, motors, vision systems.' },
  { role: 'Controls', focus: 'HMI, line integration, recipe management.' },
  { role: 'Installation', focus: 'On-site commissioning across ASEAN.' },
  { role: 'Service', focus: 'Response, parts pipeline, operator training.' },
  { role: 'R&D', focus: 'Custom rigs, AR-series additive manufacturing.' },
];

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <Reveal variant="up">
      <div className="font-display text-4xl md:text-6xl text-[color:var(--color-signal)] tracking-[-0.02em]">
        {n}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] mt-3">
        {l}
      </div>
    </Reveal>
  );
}
