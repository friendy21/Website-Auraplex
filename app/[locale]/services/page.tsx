import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { KineticReveal } from '@/components/motion/kinetic-reveal';
import { StackingSteps } from '@/components/sections/stacking-steps';
import { AutoCarousel3D } from '@/components/sections/auto-carousel-3d';
import { getMachinesWithCover } from '@/lib/catalog';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { whatsappLink } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Services — Auraplex',
    description:
      'Installation, maintenance, training and custom automation — delivered by Auraplex engineers from Seri Kembangan.',
    path: `/${locale}/services`,
  });
}

/**
 * Services landing page.
 *
 * Service definitions live in messages/{en,ms,zh}.json under
 * pages.services.items so service names, summaries and deliverables
 * translate with the language switcher.
 */
type ServiceItem = {
  num: string;
  name: string;
  summary: string;
  deliverables: string[];
};

type ProcessStep = {
  num: string;
  name: string;
  summary: string;
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.services');
  const SERVICES = t.raw('items') as ServiceItem[];
  const PROCESS = t.raw('process.steps') as ProcessStep[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: `https://auraplex.my/${locale}` },
              { name: 'Services', url: `https://auraplex.my/${locale}/services` },
            ]),
          ),
        }}
      />

      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
        </Reveal>
        <KineticReveal
          as="h1"
          className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl"
        >
          {t('h1Line1')} {t('h1Line2')}
        </KineticReveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      {/* ────── SERVICES GRID ────── */}
      <section className="border-y border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.num}
              variant="up"
              delay={i * 100}
              className={`p-10 lg:p-16 border-[color:var(--color-neutral-700)] ${
                i % 2 === 0 ? 'lg:border-r' : ''
              } ${i < 2 ? 'border-b' : 'lg:border-b-0 border-b'}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                — {s.num}
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] leading-[1.05] mb-6">
                {s.name}
              </h2>
              <p className="prose-editorial text-[color:var(--color-steel-soft)] mb-10">
                {s.summary}
              </p>
              <ul className="space-y-3">
                {s.deliverables.map((d, j) => (
                  <li
                    key={j}
                    className="flex items-baseline gap-3 font-mono text-sm text-[color:var(--color-paper)]"
                  >
                    <span className="text-[color:var(--color-signal)] text-xs">
                      ◆
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── "HOW WE BUILD" PROCESS TIMELINE ──────
              7-step journey from first call to support, rendered as a
              vertical rail with numbered steps. Buyers convert when
              they can see the journey end-to-end. */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {t('process.eyebrow')}
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={100}
            className="col-span-12 md:col-span-9"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {t('process.h2Line1')}
              <br />
              <span className="text-[color:var(--color-neutral-400)]">
                {t('process.h2Line2')}
              </span>
            </h2>
            <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl">
              {t('process.body')}
            </p>
          </Reveal>
        </div>

        {/* Sticky stacking cards — each step pins, then tilts back + dims
            as the next scrolls over it. */}
        <StackingSteps steps={PROCESS} />
      </section>

      {/* ────── ROTATING MACHINE CAROUSEL (pure CSS) ────── */}
      <section className="border-t border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] py-20 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mb-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
            — The machines we install &amp; service
          </div>
        </div>
        <AutoCarousel3D
          items={getMachinesWithCover()
            .slice(0, 10)
            .map((m) => ({ image: m.image as string, slug: m.slug, name: m.name }))}
        />
      </section>

      {/* ────── CTA ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <Reveal variant="up">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
                {t('cta.h2Line1')}
                <br />
                <span className="text-[color:var(--color-neutral-400)]">
                  {t('cta.h2Line2')}
                </span>
              </h2>
              <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl">
                {t('cta.body')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 flex flex-wrap gap-3">
              <Magnetic strength={0.35}>
                <Button asChild size="lg">
                  <Link href="/contact">{t('cta.primary')} →</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="ghost" size="lg">
                  <a
                    href={whatsappLink(t('cta.whatsappMsg'))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('cta.whatsapp')} →
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
