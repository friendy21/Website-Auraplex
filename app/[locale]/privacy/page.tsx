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
    title: 'Privacy Policy — Auraplex',
    description:
      'How Auraplex SDN BHD collects, uses and protects your personal data under Malaysia’s Personal Data Protection Act 2010 (PDPA).',
    path: `/${locale}/privacy`,
  });
}

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
          Privacy Policy
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95] mb-6">
          Privacy policy.
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
            We collect only what you send us through our forms (so we can reply
            to your enquiry) plus basic technical logs needed to run the site.
            We don&apos;t sell your data, we don&apos;t use advertising
            cookies, and you can ask us to show, correct or delete what we hold
            at any time. This policy explains the details, in line with
            Malaysia&apos;s Personal Data Protection Act 2010 (PDPA).
          </p>
        </div>
      </Reveal>

      <Reveal variant="up" delay={150} className="space-y-10">
        <Section title="1. Who we are">
          <p>
            This site, <strong>auraplex.my</strong>, is operated by{' '}
            <strong>Auraplex SDN BHD</strong> (&ldquo;Auraplex&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company registered in
            Malaysia, at No. 5, Jalan BS9/7B, Taman Bukit Serdang, Seksyen 9,
            43300 Seri Kembangan, Selangor. For data-protection matters we are
            the data controller responsible for your personal data, and you can
            reach us at{' '}
            <MailLink to="privacy@auraplex.my" />.
          </p>
        </Section>

        <Section title="2. The personal data we collect">
          <p>We collect personal data in the following ways:</p>
          <ul className="space-y-2 list-disc pl-5 mt-3">
            <li>
              <strong>Enquiry &amp; quote forms</strong> — your name, company,
              email, phone number and the message or configuration you submit
              when requesting a quote, contacting us, or downloading a spec
              sheet.
            </li>
            <li>
              <strong>Machine Finder</strong> — the messages you type into our
              AI assistant and the recommendation it returns, so we can follow
              up with the right machine.
            </li>
            <li>
              <strong>Internship applications</strong> — your name, contact
              details, university, field, availability and any CV or portfolio
              link you choose to share.
            </li>
            <li>
              <strong>Technical data</strong> — standard server logs and
              anonymous error reports (e.g. IP address, browser type, pages
              requested) generated automatically so we can keep the site
              secure and working.
            </li>
            <li>
              <strong>Analytics</strong> — where enabled, aggregate, privacy-
              respecting usage statistics (page views, referrers, broad
              region) that do not use cross-site tracking cookies or
              advertising identifiers.
            </li>
          </ul>
          <p className="mt-3">
            We do not collect bank or payment-card details on this site — we
            don&apos;t take payment online.
          </p>
        </Section>

        <Section title="3. How and why we use it">
          <p>We use your personal data to:</p>
          <ul className="space-y-2 list-disc pl-5 mt-3">
            <li>respond to your enquiry and prepare quotes or spec sheets;</li>
            <li>
              arrange consultations, demonstrations, installation and after-
              sales service;
            </li>
            <li>assess internship applications;</li>
            <li>
              operate, secure, debug and improve the website and our service;
              and
            </li>
            <li>
              comply with our legal and regulatory obligations in Malaysia.
            </li>
          </ul>
          <p className="mt-3">
            We process your data on the basis of your consent (which you give
            by submitting a form), to take steps at your request before
            entering a contract, and for our legitimate business interests in
            running and improving Auraplex.
          </p>
        </Section>

        <Section title="4. Who we share it with">
          <p>
            We do not sell or rent your personal data. We share it only with
            trusted service providers who process it on our behalf, under
            confidentiality obligations, including:
          </p>
          <ul className="space-y-2 list-disc pl-5 mt-3">
            <li>
              <strong>Hosting &amp; storage</strong> — our website host and
              database provider, where form submissions are stored.
            </li>
            <li>
              <strong>Email delivery</strong> — the provider that delivers our
              acknowledgement and notification emails.
            </li>
            <li>
              <strong>AI assistant</strong> — the messages you send to the
              Machine Finder are processed by a third-party AI provider purely
              to generate a response; they are not used to advertise to you.
            </li>
          </ul>
          <p className="mt-3">
            We may also disclose data where required by law, regulation or a
            valid legal request.
          </p>
        </Section>

        <Section title="5. International transfers">
          <p>
            Some of our service providers operate servers outside Malaysia.
            Where your data is transferred abroad, we take reasonable steps to
            ensure it remains protected to a standard consistent with the
            PDPA.
          </p>
        </Section>

        <Section title="6. How long we keep it">
          <p>
            We keep enquiry and application data only for as long as needed to
            handle your request and for a reasonable period afterwards for
            follow-up, record-keeping and legal compliance, after which it is
            deleted or anonymised. You can ask us to delete it sooner (see your
            rights below).
          </p>
        </Section>

        <Section title="7. How we protect it">
          <p>
            We apply reasonable technical and organisational safeguards —
            including access controls and encryption in transit — to protect
            your data against loss, misuse and unauthorised access. No method
            of transmission or storage is completely secure, but we work to
            keep your data safe and to address any incident promptly.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use only the cookies and similar technologies necessary to run
            the site and remember basic preferences such as your language. We
            do not use advertising or cross-site tracking cookies. You can
            control cookies through your browser settings.
          </p>
        </Section>

        <Section title="9. Your rights under the PDPA">
          <p>Subject to the PDPA, you have the right to:</p>
          <ul className="space-y-2 list-disc pl-5 mt-3">
            <li>ask what personal data we hold about you and request a copy;</li>
            <li>ask us to correct data that is inaccurate or incomplete;</li>
            <li>withdraw your consent or ask us to delete your data;</li>
            <li>limit how we process your data; and</li>
            <li>raise a concern about how we handle your data.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these, email{' '}
            <MailLink to="privacy@auraplex.my" />. We aim to respond within 21
            days.
          </p>
        </Section>

        <Section title="10. Children">
          <p>
            This site is intended for businesses and adult professionals. We do
            not knowingly collect personal data from children. If you believe a
            child has provided us data, contact us and we will delete it.
          </p>
        </Section>

        <Section title="11. Changes to this policy">
          <p>
            We may update this policy from time to time. The current version,
            with its &ldquo;last updated&rdquo; date, will always be available
            on this page. Material changes will be highlighted here.
          </p>
        </Section>

        <Section title="12. Contact us">
          <p>
            Questions about this policy or your data? Email{' '}
            <MailLink to="privacy@auraplex.my" /> or call our hotline at{' '}
            <strong>1700-82-6502</strong>. You may also write to us at the
            address in section 1.
          </p>
        </Section>
      </Reveal>

      <Reveal variant="up" delay={300}>
        <div className="mt-16 flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>Contact us</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/${locale}/terms`}>Terms of use →</Link>
          </Button>
        </div>
      </Reveal>
    </article>
  );
}

function MailLink({ to }: { to: string }) {
  return (
    <a
      href={`mailto:${to}`}
      className="text-[color:var(--color-signal)] underline underline-offset-4 decoration-1 hover:text-[color:var(--color-signal-bright)]"
    >
      {to}
    </a>
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
