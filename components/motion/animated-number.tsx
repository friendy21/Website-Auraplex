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
 *
 * Hydration-safe: server and first client paint both render "0". The spring
 * (or instant jump for reduced-motion) only fires AFTER hydration, in
 * useEffect. Previously this component read `window.matchMedia` in a lazy
 * `useState` initializer, which returned `false` on the server (no window)
 * but `true` on a client with reduced-motion enabled — branching the DOM and
 * causing a hydration mismatch.
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
  // Always starts at '0' — identical on SSR and first CSR paint.
  const [display, setDisplay] = useState('0');

  // Drive the animation only AFTER hydration. The reduce-motion check is now
  // inside the effect, so it can never affect the rendered HTML diff.
  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Snap both the underlying value and the spring to the target — the
      // `on('change')` subscription below will fire once and update display.
      mv.jump(value);
      spring.jump(value);
    } else {
      mv.set(value);
    }
  }, [inView, value, mv, spring]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplay(formatNumber(latest, locale));
    });
  }, [spring, locale]);

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
