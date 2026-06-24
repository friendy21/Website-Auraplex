'use client';

import { useTranslations } from 'next-intl';
import { FlipDigits } from '@/components/motion/flip-digits';

type Props = {
  /** Machines in the committed catalogue. */
  machines: number;
  /** Engineering families (labelling / packaging / automation). */
  families: number;
  /** Year Auraplex started. */
  since: number;
  /** Short recognition label (e.g. "MIMF '24"). */
  recognition: string;
};

/**
 * "By the numbers" band — honest, static facts (no fabricated live telemetry).
 * Previously this simulated a per-second "labels applied today" counter and a
 * flickering uptime to look like a live feed; those were invented. Now every
 * value is verifiable: catalogue size, engineering families, founding year,
 * and the real MIMF innovation recognition. Digits keep the flip-in flourish.
 */
export function LiveDataTicker({ machines, families, since, recognition }: Props) {
  const t = useTranslations('home.ticker');

  return (
    <section className="relative border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent" />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-neutral-700)]">
        <Cell label={t('machines')} value={<FlipDigits value={machines.toLocaleString()} />} />
        <Cell label={t('families')} value={<FlipDigits value={String(families)} />} />
        <Cell label={t('since')} value={<FlipDigits value={String(since)} />} />
        <Cell label={t('recognition')} value={recognition} />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent" />
    </section>
  );
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[color:var(--color-neutral-800)] flex flex-col gap-2 p-4 lg:p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel-soft)]">
        {label}
      </span>
      <span className="font-mono text-2xl md:text-3xl text-[color:var(--color-paper)]">
        {value}
      </span>
    </div>
  );
}
