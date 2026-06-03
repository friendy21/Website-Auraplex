import { setRequestLocale } from 'next-intl/server';
import { MachineFinderChat } from '@/components/forms/machine-finder-chat';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Machine Finder — Auraplex',
    description: 'AI-powered recommendation. Describe your line, get the right machine and financing tier.',
    path: `/${locale}/machine-finder`,
  });
}

export default async function MachineFinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-4xl px-6 lg:px-12 pt-40 pb-32">
      <Reveal variant="up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — AI Engineer / 24h human review
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
          Describe your line. We'll match the machine.
        </h1>
        <p className="mt-8 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)]">
          Talk to our AI application engineer. Trained on the Auraplex catalogue, financing tiers, and 340+ deployed installations.
          Every recommendation is reviewed by a human engineer within 24 hours.
        </p>
      </Reveal>

      <div className="mt-12">
        <MachineFinderChat />
      </div>
    </section>
  );
}
