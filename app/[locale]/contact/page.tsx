import { setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';
import { whatsappLink } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Contact — Auraplex',
    description: 'Talk to an Auraplex engineer. Quotes, factory tours, technical questions.',
    path: `/${locale}/contact`,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-32 grid grid-cols-12 gap-12">
      <div className="col-span-12 md:col-span-5">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — Get in touch
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
            Talk to an engineer.
          </h1>
          <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)]">
            We respond within one business day. For urgent matters, WhatsApp is fastest.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8 font-mono text-sm">
          <Contact label="WhatsApp" value="+60 12-345-6789" href={whatsappLink('Hi Auraplex.')} />
          <Contact label="Email" value="hello@auraplex.my" href="mailto:hello@auraplex.my" />
          <Contact label="Phone · KL" value="+60-3-0000-0000" href="tel:+60300000000" />
          <Contact label="Phone · JB" value="+60-7-0000-0000" href="tel:+60700000000" />
          <Contact label="Phone · Penang" value="+60-4-0000-0000" href="tel:+60400000000" />
        </div>

        <div className="mt-12 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] space-y-1">
          <div>Mon–Fri · 09:00–18:00 MYT</div>
          <div>Sat · 09:00–13:00 MYT</div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}

function Contact({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-steel)] mb-1">{label}</div>
      <a href={href} className="text-[color:var(--color-paper)] hover:text-[color:var(--color-signal)] transition">
        {value}
      </a>
    </div>
  );
}
