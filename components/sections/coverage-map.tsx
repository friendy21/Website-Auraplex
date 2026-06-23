'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

type Node = { label: string; ring: 1 | 2 | 3; angle: number };

// Real served regions (from the Auraplex coverage list). Angles are spread
// per ring so labels don't collide. This is a reach/coverage diagram, not a
// geographic map — no fabricated deployment counts.
const RINGS: Record<1 | 2 | 3, { r: number; tier: string }> = {
  1: { r: 62, tier: 'Malaysia' },
  2: { r: 116, tier: 'ASEAN' },
  3: { r: 168, tier: 'Asia-Pacific' },
};

const NODES: Node[] = [
  { label: 'Klang Valley', ring: 1, angle: 18 },
  { label: 'Penang', ring: 1, angle: 108 },
  { label: 'Johor', ring: 1, angle: 198 },
  { label: 'Sabah · Sarawak', ring: 1, angle: 300 },
  { label: 'Singapore', ring: 2, angle: 58 },
  { label: 'Thailand', ring: 2, angle: 158 },
  { label: 'Indonesia', ring: 2, angle: 262 },
  { label: 'Australia', ring: 3, angle: 122 },
  { label: 'New Zealand', ring: 3, angle: 238 },
];

const CX = 220;
const CY = 200;

function pos(r: number, angleDeg: number) {
  const t = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.sin(t), y: CY - r * Math.cos(t) };
}

/**
 * CoverageMap — concentric reach diagram of where Auraplex machines ship:
 * HQ at the centre, regions placed on Malaysia / ASEAN / Asia-Pacific rings
 * with pulsing signal nodes that stagger in on scroll. Honest coverage, not
 * a GIS map. Light-theme friendly; reduced-motion disables the pulse.
 */
export function CoverageMap() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();

  return (
    <svg ref={ref} viewBox="0 0 440 400" className="w-full h-auto" role="img" aria-label="Auraplex machine coverage across Malaysia, ASEAN and Asia-Pacific">
      {/* Rings */}
      {Object.values(RINGS).map((ring) => (
        <circle
          key={ring.r}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill="none"
          stroke="var(--color-neutral-200)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      ))}

      {/* Tier labels (top of each ring) */}
      {Object.values(RINGS).map((ring) => (
        <text
          key={`t-${ring.r}`}
          x={CX}
          y={CY - ring.r - 6}
          textAnchor="middle"
          className="fill-[color:var(--color-neutral-600)]"
          style={{ font: '600 8px var(--font-mono, monospace)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          {ring.tier}
        </text>
      ))}

      {/* Connecting lines + nodes */}
      {NODES.map((n, i) => {
        const { x, y } = pos(RINGS[n.ring].r, n.angle);
        const anchor = x < CX - 6 ? 'end' : x > CX + 6 ? 'start' : 'middle';
        const lx = x + (anchor === 'end' ? -10 : anchor === 'start' ? 10 : 0);
        return (
          <motion.g
            key={n.label}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: reduced ? 0 : 0.2 + i * 0.08 }}
          >
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--color-signal)" strokeOpacity="0.18" strokeWidth="1" />
            {/* Pulse halo */}
            {!reduced && (
              <motion.circle
                cx={x}
                cy={y}
                r="4"
                fill="var(--color-signal)"
                fillOpacity="0.4"
                animate={{ r: [4, 11, 4], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              />
            )}
            <circle cx={x} cy={y} r="4" fill="var(--color-signal)" />
            <text
              x={lx}
              y={y + 3}
              textAnchor={anchor}
              className="fill-[color:var(--color-ink)]"
              style={{ font: '600 9px var(--font-mono, monospace)', letterSpacing: '0.12em' }}
            >
              {n.label}
            </text>
          </motion.g>
        );
      })}

      {/* HQ centre */}
      <circle cx={CX} cy={CY} r="7" fill="var(--color-ink)" />
      <circle cx={CX} cy={CY} r="7" fill="none" stroke="var(--color-signal)" strokeWidth="2" />
      <text
        x={CX}
        y={CY + 22}
        textAnchor="middle"
        className="fill-[color:var(--color-ink)]"
        style={{ font: '700 9px var(--font-mono, monospace)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
      >
        Selangor HQ
      </text>
    </svg>
  );
}
