import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MachineFinderChat } from '@/components/forms/machine-finder-chat';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Machine Finder — Auraplex',
    description:
      'AI-powered machine recommendation. Describe your line and we will match the right Auraplex machine.',
    path: `/${locale}/machine-finder`,
  });
}

export default async function MachineFinderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.machineFinder');
  const steps = t.raw('how.steps') as { n: string; title: string; body: string }[];

  return (
    <section className="mx-auto max-w-4xl px-6 lg:px-12 pt-40 pb-32">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — {t('eyebrow')}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
          {t('h1')}
        </h1>
        <p className="mt-8 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)]">
          {t('subtitle')}
        </p>
      </Reveal>

      {/* How it works — trust scaffolding pulled into the UI (was only in
          the Privacy/Terms pages): what to say, what the AI does, that a
          human reviews. */}
      <Reveal variant="up" delay={120}>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {steps.map((s) => (
            <div key={s.n} className="bg-[color:var(--color-ink)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
                {s.n}
              </div>
              <h3 className="font-display text-lg tracking-[-0.01em] mb-2">{s.title}</h3>
              <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-10">
        <MachineFinderChat />
      </div>

      {/* Indicative-guidance disclaimer — surfaced in-context per the audit. */}
      <p className="mt-6 max-w-2xl font-mono text-[11px] leading-relaxed text-[color:var(--color-steel)]">
        {t('how.note')}
      </p>
    </section>
  );
}
