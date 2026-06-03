'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';

type Props = {
  children: ReactNode;
  /** Direction of the wipe. 'up' is the default editorial pattern. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Animation duration in seconds. */
  duration?: number;
  /** Delay before the reveal kicks off. */
  delay?: number;
  className?: string;
};

const VARIANTS: Record<
  NonNullable<Props['direction']>,
  { initial: string; final: string }
> = {
  up: {
    initial: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  down: {
    initial: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  left: {
    initial: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  right: {
    initial: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
};

/**
 * Clip-path mask reveal — wraps an Image (or anything visual) and unmasks
 * it from a chosen edge when the element scrolls into view. The image stays
 * static; only the clip mask animates. Crisper than a simple opacity fade
 * and very recognisable as a signature editorial-site move.
 */
export function ImageReveal({
  children,
  direction = 'up',
  duration = 1.1,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const v = VARIANTS[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: v.initial }}
      animate={{ clipPath: inView ? v.final : v.initial }}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
