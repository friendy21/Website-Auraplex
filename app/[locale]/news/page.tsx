import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
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

/**
 * News & Events landing.
 *
 * Like /case-studies, this is a designed empty state until real news content
 * lands. The structure is wired so adding a Sanity `news` schema later is a
 * one-step migration. No fabricated news items — listing real events would
 * be misleading on a fresh site.
 */
export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            News & Events
          </div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            What&apos;s happening
            <br />
            on the floor.
          </h1>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            Exhibitions, awards, partnerships, new machine releases. Updates
            from Auraplex go here — quarterly, honest, no marketing fluff.
          </p>
        </Reveal>
      </section>

      {/* ────── EDITORIAL DIVIDER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-16 border-y border-[color:var(--color-neutral-700)]">
        <div className="grid grid-cols-12 gap-6 items-end">
          <Reveal variant="up" className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              Edition
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              001 · Drafting
            </div>
          </Reveal>
          <Reveal variant="up" delay={80} className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              Cadence
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              Quarterly
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={160}
            className="col-span-12 md:col-span-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              Filed from
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              Shah Alam, Selangor
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────── COMING SOON ────── */}
      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-32 text-center">
        <Reveal variant="up">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
            First issue lands soon.
          </h2>
          <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl mx-auto">
            We&apos;d rather wait until we have news worth telling. In the
            meantime — talk to the engineers who&apos;ll be in the first issue.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>Talk to us →</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={`/${locale}/2026`}>See the 2026 review →</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
