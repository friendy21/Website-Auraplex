import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

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
  { label: 'India', x: 7, y: 30, tier: 3 },
  { label: 'Kazakhstan', x: 13, y: 10, tier: 3 },
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
 * deployment counts.
 *
 * Motion lives entirely in styles/motion/data-viz.css: the <svg> declares a
 * named view timeline (`--cov-map`) and its children stagger off it via `--i`.
 * With the framer hooks gone there is no client state left, so this is a
 * Server Component and ships no JS at all.
 */
export function CoverageMap() {
  const t = useTranslations('page2026');

  return (
    <svg
      viewBox="0 0 100 66"
      className="cov-map block w-full max-w-full"
      style={{ aspectRatio: '100 / 66', height: 'auto' }}
      role="img"
      aria-label={t('coverageAria')}
    >
      {/* Flow lines — marching dashes + a staggered scroll-driven fade in */}
      {NODES.map((n, i) => (
        <path
          key={`p-${n.label}`}
          d={flowPath(n)}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.5"
          className="cov-flow"
          style={
            {
              '--i': i,
              '--tier-op': TIER_OPACITY[n.tier],
            } as CSSProperties
          }
        />
      ))}

      {/* Region nodes */}
      {NODES.map((n, i) => (
        <g key={`n-${n.label}`} className="cov-node" style={{ '--i': i } as CSSProperties}>
          {/* Pulse halo. Scales instead of animating `r`; --ox/--oy give it a
              transform-origin at the node centre in viewBox units. */}
          <circle
            cx={n.x}
            cy={n.y}
            r="1"
            fill="var(--color-signal)"
            fillOpacity="0.4"
            className="cov-pulse"
            style={{ '--ox': `${n.x}px`, '--oy': `${n.y}px` } as CSSProperties}
          />
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
        </g>
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
