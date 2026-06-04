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
    title: 'News & Events — Auraplex',
    description:
      'Auraplex news, industry awards, exhibition updates and announcements from the Shah Alam floor.',
    path: `/${locale}/news`,
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.news');

  return (
    <>
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
            {t('h1Line2')}
          </h1>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-16 border-y border-[color:var(--color-neutral-700)]">
        <div className="grid grid-cols-12 gap-6 items-end">
          <Reveal variant="up" className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('divider.editionLabel')}
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              {t('divider.editionValue')}
            </div>
          </Reveal>
          <Reveal variant="up" delay={80} className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('divider.cadenceLabel')}
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              {t('divider.cadenceValue')}
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

      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-32 text-center">
        <Reveal variant="up">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
            {t('empty.h2')}
          </h2>
          <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl mx-auto">
            {t('empty.body')}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t('empty.primary')} →</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={`/${locale}/2026`}>{t('empty.secondary')} →</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
