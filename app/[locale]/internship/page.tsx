import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { InternshipForm } from '@/components/forms/internship-form';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Internship — Auraplex',
    description:
      'Paid internships at Auraplex Seri Kembangan — mechanical, electrical, controls, software, industrial design, and service. 3–6 months on the factory floor.',
    path: `/${locale}/internship`,
  });
}

/**
 * /internship — the primary internship landing page. Matches the real
 * autolabellermalaysia.com convention of a top-level "Internship" nav
 * item rather than burying it inside /careers.
 *
 * Page anatomy:
 *   1. Hero — eyebrow, big H1, lede
 *   2. Why Auraplex — three bullet block (paid, on-floor, real machines)
 *   3. Disciplines — 6 fields you can intern in (reuses common.disciplines)
 *   4. Application form — full <InternshipForm /> (the same component
 *      embedded on /careers; the form action submits the same lead so
 *      there's a single recruiting inbox no matter which page they
 *      filled in)
 *   5. FAQ — reuses pages.careers.faq.* (single source of truth)
 *   6. Looking for full-time? — cross-link back to /careers
 */
export default async function InternshipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.internship');
  const tCareers = await getTranslations('pages.careers');
  const tCommon = await getTranslations('common');

  const disciplines = tCommon.raw('disciplines') as {
    role: string;
    focus: string;
  }[];

  return (
    <>
      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            {t('h1Line1')}
            <br />
            <span className="text-[color:var(--color-signal)]">
              {t('h1Line2')}
            </span>
          </h1>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            {t('lede')}
          </p>
        </Reveal>
      </section>

      {/* ────── FLOOR PHOTO — real Auraplex factory floor ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pb-16">
        <Reveal variant="up">
          <div className="relative aspect-[21/9] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
            <Image
              src="/floor/workers.jpg"
              alt="Auraplex engineers on the Seri Kembangan factory floor"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-paper)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-3 py-2">
                Auraplex · Seri Kembangan · 2026
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ────── WHY AURAPLEX ────── */}
      <section className="border-y border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          {(['paid', 'duration', 'floor'] as const).map((key, i) => (
            <Reveal key={key} variant="up" delay={i * 100}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                0{i + 1}
              </div>
              <h3 className="font-display text-2xl md:text-3xl tracking-[-0.01em] mb-4">
                {t(`why.${key}.title`)}
              </h3>
              <p className="prose-editorial text-sm text-[color:var(--color-steel-soft)]">
                {t(`why.${key}.body`)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── DISCIPLINES ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {t('disciplines.eyebrow')}
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={100}
            className="col-span-12 md:col-span-9"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {t('disciplines.h2')}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {disciplines.map((d, i) => (
            <Reveal
              key={d.role}
              variant="up"
              delay={i * 60}
              className="bg-[color:var(--color-ink)] p-10 md:p-12"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)] mb-4">
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

      {/* ────── APPLY ────── */}
      <section
        id="apply"
        className="border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32"
      >
        <div className="grid grid-cols-12 gap-6">
          <Reveal variant="up" className="col-span-12 lg:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {tCareers('apply.eyebrow')}
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1.05]">
              {tCareers('apply.h2Line1')}
              <br />
              <span className="text-[color:var(--color-signal)]">
                {tCareers('apply.h2Line2')}
              </span>
            </h2>
            <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)]">
              {tCareers('apply.body')}
            </p>
          </Reveal>
          <Reveal
            variant="up"
            delay={100}
            className="col-span-12 lg:col-span-7"
          >
            <InternshipForm locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ────── FAQ — reuses careers.faq keys (single source of truth) ────── */}
      <section className="border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {tCareers('faq.eyebrow')}
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={100}
            className="col-span-12 md:col-span-9"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {tCareers('faq.h2')}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {(tCareers.raw('faq.items') as { q: string; a: string }[]).map(
            (item, i) => (
              <Reveal
                key={i}
                variant="up"
                delay={i * 60}
                className="bg-[color:var(--color-ink)] p-8 lg:p-10"
              >
                <h3 className="font-display text-xl md:text-2xl tracking-[-0.01em] mb-4">
                  {item.q}
                </h3>
                <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                  {item.a}
                </p>
              </Reveal>
            ),
          )}
        </div>
      </section>

      {/* ────── CROSS-LINK BACK TO /careers ────── */}
      <section className="border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
        <Reveal variant="up">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)] mb-3">
                — {t('careersLink.eyebrow')}
              </div>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.01em] max-w-2xl">
                {t('careersLink.body')}
              </h2>
            </div>
            <Link
              href={`/${locale}/careers`}
              className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-signal)] hover:text-[color:var(--color-paper)] transition-colors"
            >
              {t('careersLink.cta')} →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
