import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';

// Until a Sanity `news` schema is connected, deep-linked news article URLs
// redirect to the listing index. Replace this with a Sanity-backed query when
// real news content arrives, mirroring the case-studies/[slug] pattern.

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

  if (slug === '__placeholder__') {
    redirect(`/${locale}/news`);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 lg:px-12 pt-40 pb-32 text-center">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — Drafting
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95]">
          This article is still
          <br />
          being written.
        </h1>
        <p className="mt-10 prose-editorial text-[color:var(--color-steel-soft)] text-lg max-w-xl mx-auto">
          Auraplex news lands quarterly. Head back to the index for the latest,
          or talk to us directly.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/news`}>Back to news</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href={`/${locale}/contact`}>Talk to us →</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
