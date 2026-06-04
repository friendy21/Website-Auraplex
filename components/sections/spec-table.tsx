'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

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
 * The row content fades up simultaneously. Stagger 80ms.
 */
export function SpecTable({ specs }: Props) {
  const ref = useRef<HTMLTableSectionElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <table className="w-full font-mono text-sm">
      <tbody ref={ref}>
        {specs.map((s, i) => (
          <tr
            key={i}
            className={i % 2 ? 'bg-[color:var(--color-neutral-800)]' : ''}
          >
            {/* Draw-in left border */}
            <td className="relative py-3 px-4 w-1">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.65, 0, 0.35, 1],
                }}
                className="absolute left-0 top-2 bottom-2 w-px bg-[color:var(--color-signal)] origin-top"
              />
            </td>
            <td className="py-3 px-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest w-1/3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08 + 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {s.label}
              </motion.span>
            </td>
            <td className="py-3 px-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08 + 0.15,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {s.value}
                {s.unit && ` ${s.unit}`}
              </motion.span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
