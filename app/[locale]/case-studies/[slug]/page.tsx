import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';

// Until Sanity is connected with real case study content, the case-studies
// listing renders a "first issue in production" landing page. Any deep-linked
// /case-studies/<slug> requests redirect to that landing page so users never
// hit a dead end.

export async function generateStaticParams() {
  // cacheComponents requires at least one slug for static analysis.
  return [{ slug: '__placeholder__' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Field report coming soon — Auraplex',
    description: 'This case study is still in production.',
    path: `/${locale}/case-studies`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (slug === '__placeholder__') {
    redirect(`/${locale}/case-studies`);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 lg:px-12 pt-40 pb-32 text-center">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — Field report · In production
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95]">
          This report is still
          <br />
          being photographed.
        </h1>
        <p className="mt-10 prose-editorial text-[color:var(--color-steel-soft)] text-lg max-w-xl mx-auto">
          Auraplex field reports are produced quarterly, on-site, with real
          throughput numbers. The first issue is in editorial. Sign up to get it
          when it lands — or skip the wait and talk to the team directly.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/case-studies`}>Back to field reports</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href={`/${locale}/contact`}>Talk to an engineer →</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
