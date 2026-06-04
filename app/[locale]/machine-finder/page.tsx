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

      <div className="mt-12">
        <MachineFinderChat />
      </div>
    </section>
  );
}
