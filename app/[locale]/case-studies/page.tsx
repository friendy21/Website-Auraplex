import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Case Studies — Auraplex',
    description:
      'Editorial long-form reports from Auraplex installations across ASEAN. New stories quarterly.',
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
  const items = t.raw('expect.items') as {
    num: string;
    title: string;
    body: string;
  }[];

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

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — {t('expect.eyebrow')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {t('expect.h2Line1')}
              <br />
              {t('expect.h2Line2')}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {items.map((c, i) => (
            <Reveal
              key={c.num}
              variant="up"
              delay={i * 100}
              className="bg-[color:var(--color-ink)] p-10 md:p-12"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-4">
                {c.num}
              </div>
              <h3 className="font-display text-3xl tracking-[-0.01em] mb-3">
                {c.title}
              </h3>
              <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

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
