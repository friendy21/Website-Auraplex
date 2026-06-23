'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

type Segment = { label: string; value: number; color: string };

type Props = {
  total: number;
  centerLabel: string;
  segments: Segment[];
};

const R = 78;
const C = 2 * Math.PI * R;

/**
 * CategoryRadial — animated donut of the real catalogue split. Each segment
 * draws in (strokeDasharray 0 → its arc length) when the chart scrolls into
 * view; the center counts the total. Light-theme friendly.
 *
 * Reduced-motion: segments render fully without the draw animation.
 */
export function CategoryRadial({ total, centerLabel, segments }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();
  const safeTotal = total || 1;

  // Precompute each segment's arc length + start rotation without mutating
  // a running total during render (prior sum via reduce keeps it pure).
  const computed = segments.map((s, i) => {
    const prior = segments.slice(0, i).reduce((n, x) => n + x.value, 0);
    return {
      ...s,
      arc: (s.value / safeTotal) * C,
      rotation: (prior / safeTotal) * 360,
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="relative shrink-0">
        <svg ref={ref} viewBox="0 0 200 200" className="h-56 w-56 -rotate-90">
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--color-neutral-200)"
            strokeWidth="14"
          />
          {computed.map((s) => (
            <motion.circle
              key={s.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeLinecap="butt"
              style={{ transformOrigin: '100px 100px', rotate: `${s.rotation}deg` }}
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={
                inView || reduced
                  ? { strokeDasharray: `${s.arc} ${C - s.arc}` }
                  : { strokeDasharray: `0 ${C}` }
              }
              transition={{ duration: reduced ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        {/* Center total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-5xl tracking-[-0.03em] leading-none">
            {total}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-600)] mt-1">
            {centerLabel}
          </div>
        </div>
      </div>

      {/* Legend */}
      <ul className="space-y-4 w-full max-w-xs">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-4 border-b border-[color:var(--color-neutral-200)] pb-3">
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-display text-2xl tracking-[-0.02em]">
              {s.value}
              <span className="font-mono text-[10px] text-[color:var(--color-neutral-600)] ml-1">
                {Math.round((s.value / safeTotal) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
