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
    title: 'Privacy Policy — Auraplex',
    description:
      'Auraplex SDN BHD privacy practices — currently under legal review for PDPA compliance.',
    path: `/${locale}/privacy`,
  });
}

/**
 * Privacy placeholder.
 *
 * We will NOT generate boilerplate legal text — privacy policies must be
 * drafted by qualified counsel to be enforceable and PDPA-compliant. This
 * page exists as a route + an honest holding statement that explains what
 * data the site currently collects in plain language, plus a contact path
 * for users who want their data removed in the interim.
 */
export default async function PrivacyPage({
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
          Privacy · In legal review
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95] mb-12">
          Privacy policy.
        </h1>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <div className="border border-[color:var(--color-signal)]/40 bg-[color:var(--color-signal)]/5 p-8 mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
            Notice
          </div>
          <p className="prose-editorial text-[color:var(--color-paper)]">
            The formal privacy policy is being drafted by counsel for
            compliance with Malaysia&apos;s Personal Data Protection Act (PDPA
            2010). Until that document lands here, the plain-language summary
            below describes what auraplex.my collects today.
          </p>
        </div>
      </Reveal>

      <Reveal variant="up" delay={150} className="space-y-10">
        <Section title="What this site collects today">
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Form submissions</strong> — Quote requests, contact
              messages, spec-sheet downloads and machine-finder transcripts.
              Stored in a database we control. Used to reply to your enquiry
              and not shared with third parties.
            </li>
            <li>
              <strong>Aggregate analytics</strong> — Page views, referrers and
              broad geography via a privacy-respecting analytics provider. No
              cross-site cookies, no advertising identifiers.
            </li>
            <li>
              <strong>Error telemetry</strong> — Anonymous error reports if
              something on the site breaks for you, so we can fix it.
            </li>
          </ul>
        </Section>

        <Section title="What it does not collect">
          <ul className="space-y-2 list-disc pl-5">
            <li>Marketing cookies or tracking pixels</li>
            <li>Advertising identifiers</li>
            <li>Cross-site behaviour</li>
            <li>Bank or payment details (we don&apos;t take payment online)</li>
          </ul>
        </Section>

        <Section title="Your rights under PDPA">
          <p>
            You may ask us at any time what personal data we hold about you,
            request a correction, or ask us to delete it. We aim to respond
            within 14 working days. Email{' '}
            <a
              href="mailto:privacy@auraplex.my"
              className="text-[color:var(--color-signal)] underline underline-offset-4 decoration-1 hover:text-[color:var(--color-signal-bright)]"
            >
              privacy@auraplex.my
            </a>
            .
          </p>
        </Section>

        <Section title="Last updated">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--color-steel)]">
            Holding statement · awaiting formal policy
          </p>
        </Section>
      </Reveal>

      <Reveal variant="up" delay={300}>
        <div className="mt-16 flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>Contact us</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/${locale}/terms`}>Terms of service →</Link>
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
