import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Careers & Internships — Auraplex',
    description:
      'Engineering, controls and service roles at Auraplex Shah Alam. Internships for mechanical, electrical and software undergraduates.',
    path: `/${locale}/careers`,
  });
}

// Six engineering disciplines from the /2026 page — same source of truth.
const DISCIPLINES = [
  { role: 'Mechanical', focus: 'Frames, applicators, jigs, conveyors.' },
  { role: 'Electrical', focus: 'PLCs, sensors, motors, vision systems.' },
  { role: 'Controls', focus: 'HMI, line integration, recipe management.' },
  { role: 'Installation', focus: 'On-site commissioning across ASEAN.' },
  { role: 'Service', focus: 'Response, parts pipeline, operator training.' },
  { role: 'R&D', focus: 'Custom rigs, AR-series additive manufacturing.' },
];

const INTERNSHIPS = [
  {
    field: 'Mechanical Engineering',
    work:
      'Frame design, fixture jigs, CAD review, assembly support on the floor.',
    duration: '12 – 24 weeks',
  },
  {
    field: 'Electrical / Mechatronics',
    work:
      'PLC programming, sensor integration, panel build, electrical testing.',
    duration: '12 – 24 weeks',
  },
  {
    field: 'Software / Controls',
    work:
      'HMI development, recipe management, line-integration software, vision-system tuning.',
    duration: '12 – 24 weeks',
  },
];

export default async function CareersPage({
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
            Careers · Internships
          </div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
            Build machines
            <br />
            that ship on time.
          </h1>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-xl">
            Auraplex employs engineers, technicians, installers and service
            specialists across six disciplines in Shah Alam. We hire when the
            work demands it — small team, real ownership.
          </p>
        </Reveal>
      </section>

      {/* ────── DISCIPLINES ────── */}
      <section className="border-y border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <Reveal variant="up" className="col-span-12 md:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
                — Where you&apos;d work
              </div>
            </Reveal>
            <Reveal
              variant="up"
              delay={100}
              className="col-span-12 md:col-span-9"
            >
              <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
                Six disciplines. One floor.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
            {DISCIPLINES.map((d, i) => (
              <Reveal
                key={d.role}
                variant="up"
                delay={i * 80}
                className="bg-[color:var(--color-ink)] p-10 md:p-12"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-display text-3xl tracking-[-0.01em] mb-3">
                  {d.role}
                </h3>
                <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                  {d.focus}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────── INTERNSHIPS ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <Reveal variant="up" className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — Internships
            </div>
          </Reveal>
          <Reveal variant="up" delay={100} className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              Three programmes.
              <br />
              <span className="text-[color:var(--color-neutral-400)]">
                Real machines, real lines.
              </span>
            </h2>
            <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl">
              We host 6 – 8 undergraduate interns per year. You&apos;ll work on
              machines currently being built — not training rigs, not sandbox
              projects. Open to Malaysian universities and ASEAN exchange
              students.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INTERNSHIPS.map((p, i) => (
            <Reveal
              key={p.field}
              variant="up"
              delay={i * 100}
              className="border border-[color:var(--color-neutral-700)] p-8 lg:p-10 hover:border-[color:var(--color-signal)] transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
                {p.duration}
              </div>
              <h3 className="font-display text-2xl tracking-[-0.01em] mb-4">
                {p.field}
              </h3>
              <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                {p.work}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ────── CTA — SEND CV ────── */}
      <section className="border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32">
        <Reveal variant="up">
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1.05] max-w-3xl">
            No formal openings listed?
            <br />
            <span className="text-[color:var(--color-signal)]">
              Send us your CV anyway.
            </span>
          </h2>
          <p className="mt-8 prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl">
            We keep a rolling shortlist. When we&apos;re ready to hire, the
            shortlist is where we start. Email your CV with a short note about
            which discipline interests you most.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Button asChild size="lg">
                <a href="mailto:careers@auraplex.my?subject=CV%20%E2%80%94%20Auraplex%20careers">
                  Email careers@auraplex.my →
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="ghost" size="lg">
                <Link href={`/${locale}/about`}>About Auraplex →</Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
