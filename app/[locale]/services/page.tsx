import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { whatsappLink } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Services — Auraplex',
    description:
      'Installation, maintenance, training and custom automation — delivered by Auraplex engineers from Shah Alam.',
    path: `/${locale}/services`,
  });
}

/**
 * Services landing page.
 *
 * Surfaces the four service disciplines Auraplex sells alongside machines.
 * Content here is generic-but-honest — no fabricated SLAs, response-time
 * promises or pricing. When the sales team provides specifics, fill the
 * `details` array per service. The structure is ready.
 */
const SERVICES = [
  {
    num: '01',
    name: 'Installation & Commissioning',
    summary:
      'On-site setup, line integration and runtime tuning. Performed by the engineers who built the machine.',
    deliverables: [
      'Site survey + power/air requirements check',
      'Mechanical install on your line',
      'PLC + HMI configuration',
      'Operator hand-off & runtime acceptance',
    ],
  },
  {
    num: '02',
    name: 'Maintenance & Repair',
    summary:
      'Local parts pipeline + service engineers across Peninsular Malaysia, Sabah, and Sarawak.',
    deliverables: [
      'Preventive maintenance contracts',
      'Spare parts pipeline (warehouse in Selangor)',
      'Break-fix service calls',
      'Overhaul service for third-party labellers',
    ],
  },
  {
    num: '03',
    name: 'Training',
    summary:
      'Operator + line-supervisor training on your floor or at our facility in Shah Alam.',
    deliverables: [
      'Operator handover training (included with installation)',
      'Refresher training for new staff',
      'Supervisor-level diagnostics & recipe management',
      'Documentation in EN / BM / Mandarin on request',
    ],
  },
  {
    num: '04',
    name: 'Custom Automation',
    summary:
      'Bespoke rigs engineered for non-standard containers, throughputs, or line topologies.',
    deliverables: [
      'Discovery + concept design',
      'Mechanical, electrical, controls integration',
      'Optional vision/inspection systems',
      'Documentation & spare-parts kit on handover',
    ],
  },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: `https://auraplex.my/${locale}` },
              { name: 'Services', url: `https://auraplex.my/${locale}/services` },
            ]),
          ),
        }}
      />

      {/* ────── HERO ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            Services
          </div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            We don&apos;t ship machines.
            <br />
            <span className="text-[color:var(--color-signal)]">
              We ship working lines.
            </span>
          </h1>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            Every Auraplex install includes commissioning, operator handover,
            and a local service engineer on call. Four disciplines, all under
            one roof in Shah Alam.
          </p>
        </Reveal>
      </section>

      {/* ────── SERVICES GRID ────── */}
      <section className="border-y border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.num}
              variant="up"
              delay={i * 100}
              className={`p-10 lg:p-16 border-[color:var(--color-neutral-700)] ${
                i % 2 === 0 ? 'lg:border-r' : ''
              } ${i < 2 ? 'border-b' : 'lg:border-b-0 border-b'}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                — {s.num}
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] leading-[1.05] mb-6">
                {s.name}
              </h2>
              <p className="prose-editorial text-[color:var(--color-steel-soft)] mb-10">
                {s.summary}
              </p>
              <ul className="space-y-3">
                {s.deliverables.map((d, j) => (
                  <li
                    key={j}
                    className="flex items-baseline gap-3 font-mono text-sm text-[color:var(--color-paper)]"
                  >
                    <span className="text-[color:var(--color-signal)] text-xs">
                      ◆
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <Reveal variant="up">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
                Already running an Auraplex machine?
                <br />
                <span className="text-[color:var(--color-neutral-400)]">
                  Or a competitor&apos;s?
                </span>
              </h2>
              <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-xl">
                We service third-party labellers too. Send us the model and
                photographs of the issue — we&apos;ll quote within one business
                day.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 flex flex-wrap gap-3">
              <Magnetic strength={0.35}>
                <Button asChild size="lg">
                  <Link href="/contact">Talk to service →</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="ghost" size="lg">
                  <a
                    href={whatsappLink(
                      'Hi — I need service on a machine. Can I send photos?',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp →
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
