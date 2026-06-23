'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { usePerfTier } from '@/lib/hooks';

const WORDS = [
  { text: 'BUILD', top: '6%', side: 'left' as const },
  { text: 'ENGINEER', top: '32%', side: 'right' as const },
  { text: 'INTERN', top: '58%', side: 'left' as const },
  { text: 'AURAPLEX', top: '82%', side: 'right' as const },
];

/**
 * Scroll-reactive backdrop for the internship page — giant outlined words
 * and a blueprint grid drift at different rates as you scroll, giving a
 * sense of depth and motion "behind" the content.
 *
 * Sits in an `absolute inset-0` layer behind the page (content is z-10).
 * Decorative + aria-hidden. transform-only (compositor-friendly). On the
 * 'minimal' perf tier (reduced motion) every layer is frozen.
 */
export function InternshipBackdrop() {
  const tier = usePerfTier();
  const still = tier === 'minimal';
  const { scrollYProgress } = useScroll();

  // Explicit per-layer transforms (constant count keeps hooks order stable).
  const y0 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -160]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -130]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 230]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 140]);
  const ys = [y0, y1, y2, y3];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Drifting blueprint grid */}
      <motion.div
        style={{
          y: gridY,
          backgroundImage:
            'linear-gradient(color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        className="absolute inset-[-15%] opacity-[0.05]"
      />

      {/* Giant outlined words */}
      {WORDS.map((w, i) => (
        <motion.div
          key={w.text}
          style={{ y: ys[i], top: w.top }}
          className={`absolute ${
            w.side === 'left' ? 'left-[-1%]' : 'right-[-1%]'
          } font-display leading-none select-none`}
        >
          <span
            className="block text-[clamp(4rem,14vw,13rem)] tracking-[-0.04em] text-transparent opacity-[0.06]"
            style={{
              WebkitTextStroke:
                '1px color-mix(in oklab, var(--color-signal) 70%, transparent)',
            }}
          >
            {w.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
