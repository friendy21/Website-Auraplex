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
    title: 'Terms of Service — Auraplex',
    description:
      'Auraplex SDN BHD terms of service — currently being drafted by counsel.',
    path: `/${locale}/terms`,
  });
}

/**
 * Terms of service placeholder. Same posture as /privacy — we will not
 * generate boilerplate. A real terms document needs counsel review.
 */
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-12 pt-40 pb-32">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[color:var(--color-signal)]" />
          Terms · In legal review
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95] mb-12">
          Terms of service.
        </h1>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <div className="border border-[color:var(--color-signal)]/40 bg-[color:var(--color-signal)]/5 p-8 mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
            Notice
          </div>
          <p className="prose-editorial text-[color:var(--color-paper)]">
            Formal terms of service for use of auraplex.my and for the sale,
            installation and servicing of Auraplex machines are being drafted
            by counsel. Until they land here, machine purchases are governed
            by the individual sales contract signed with Auraplex SDN BHD.
          </p>
        </div>
      </Reveal>

      <Reveal variant="up" delay={150} className="space-y-10">
        <Section title="Use of this site">
          <p>
            By using auraplex.my you agree to use it for lawful purposes only.
            Don&apos;t attempt to disrupt the service, scrape it at volume, or
            misrepresent yourself in forms. Standard internet etiquette.
          </p>
        </Section>

        <Section title="Machine sales">
          <p>
            All machine quotes, purchases, leases and service contracts are
            governed by the written contract signed between the customer and
            Auraplex SDN BHD. Nothing on this website constitutes a binding
            offer of sale until that contract is executed.
          </p>
        </Section>

        <Section title="Warranty">
          <p>
            Machine warranty terms are set out in each individual sales
            contract. Reach out for the warranty terms specific to the machine
            you&apos;re considering.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email{' '}
            <a
              href="mailto:legal@auraplex.my"
              className="text-[color:var(--color-signal)] underline underline-offset-4 decoration-1 hover:text-[color:var(--color-signal-bright)]"
            >
              legal@auraplex.my
            </a>{' '}
            for anything not covered here.
          </p>
        </Section>

        <Section title="Last updated">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-steel)]">
            Holding statement · awaiting formal terms
          </p>
        </Section>
      </Reveal>

      <Reveal variant="up" delay={300}>
        <div className="mt-16 flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>Contact us</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/${locale}/privacy`}>Privacy policy →</Link>
          </Button>
        </div>
      </Reveal>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl tracking-[-0.01em] mb-4">
        {title}
      </h2>
      <div className="prose-editorial text-[color:var(--color-steel-soft)]">
        {children}
      </div>
    </section>
  );
}
