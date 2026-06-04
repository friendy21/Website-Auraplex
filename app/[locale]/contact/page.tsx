import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';
import { whatsappLink } from '@/lib/utils';

// Contact details mirror the live auraplex.com.my:
//   Sales hotline: 1700-82-6502
//   Email:         sales.auraplex@gmail.com
//   WhatsApp:      via wa.me link (number lives in lib/utils.ts)

const DEPARTMENT_KEYS = ['sales', 'service', 'tour', 'engineering'] as const;
type DepartmentKey = (typeof DEPARTMENT_KEYS)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Contact — Auraplex',
    description:
      'Talk to an Auraplex engineer. Quotes, factory tours, service requests, technical questions. Shah Alam, Selangor.',
    path: `/${locale}/contact`,
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ dept?: string }>;
}) {
  const { locale } = await params;
  const { dept } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('pages.contact');

  // Normalize ?dept= input against the allowlist — never trust the client.
  const department =
    dept && (DEPARTMENT_KEYS as readonly string[]).includes(dept)
      ? (dept as DepartmentKey)
      : undefined;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Auraplex SDN BHD',
    description:
      'Precision labelling and packaging machine manufacturer in Shah Alam, Selangor.',
    url: 'https://auraplex.my',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shah Alam',
      addressRegion: 'Selangor',
      addressCountry: 'MY',
    },
    areaServed: [
      { '@type': 'Country', name: 'Malaysia' },
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Country', name: 'Indonesia' },
      { '@type': 'Country', name: 'Vietnam' },
      { '@type': 'Country', name: 'Thailand' },
      { '@type': 'Country', name: 'Philippines' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-32 grid grid-cols-12 gap-12">
        <div className="col-span-12 md:col-span-5">
          <Reveal variant="up">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — {t('eyebrow')}
            </div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
              {t('h1')}
            </h1>
            <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)]">
              {t('subtitle')}
            </p>
          </Reveal>

          <div className="mt-12 space-y-8 font-mono text-sm">
            <Contact
              label={t('labels.sales')}
              value="1700-82-6502"
              href="tel:+60317008265026"
            />
            <Contact
              label={t('labels.email')}
              value="sales.auraplex@gmail.com"
              href="mailto:sales.auraplex@gmail.com"
            />
            <Contact
              label={t('labels.whatsappLabel')}
              value={t('labels.whatsappValue')}
              href={whatsappLink('Hi Auraplex.')}
            />
          </div>

          <div className="mt-12 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] space-y-1">
            <div>{t('hours.weekdays')}</div>
            <div>{t('hours.saturday')}</div>
          </div>

          <div className="mt-12 pt-8 border-t border-[color:var(--color-neutral-700)] font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] leading-relaxed">
            <span className="text-[color:var(--color-signal)]">
              {t('response.lead')}
            </span>{' '}
            {t('response.body')}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          {department && (
            <Reveal variant="fade">
              <div className="mb-6 border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/5 px-5 py-4 flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)] rounded-full animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
                  {t('routing', { team: t(`departments.${department}`) })}
                </span>
              </div>
            </Reveal>
          )}
          <ContactForm locale={locale} department={department} />
        </div>
      </section>
    </>
  );
}

function Contact({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-steel)] mb-1">
        {label}
      </div>
      <a
        href={href}
        className="text-[color:var(--color-paper)] hover:text-[color:var(--color-signal)] transition"
      >
        {value}
      </a>
    </div>
  );
}
