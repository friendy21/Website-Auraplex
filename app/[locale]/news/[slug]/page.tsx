import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return [{ slug: '__placeholder__' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'News article coming soon — Auraplex',
    description: 'This article is still being written.',
    path: `/${locale}/news`,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.news.article');

  if (slug === '__placeholder__') {
    redirect(`/${locale}/news`);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 lg:px-12 pt-40 pb-32 text-center">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — {t('eyebrow')}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95]">
          {t('h2Line1')}
          <br />
          {t('h2Line2')}
        </h1>
        <p className="mt-10 prose-editorial text-[color:var(--color-steel-soft)] text-lg max-w-xl mx-auto">
          {t('body')}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/news`}>{t('back')}</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href={`/${locale}/contact`}>{t('talkToUs')} →</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
