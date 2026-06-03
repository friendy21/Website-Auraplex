'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { formatRM } from '@/lib/utils';

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
    const paybackMonths = netAnnual > 0 ? Math.ceil((annualCost / annualSavings) * 12) : 60;
    const fiveYearRoi = netAnnual > 0 ? Math.round(((netAnnual * 5) / (annualCost * 5)) * 100) : 0;
    return { annualSavings, paybackMonths, fiveYearRoi };
  }, [currentSpeed, labourCost, targetSpeed]);

  return (
    <section className="bg-[color:var(--color-ink-soft)] border border-[color:var(--color-steel)]/30 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">— ROI calculator</div>
          <h3 className="font-display text-3xl">Run the numbers.</h3>
        </div>
        <Slider label={t('speed')} value={currentSpeed} min={20} max={200} onChange={setCurrentSpeed} suffix="/min" />
        <Slider label={t('labour')} value={labourCost} min={8} max={40} onChange={setLabourCost} prefix="RM " suffix="/hr" />
        <Slider label={t('target')} value={targetSpeed} min={60} max={240} onChange={setTargetSpeed} suffix="/min" />
      </div>
      <div className="space-y-8 md:border-l md:border-[color:var(--color-steel)]/30 md:pl-12">
        <Output label={t('payback')} value={`${result.paybackMonths} months`} />
        <Output label={t('savings')} value={formatRM(result.annualSavings)} />
        <Output label={t('roi')} value={`${result.fiveYearRoi}%`} />
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, onChange, prefix = '', suffix = '' }: any) {
  return (
    <div>
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest mb-2">
        <span className="text-[color:var(--color-steel)]">{label}</span>
        <span className="text-[color:var(--color-paper)]">{prefix}{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--color-signal)]"
      />
    </div>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mb-2">{label}</div>
      <div className="font-display text-5xl text-[color:var(--color-signal)] split-flap">{value}</div>
    </div>
  );
}
