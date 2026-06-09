import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';
import { NEWS, getNewsPost } from '@/lib/news';

export async function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getNewsPost(slug);
  if (!post) {
    return buildMetadata({
      title: 'News — Auraplex',
      description: 'Article not found.',
      path: `/${locale}/news`,
    });
  }
  return buildMetadata({
    title: `${post.title} — Auraplex`,
    description: post.summary,
    path: `/${locale}/news/${slug}`,
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
  const post = getNewsPost(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Hero image — full-bleed cover photo for the article */}
      {post.image && (
        <section className="pt-32">
          <Reveal variant="up">
            <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
              <div className="relative aspect-[21/9] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
                <Image
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <article
        className={`mx-auto max-w-3xl px-6 lg:px-12 pb-24 ${
          post.image ? 'pt-16' : 'pt-40'
        }`}
      >
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {post.category} · {formattedDate}
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(2.25rem,6vw,5rem)] tracking-[-0.03em] leading-[1] mb-12">
            {post.title}
          </h1>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <p className="prose-editorial text-xl text-[color:var(--color-paper)] mb-16 leading-relaxed">
            {post.summary}
          </p>
        </Reveal>

        <Reveal variant="up" delay={300}>
          <div className="space-y-8 prose-editorial text-[color:var(--color-steel-soft)]">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        {post.ctaHref && post.ctaLabel && (
          <Reveal variant="up" delay={400}>
            <div className="mt-16 pt-12 border-t border-[color:var(--color-neutral-700)]">
              <Button asChild size="lg">
                <Link href={`/${locale}${post.ctaHref}`}>
                  {post.ctaLabel} →
                </Link>
              </Button>
            </div>
          </Reveal>
        )}
      </article>

      <section className="mx-auto max-w-3xl px-6 lg:px-12 pb-32 border-t border-[color:var(--color-neutral-700)] pt-12">
        <Reveal variant="up">
          <Link
            href={`/${locale}/news`}
            className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] hover:text-[color:var(--color-paper)] transition-colors inline-flex items-center gap-2"
          >
            ← {t('back')}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
