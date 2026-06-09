import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';
import { getNewsByDate } from '@/lib/news';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'News & Events — Auraplex',
    description:
      'Auraplex news, industry awards, exhibition updates and announcements from the Seri Kembangan floor.',
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

      {/* ────── POSTS LIST ──────
              Static seed posts from lib/news.ts. Each row: chip
              (category) + date + headline + summary + read-more link.
              Sorted newest first. */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
        <ul className="divide-y divide-[color:var(--color-neutral-700)]">
          {getNewsByDate().map((post, i) => (
            <Reveal key={post.slug} variant="up" delay={i * 60}>
              <li>
                <Link
                  href={`/${locale}/news/${post.slug}`}
                  className="group grid grid-cols-12 gap-6 py-10 hover:bg-[color:var(--color-neutral-800)]/30 transition-colors"
                >
                  <div className="col-span-12 md:col-span-3 flex md:flex-col gap-4 md:gap-2 items-baseline">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] inline-flex items-center gap-2">
                      <span className="h-1 w-1 bg-[color:var(--color-signal)]" />
                      {post.category}
                    </span>
                    <time
                      dateTime={post.date}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]"
                    >
                      {new Date(post.date).toLocaleDateString('en-MY', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  {/* Thumbnail — pulls the real exhibition / factory
                      floor photo from /public assets we synced from
                      autolabellermalaysia.com */}
                  {post.image && (
                    <div className="col-span-12 md:col-span-3 relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
                      <Image
                        src={post.image}
                        alt={post.imageAlt ?? post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div
                    className={
                      post.image
                        ? 'col-span-12 md:col-span-6'
                        : 'col-span-12 md:col-span-9'
                    }
                  >
                    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[-0.02em] leading-[1.1] mb-3 group-hover:text-[color:var(--color-signal)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl mb-4">
                      {post.summary}
                    </p>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-signal)] inline-flex items-center gap-2">
                      {t('readMore')}
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CTA tail — link to the year review */}
      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-24 text-center border-t border-[color:var(--color-neutral-700)]">
        <Reveal variant="up">
          <p className="prose-editorial text-[color:var(--color-steel-soft)] max-w-xl mx-auto">
            {t('empty.body')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/2026`}>{t('empty.secondary')} →</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={`/${locale}/contact`}>{t('empty.primary')} →</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
