'use client';

import { useTranslations } from 'next-intl';
import { NumberCounter } from '@/components/motion/number-counter';

type Stats = {
  machines: number;
  labels: number;
  uptime: string;
  factories: number;
};

export function LiveDataTicker({ stats }: { stats: Stats }) {
  const t = useTranslations('home.ticker');

  return (
    <section className="border-y border-[color:var(--color-steel)]/20 bg-[color:var(--color-ink-soft)]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <Stat label={t('machines')} value={<NumberCounter value={stats.machines} />} />
        <Stat label={t('labels')} value={<NumberCounter value={stats.labels} format={(n) => (n / 1_000_000).toFixed(1) + 'M'} />} />
        <Stat label={t('uptime')} value={<span className="split-flap">{stats.uptime}</span>} />
        <Stat label={t('factories')} value={<NumberCounter value={stats.factories} format={(n) => Math.round(n).toString() + '+'} />} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]">{label}</span>
      <span className="font-mono text-2xl md:text-3xl text-[color:var(--color-paper)]">{value}</span>
    </div>
  );
}
