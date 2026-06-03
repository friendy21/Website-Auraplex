'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';

type Props = {
  children: ReactNode;
  /** Direction of the sweep. Default 'down'. */
  direction?: 'down' | 'up' | 'right' | 'left';
  /** Sweep duration in ms. */
  duration?: number;
  /** Delay (ms) before sweep starts after entering view. */
  delay?: number;
  className?: string;
};

/**
 * Adds a single signal-cerulean line that sweeps across the bounded child
 * once when the element enters the viewport. The sweep happens BEFORE the
 * child's own contents animate — pair with <AnimatedNumber> inside so the
 * line "reveals" the value behind it.
 *
 * The wrapper itself is non-blocking — children are visible from the start;
 * the line is an additive scan effect.
 */
export function ScanLine({
  children,
  direction = 'down',
  duration = 700,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  // The line travels across the major axis. Initial position is "before" the
  // element, final position is "after" — we animate via translate.
  const orientationClasses =
    direction === 'down' || direction === 'up'
      ? 'left-0 right-0 h-px'
      : 'top-0 bottom-0 w-px';

  const fromY =
    direction === 'down' ? '0%' : direction === 'up' ? '100%' : '0%';
  const toY =
    direction === 'down' ? '100%' : direction === 'up' ? '0%' : '0%';
  const fromX =
    direction === 'right' ? '0%' : direction === 'left' ? '100%' : '0%';
  const toX =
    direction === 'right' ? '100%' : direction === 'left' ? '0%' : '0%';

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      {children}
      <motion.div
        aria-hidden
        initial={{ y: fromY, x: fromX, opacity: 0 }}
        animate={
          inView
            ? { y: toY, x: toX, opacity: [0, 1, 1, 0] }
            : { y: fromY, x: fromX, opacity: 0 }
        }
        transition={{
          duration: duration / 1000,
          delay: delay / 1000,
          ease: 'linear',
          opacity: { times: [0, 0.15, 0.85, 1], duration: duration / 1000 },
        }}
        className={`absolute ${orientationClasses} bg-[color:var(--color-signal)] shadow-[0_0_12px_color-mix(in_oklab,var(--color-signal)_60%,transparent)] pointer-events-none`}
      />
    </div>
  );
}
