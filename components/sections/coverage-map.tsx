'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

type Node = { label: string; x: number; y: number; tier: 1 | 2 | 3 };

// Stylised (not GIS-accurate) layout of the regions Auraplex serves, with
// Selangor HQ as the origin. Coordinates are in a 0–100 × 0–66 box.
const HQ = { x: 34, y: 40 };

const NODES: Node[] = [
  { label: 'Penang', x: 26, y: 24, tier: 1 },
  { label: 'Johor', x: 40, y: 52, tier: 1 },
  { label: 'Sabah · Sarawak', x: 66, y: 34, tier: 1 },
  { label: 'Singapore', x: 44, y: 58, tier: 2 },
  { label: 'Thailand', x: 22, y: 12, tier: 2 },
  { label: 'Indonesia', x: 56, y: 62, tier: 2 },
  { label: 'Australia', x: 84, y: 60, tier: 3 },
  { label: 'New Zealand', x: 95, y: 64, tier: 3 },
];

const TIER_OPACITY = { 1: 0.85, 2: 0.55, 3: 0.32 } as const;

function flowPath(n: Node): string {
  const mx = (HQ.x + n.x) / 2;
  const my = Math.min(HQ.y, n.y) - 12;
  return `M ${HQ.x} ${HQ.y} Q ${mx} ${my} ${n.x} ${n.y}`;
}

/**
 * CoverageMap — a flow map of where Auraplex machines ship: animated flow
 * lines run from Selangor HQ to each served region (Malaysia / ASEAN /
 * Asia-Pacific), nodes pulse in on scroll. Faithful in spirit to the
 * amCharts map+Sankey reference (origin→destination flows), but as a
 * lightweight inline-SVG reach map — no mapping library, no fabricated
 * deployment counts. Flow dashes are CSS-animated (frozen by reduced-motion).
 */
export function CoverageMap() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 66"
      className="w-full h-auto"
      role="img"
      aria-label="Auraplex machine coverage flows from Selangor across Malaysia, ASEAN and Asia-Pacific"
    >
      {/* Flow lines */}
      {NODES.map((n, i) => (
        <motion.path
          key={`p-${n.label}`}
          d={flowPath(n)}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.5"
          className={reduced ? undefined : 'ax-flow'}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: TIER_OPACITY[n.tier] } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.6, delay: i * 0.08 }}
        />
      ))}

      {/* Region nodes */}
      {NODES.map((n, i) => (
        <motion.g
          key={`n-${n.label}`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
        >
          {!reduced && (
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="1"
              fill="var(--color-signal)"
              fillOpacity="0.4"
              animate={{ r: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          )}
          <circle cx={n.x} cy={n.y} r="1" fill="var(--color-signal)" />
          <text
            x={n.x}
            y={n.y - 2.4}
            textAnchor="middle"
            className="fill-[color:var(--color-ink)]"
            style={{ font: '600 2.2px var(--font-mono, monospace)', letterSpacing: '0.05em' }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      {/* HQ origin */}
      <circle cx={HQ.x} cy={HQ.y} r="1.8" fill="var(--color-ink)" />
      <circle cx={HQ.x} cy={HQ.y} r="1.8" fill="none" stroke="var(--color-signal)" strokeWidth="0.6" />
      <text
        x={HQ.x}
        y={HQ.y + 4}
        textAnchor="middle"
        className="fill-[color:var(--color-ink)]"
        style={{ font: '700 2.4px var(--font-mono, monospace)', letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        Selangor HQ
      </text>
    </svg>
  );
}
