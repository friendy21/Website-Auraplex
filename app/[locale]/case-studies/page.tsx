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
    title: 'Case Studies — Auraplex',
    description:
      'Editorial long-form reports from Auraplex installations across ASEAN. New stories quarterly.',
    path: `/${locale}/case-studies`,
  });
}

// Designed empty state — long-form case studies are produced on a quarterly
// cadence; rather than 404 or render a fabricated grid, we present the page as
// a "field reports" masthead with a real CTA to subscribe / talk.
export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            Field reports · Quarterly
          </div>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            The first field report
            <br />
            <span className="text-[color:var(--color-signal)]">
              is being photographed.
            </span>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            Auraplex field reports are long-form, photographed on-site, and
            published quarterly. We&apos;d rather ship one honest story than
            twelve press releases.
          </p>
        </Reveal>
      </section>

      {/* Editorial divider — masthead line */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-16 border-y border-[color:var(--color-neutral-700)]">
        <div className="grid grid-cols-12 gap-6 items-end">
          <Reveal variant="up" className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              Issue 01
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              In production
            </div>
          </Reveal>
          <Reveal
            variant="up"
            delay={80}
            className="col-span-12 md:col-span-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              Subject
            </div>
            <div className="font-display text-3xl tracking-[-0.01em]">
              Custom Top w/ Checking System
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

      {/* What to expect */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — What to expect
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              Long-form. Photographed.
              <br />
              Honest about what didn&apos;t work.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {[
            {
              n: '01',
              title: 'On the floor',
              body: 'Every report is photographed in the customer’s plant — not in our showroom.',
            },
            {
              n: '02',
              title: 'With numbers',
              body: 'Throughput before / after. Reject rate before / after. Payback in months, not narrative.',
            },
            {
              n: '03',
              title: 'And the snags',
              body: 'What the install missed, what the second iteration fixed, what we learned for the next build.',
            },
          ].map((c, i) => (
            <Reveal
              key={c.n}
              variant="up"
              delay={i * 100}
              className="bg-[color:var(--color-ink)] p-10 md:p-12"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-4">
                {c.n}
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

      {/* CTA — direct contact since there's nothing to read yet */}
      <section className="mx-auto max-w-3xl px-6 lg:px-12 py-32 text-center">
        <Reveal variant="up">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1.05]">
            Want the first issue when it lands?
          </h2>
          <p className="mt-6 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl mx-auto">
            Or skip the wait — talk to the engineers who&apos;ll be in the
            report. We&apos;ll walk you through what works on real floors.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Talk to an engineer →</Link>
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
