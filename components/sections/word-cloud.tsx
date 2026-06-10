'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

type Word = { word: string; size: 'sm' | 'md' | 'lg'; rotate: number };

type Props = {
  words: Word[];
  /** Index modulo for the signal-accented words. Default every 4th. */
  accentEvery?: number;
};

/**
 * Word cloud entrance — each word flies in from a deterministic (per-index)
 * "random" direction when the section enters the viewport, then settles into
 * its target rotation. Hover spikes that word's scale and signal-tints it.
 *
 * Directions are computed from the index so the layout is stable across
 * server/client renders (no Math.random at module scope).
 */
export function WordCloud({ words, accentEvery = 4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <div
      ref={ref}
      className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 max-w-5xl mx-auto"
    >
      {words.map((w, i) => {
        // Deterministic "random" entry vector based on index. Keeps SSR
        // output stable. Range roughly ±220px × ±140px.
        const seed = (i * 9301 + 49297) % 233280;
        const r1 = seed / 233280;
        const r2 = ((seed * 7) + 13) % 233280 / 233280;
        const dx = (r1 - 0.5) * 440;
        const dy = (r2 - 0.5) * 280;

        const isAccent = i % accentEvery === 0;
        const sizeClass =
          w.size === 'lg'
            ? 'text-5xl md:text-7xl'
            : w.size === 'md'
              ? 'text-3xl md:text-5xl'
              : 'text-xl md:text-3xl text-[color:var(--color-neutral-400)]';

        return (
          <motion.span
            key={i}
            initial={{ x: dx, y: dy, opacity: 0, rotate: w.rotate * 3 }}
            animate={
              inView
                ? { x: 0, y: 0, opacity: 1, rotate: w.rotate }
                : { x: dx, y: dy, opacity: 0, rotate: w.rotate * 3 }
            }
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 16,
              delay: i * 0.04,
              opacity: { duration: 0.5, delay: i * 0.04 },
            }}
            whileHover={{
              scale: 1.12,
              y: -6,
              transition: { type: 'spring', stiffness: 380, damping: 18 },
            }}
            className={`font-display tracking-[-0.02em] leading-none cursor-default inline-block ${sizeClass} ${
              isAccent ? 'text-[color:var(--color-signal)]' : ''
            } hover:text-[color:var(--color-signal)] hover:[text-shadow:0_0_30px_color-mix(in_oklab,var(--color-signal)_40%,transparent)] transition-[color,text-shadow] duration-300`}
          >
            {w.word}
          </motion.span>
        );
      })}
    </div>
  );
}
