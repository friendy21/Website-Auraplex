import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { buildMetadata } from '@/lib/seo';

const LAST_UPDATED = '23 June 2026';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Terms of Use — Auraplex',
    description:
      'The terms governing your use of auraplex.my and the information it provides about Auraplex SDN BHD machines and services.',
    path: `/${locale}/terms`,
  });
}

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
          Terms of Use
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95] mb-6">
          Terms of use.
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] mb-12">
          Last updated · {LAST_UPDATED}
        </p>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <div className="border border-[color:var(--color-signal)]/40 bg-[color:var(--color-signal)]/5 p-8 mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
            In short
          </div>
          <p className="prose-editorial text-[color:var(--color-paper)]">
            This website gives you information about Auraplex machines and
            lets you get in touch. Everything here — prices, specs, the AI
            recommendation — is indicative guidance, not a binding offer. Any
            purchase, lease or service is governed by the written contract you
            sign with Auraplex SDN BHD. Please use the site lawfully and
            honestly.
          </p>
        </div>
      </Reveal>

      <Reveal variant="up" delay={150} className="space-y-10">
        <Section title="1. About these terms">
          <p>
            These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and
            use of <strong>auraplex.my</strong> (the &ldquo;Site&rdquo;),
            operated by <strong>Auraplex SDN BHD</strong>
            (&ldquo;Auraplex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
            using the Site you agree to these Terms. If you don&apos;t agree,
            please don&apos;t use the Site.
          </p>
        </Section>

        <Section title="2. Using the Site">
          <p>You agree to:</p>
          <ul className="space-y-2 list-disc pl-5 mt-3">
            <li>use the Site for lawful purposes only;</li>
            <li>
              provide accurate information when you submit a form or contact
              us;
            </li>
            <li>
              not attempt to disrupt, overload, hack or gain unauthorised
              access to the Site; and
            </li>
            <li>
              not scrape, copy or republish the Site&apos;s content at scale or
              for commercial use without our permission.
            </li>
          </ul>
        </Section>

        <Section title="3. Information is indicative, not an offer">
          <p>
            Machine descriptions, specifications, images, throughput figures
            and any prices shown on the Site are provided for general guidance
            and may change without notice. They do not constitute a binding
            offer or a warranty. Nothing on the Site forms a contract of sale.
          </p>
        </Section>

        <Section title="4. The Machine Finder">
          <p>
            Our AI-assisted Machine Finder offers suggestions to help you
            shortlist a machine. Its recommendations are generated
            automatically and may be incomplete or inaccurate. They are not
            professional engineering advice — always confirm suitability with
            our team before making a decision.
          </p>
        </Section>

        <Section title="5. Quotes, sales, leases and service">
          <p>
            All quotes, purchases, leases, rentals, installation and service
            arrangements are governed by the separate written contract signed
            between you and Auraplex SDN BHD. In the event of any conflict,
            that signed contract — not the Site — prevails. A quote requested
            through the Site is an invitation to discuss, not a fixed price.
          </p>
        </Section>

        <Section title="6. Warranty">
          <p>
            Warranty cover for each machine is set out in its individual sales
            contract. Contact us for the warranty terms specific to the machine
            you&apos;re considering.
          </p>
        </Section>

        <Section title="7. Intellectual property">
          <p>
            The Site and its content — text, design, logos, graphics and the
            &ldquo;Auraplex&rdquo; name and marks — are owned by or licensed to
            Auraplex SDN BHD and are protected by law. You may view and share
            links to the Site, but you may not reproduce, modify or
            commercially exploit its content without our prior written consent.
          </p>
        </Section>

        <Section title="8. Third-party links">
          <p>
            The Site may link to third-party websites or services (for example
            social media or messaging apps). We don&apos;t control and
            aren&apos;t responsible for their content or practices; using them
            is at your own risk and subject to their own terms.
          </p>
        </Section>

        <Section title="9. Disclaimer and limitation of liability">
          <p>
            The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis. To the fullest extent permitted by law, we
            disclaim all warranties not expressly stated here and are not
            liable for any indirect or consequential loss arising from your use
            of, or inability to use, the Site or reliance on its content.
            Nothing in these Terms limits any liability that cannot be limited
            under Malaysian law.
          </p>
        </Section>

        <Section title="10. Privacy">
          <p>
            Our handling of your personal data is described in our{' '}
            <Link
              href={`/${locale}/privacy`}
              className="text-[color:var(--color-signal)] underline underline-offset-4 decoration-1 hover:text-[color:var(--color-signal-bright)]"
            >
              Privacy Policy
            </Link>
            , which forms part of these Terms.
          </p>
        </Section>

        <Section title="11. Governing law">
          <p>
            These Terms are governed by the laws of Malaysia, and the courts of
            Malaysia have jurisdiction over any dispute relating to the Site.
          </p>
        </Section>

        <Section title="12. Changes">
          <p>
            We may update these Terms from time to time. The current version,
            with its &ldquo;last updated&rdquo; date, will always be available
            on this page. Continued use of the Site means you accept the
            updated Terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about these Terms? Email{' '}
            <a
              href="mailto:hello@auraplex.my"
              className="text-[color:var(--color-signal)] underline underline-offset-4 decoration-1 hover:text-[color:var(--color-signal-bright)]"
            >
              hello@auraplex.my
            </a>{' '}
            or call <strong>1700-82-6502</strong>.
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
