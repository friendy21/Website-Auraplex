import type { CSSProperties } from 'react';

interface Spec {
  label: string;
  value: string;
  unit?: string;
}

interface Props {
  specs: Spec[];
}

/**
 * SpecTable — specifications with draw-in left borders on scroll.
 *
 * Each row reveals with a signal-colored left border that draws from
 * top to bottom (scaleY 0 → 1) as the row enters the viewport.
 * The row content fades in simultaneously, staggered by row.
 *
 * Motion lives in styles/motion/sections.css. It replaces
 * useInView(tbody, { once: true }) + nine motion elements with one named view
 * timeline (`--spec-rows`) declared on the wrapper, plus the house `--i`
 * stagger contract set per <tr>. Keeping ONE timeline for the whole table is
 * what preserves the original choreography: every row was gated by a single
 * observer on the <tbody> and separated by `delay: i * 0.08`, not by its own
 * individual in-view moment. With no hooks left the component is a Server
 * Component and ships no JS.
 *
 * The wrapper <div> exists so the timeline subject is an ordinary block box;
 * `display: table` / `table-row-group` boxes are a grey area as view-timeline
 * subjects. It is layout-neutral — the table is already `w-full`.
 */
export function SpecTable({ specs }: Props) {
  return (
    <div className="spec-scope">
      <table className="w-full font-mono text-sm">
        <tbody>
          {specs.map((s, i) => (
            <tr
              key={i}
              className={i % 2 ? 'bg-[color:var(--color-neutral-800)]' : ''}
              style={{ '--i': i } as CSSProperties}
            >
              {/* Draw-in left border */}
              <td className="relative py-3 px-4 w-1">
                <div className="spec-rule absolute left-0 top-2 bottom-2 w-px bg-[color:var(--color-signal)] origin-top" />
              </td>
              <td className="py-3 px-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest w-1/3">
                <span className="spec-cell">{s.label}</span>
              </td>
              <td className="py-3 px-4">
                <span className="spec-cell spec-cell-late">
                  {s.value}
                  {s.unit && ` ${s.unit}`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
