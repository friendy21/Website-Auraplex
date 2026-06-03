'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FlipDigits } from '@/components/motion/flip-digits';

type Stats = {
  machines: number;
  labels: number;
  uptime: string;
  factories: number;
};

/**
 * Live ticker — values render with per-digit flip animation. The "labels
 * applied today" counter increments in real time (+1 every 3.2s) to simulate
 * the floor still running while the user reads. Uptime micro-flickers
 * between two adjacent values to feel mechanical, not mocked.
 *
 * Intervals are cleaned up on unmount + paused if the tab is hidden
 * (visibilitychange), so this never burns cycles in a background tab.
 */
export function LiveDataTicker({ stats }: { stats: Stats }) {
  const t = useTranslations('home.ticker');
  const [labels, setLabels] = useState(stats.labels);
  const [uptime, setUptime] = useState(stats.uptime);

  useEffect(() => {
    let labelsTimer: ReturnType<typeof setInterval> | null = null;
    let uptimeTimer: ReturnType<typeof setTimeout> | null = null;

    const startLabels = () => {
      labelsTimer = setInterval(() => {
        setLabels((n) => n + 1);
      }, 3200);
    };

    const flickerUptime = () => {
      // Toggle between 99.3% and 99.4% on a random interval (8–15s).
      const next = Math.random() < 0.5 ? '99.3%' : '99.4%';
      setUptime(next);
      uptimeTimer = setTimeout(flickerUptime, 8000 + Math.random() * 7000);
    };

    const start = () => {
      startLabels();
      flickerUptime();
    };
    const stop = () => {
      if (labelsTimer) clearInterval(labelsTimer);
      if (uptimeTimer) clearTimeout(uptimeTimer);
      labelsTimer = null;
      uptimeTimer = null;
    };

    function onVis() {
      if (document.hidden) stop();
      else start();
    }

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, []);

  const labelsDisplay =
    labels >= 1_000_000
      ? `${(labels / 1_000_000).toFixed(1)}M`
      : labels.toLocaleString();

  return (
    <section className="relative border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] overflow-hidden">
      {/* Signal gradient hairline top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent" />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-neutral-700)]">
        <Cell
          label={t('machines')}
          value={<FlipDigits value={stats.machines.toLocaleString()} />}
        />
        <Cell
          label={t('labels')}
          value={<FlipDigits value={labelsDisplay} />}
          live
        />
        <Cell
          label={t('uptime')}
          value={<FlipDigits value={uptime} />}
          live
        />
        <Cell
          label={t('factories')}
          value={<FlipDigits value={`${stats.factories}+`} />}
        />
      </div>

      {/* Signal gradient hairline bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent" />
    </section>
  );
}

function Cell({
  label,
  value,
  live,
}: {
  label: string;
  value: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className="bg-[color:var(--color-neutral-800)] flex flex-col gap-2 p-4 lg:p-6">
      <div className="flex items-center gap-2">
        {live && (
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-[color:var(--color-signal)] animate-ping opacity-60" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]" />
          </span>
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          {label}
        </span>
      </div>
      <span className="font-mono text-2xl md:text-3xl text-[color:var(--color-paper)]">
        {value}
      </span>
    </div>
  );
}
