'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { formatRM } from '@/lib/utils';
import { FlipDigits } from '@/components/motion/flip-digits';

/**
 * ROI calculator — three sliders, three outputs.
 *
 * Sliders are custom: native <input type="range"> styled into invisible hit
 * targets, with a Motion-driven cerulean handle + filled track rendered on
 * top. Handle scales 1 → 1.25 on grab. Outputs render with FlipDigits so
 * each value change cascades through the digits.
 *
 * The calculation matches the previous version — no business-logic change,
 * just presentation polish.
 */
export function RoiCalculator() {
  const t = useTranslations('financing.calculator');
  const [currentSpeed, setCurrentSpeed] = useState(60);
  const [labourCost, setLabourCost] = useState(15);
  const [targetSpeed, setTargetSpeed] = useState(120);

  const result = useMemo(() => {
    const speedDelta = Math.max(0, targetSpeed - currentSpeed);
    const labourSavingsPerHour = (speedDelta / currentSpeed) * labourCost * 2;
    const annualHours = 8 * 22 * 12;
    const annualSavings = Math.round(labourSavingsPerHour * annualHours);
    const machineCostMonthly = 1800;
    const annualCost = machineCostMonthly * 12;
    const netAnnual = annualSavings - annualCost;
    const paybackMonths =
      netAnnual > 0 ? Math.ceil((annualCost / annualSavings) * 12) : 60;
    const fiveYearRoi =
      netAnnual > 0
        ? Math.round(((netAnnual * 5) / (annualCost * 5)) * 100)
        : 0;
    return { annualSavings, paybackMonths, fiveYearRoi, netAnnual };
  }, [currentSpeed, labourCost, targetSpeed]);

  const goodPayback = result.paybackMonths < 18;
  const strongRoi = result.fiveYearRoi > 150;

  return (
    <section className="relative bg-[color:var(--color-neutral-800)] border border-[color:var(--color-neutral-700)] overflow-hidden">
      {/* Top signal accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/70 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12">
        {/* ── INPUTS ── */}
        <div className="space-y-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">
              — ROI calculator
            </div>
            <h3 className="font-display text-3xl md:text-4xl tracking-[-0.01em]">
              Run the numbers.
            </h3>
          </div>

          <Slider
            label={t('speed')}
            value={currentSpeed}
            min={20}
            max={200}
            onChange={setCurrentSpeed}
            suffix="/min"
          />
          <Slider
            label={t('labour')}
            value={labourCost}
            min={8}
            max={40}
            onChange={setLabourCost}
            prefix="RM "
            suffix="/hr"
          />
          <Slider
            label={t('target')}
            value={targetSpeed}
            min={60}
            max={240}
            onChange={setTargetSpeed}
            suffix="/min"
          />
        </div>

        {/* ── OUTPUTS ── */}
        <div className="md:border-l md:border-[color:var(--color-neutral-700)] md:pl-12 space-y-8">
          <Output
            label={t('payback')}
            value={`${result.paybackMonths}`}
            suffix=" mo"
            highlight={goodPayback}
          />
          <Output
            label={t('savings')}
            value={formatRM(result.annualSavings)}
            highlight={result.annualSavings > 0}
          />
          <Output
            label={t('roi')}
            value={`${result.fiveYearRoi}`}
            suffix="%"
            highlight={strongRoi}
          />
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Slider — native range overlaid by a Motion-driven track + handle
// ────────────────────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  prefix = '',
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const [grabbing, setGrabbing] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-baseline font-mono text-xs uppercase tracking-[0.2em] mb-3">
        <span className="text-[color:var(--color-steel)]">{label}</span>
        <span className="text-[color:var(--color-paper)] font-mono tabular-nums">
          {prefix}
          <FlipDigits value={value} flipMs={220} staggerMs={20} />
          {suffix}
        </span>
      </div>

      <div className="relative h-2">
        {/* Track (rail) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[color:var(--color-neutral-700)]" />

        {/* Filled track — width follows value */}
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-[color:var(--color-signal-deep)] to-[color:var(--color-signal)]"
        />

        {/* Visual handle */}
        <motion.div
          animate={{
            left: `${pct}%`,
            scale: grabbing ? 1.25 : 1,
            boxShadow: grabbing
              ? '0 0 0 6px color-mix(in oklab, var(--color-signal) 25%, transparent)'
              : '0 0 0 0px color-mix(in oklab, var(--color-signal) 0%, transparent)',
          }}
          transition={{
            left: { type: 'spring', stiffness: 320, damping: 30 },
            scale: { duration: 0.15 },
          }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[color:var(--color-signal)] border-2 border-[color:var(--color-ink)] pointer-events-none"
        />

        {/* Invisible native range — handles input, screen-reader announces */}
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => setGrabbing(true)}
          onPointerUp={() => setGrabbing(false)}
          onPointerCancel={() => setGrabbing(false)}
          onBlur={() => setGrabbing(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
}

function Output({
  label,
  value,
  suffix = '',
  highlight = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3 flex items-center gap-2">
        {highlight && (
          <span className="inline-block h-1.5 w-1.5 bg-[color:var(--color-signal)] animate-pulse rounded-full" />
        )}
        {label}
      </div>
      <div
        className={`font-display text-5xl md:text-6xl tracking-[-0.02em] ${
          highlight
            ? 'text-[color:var(--color-signal)]'
            : 'text-[color:var(--color-paper)]'
        }`}
      >
        <FlipDigits value={value} flipMs={280} staggerMs={25} />
        {suffix && (
          <span className="text-2xl ml-1 text-[color:var(--color-steel)]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
