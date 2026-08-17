import type { CSSProperties } from 'react';

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
 * draws in (strokeDasharray 0 → its arc length) as the chart scrolls into
 * view; the center shows the total. Light-theme friendly.
 *
 * The draw is a scroll-driven CSS animation (see styles/motion/data-viz.css).
 * The wrapper div declares the `--radial-draw` view timeline and each segment
 * rides it, carrying its own arc geometry as custom properties.
 *
 * Reduced-motion (and any engine without scroll-driven animations): segments
 * render fully drawn, without the draw animation — the base style and the
 * `fill: both` end state are the same fully-drawn donut.
 *
 * No hooks, no client state — this is a Server Component.
 */
export function CategoryRadial({ total, centerLabel, segments }: Props) {
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
      <div className="radial-chart relative shrink-0">
        <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90">
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
            <circle
              key={s.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeLinecap="butt"
              className="radial-seg"
              style={
                {
                  transformBox: 'view-box',
                  transformOrigin: '100px 100px',
                  transform: `rotate(${s.rotation}deg)`,
                  '--arc': s.arc,
                  '--rest': C - s.arc,
                  '--c': C,
                } as CSSProperties
              }
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
