'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, type Variants } from 'motion/react';

type Props = {
  children: ReactNode;
  /** Reveal style. `up` = strong lift, `fade` = small lift, `scale` = scale-in. */
  variant?: 'fade' | 'up' | 'scale';
  /** Milliseconds to wait before the animation starts after entering view. */
  delay?: number;
  /** Optional className passed to the wrapping motion.div. */
  className?: string;
  /**
   * Above-the-fold mode. Renders visible in the server HTML with a CSS entrance
   * (paints at first frame, before hydration) instead of the JS `useInView`
   * path — so it never blocks LCP behind the motion bundle. Use for the first
   * hero block on a page; leave off for scroll-into-view reveals.
   */
  immediate?: boolean;
};

/**
 * Scroll-into-view reveal — Motion-based.
 *
 * The previous version applied a CSS `animation-timeline: view()` scroll-
 * driven animation and tried to stagger via `animation-delay` (a time value).
 * That combination is undefined behavior across browsers — sometimes the
 * element animated normally, sometimes it never started, sometimes it got
 * stuck at an intermediate state. Symptom: "sometimes pops, sometimes
 * doesn't."
 *
 * This version uses Motion's `useInView` + time-based animation. Same look,
 * but `delay` actually works and the entrance is consistent regardless of
 * scroll position at page load, smooth scroll engine, or browser.
 *
 * - Triggers when element is ~10% inside the viewport (margin tuned to feel
 *   responsive without firing while still below the fold).
 * - Animates exactly once per page lifecycle.
 * - Respects `prefers-reduced-motion: reduce` automatically via Motion.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  if (immediate) {
    return (
      <div
        className={`reveal-immediate ${className ?? ''}`.trim()}
        style={delay ? { animationDelay: `${delay / 1000}s` } : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={VARIANTS[variant]}
      transition={{
        // Cinematic settle — heavier, more confident than the old 0.7s
        // ease-out. Unifies secondary-page reveals with the homepage arc.
        duration: 0.9,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Matches the visual shapes the previous CSS keyframes produced:
//   fade  → opacity + small lift (40px)
//   up    → opacity + strong lift (80px)
//   scale → opacity + scale-in
const VARIANTS: Record<NonNullable<Props['variant']>, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  up: {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};
