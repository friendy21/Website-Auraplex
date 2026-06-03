'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

type Props = {
  /** Target numeric value to count to. */
  value: number;
  /** Optional prefix (e.g. "RM "). */
  prefix?: string;
  /** Optional suffix (e.g. "%", "+", "mo"). */
  suffix?: string;
  /** Locale for number formatting. Defaults to en-MY. */
  locale?: string;
  /** Animation duration in ms. */
  duration?: number;
  /** className applied to the wrapping span. */
  className?: string;
};

/**
 * Number that counts up from 0 to `value` when it enters the viewport.
 * Uses a Motion spring under the hood for natural deceleration.
 * Respects prefers-reduced-motion (renders the final value instantly).
 */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  locale = 'en-MY',
  duration = 1500,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    stiffness: 60,
    damping: 18,
    duration: duration / 1000,
  });
  // Lazy init reads prefers-reduced-motion once at first render; if the user
  // wants reduced motion, we render the final value and skip the spring.
  const [reduce] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [display, setDisplay] = useState(() =>
    reduce ? formatNumber(value, locale) : '0',
  );

  useEffect(() => {
    if (reduce) return;
    if (inView) mv.set(value);
  }, [inView, value, mv, reduce]);

  useEffect(() => {
    if (reduce) return;
    return spring.on('change', (latest) => {
      setDisplay(formatNumber(latest, locale));
    });
  }, [spring, locale, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function formatNumber(n: number, locale: string): string {
  // Integers only for the count-up; preserves the "30 / 142 / 340" feel.
  return new Intl.NumberFormat(locale).format(Math.round(n));
}
