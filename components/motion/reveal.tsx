import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Reveal style. `up` = strong lift, `fade` = small lift, `scale` = scale-in. */
  variant?: 'fade' | 'up' | 'scale';
  /** Milliseconds to wait before the animation starts after entering view. */
  delay?: number;
  /** Optional className passed to the wrapping div. */
  className?: string;
  /**
   * Above-the-fold mode. Renders visible in the server HTML with a time-based
   * CSS entrance (paints at first frame) instead of the scroll-driven path.
   * Use for the first hero block on a page; leave off for scroll-into-view
   * reveals.
   */
  immediate?: boolean;
};

/**
 * Scroll-into-view reveal — CSS scroll-driven.
 *
 * Was `useInView` + `motion.div`. That had a hard floor: `initial="hidden"`
 * pinned the element at `opacity: 0` until the motion bundle hydrated and the
 * IntersectionObserver fired, so above-the-fold call sites could not become
 * LCP candidates until JS landed.
 *
 * This version rides `animation-timeline: view()` (the reveal system already
 * present in globals.css). The behavioural difference that matters: an element
 * already inside the viewport at scroll offset 0 is PAST the end of its
 * `entry` range, so `animation-fill-mode: both` paints it at the end state on
 * the first frame with no JS involved. Below-the-fold elements still start
 * hidden and scrub in as they enter.
 *
 * No state and no effects, so this is a Server Component — the ~100 call sites
 * no longer drag a client boundary (or the motion bundle) along with them.
 *
 * `prefers-reduced-motion` is handled by the global block in globals.css.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  immediate = false,
}: Props) {
  if (immediate) {
    // Deliberately time-based and timeline-free, so a real `animation-delay`
    // is the correct mechanism here (trap (a) applies only to progress
    // timelines). Unchanged from the previous implementation.
    return (
      <div
        className={`reveal-immediate ${className ?? ''}`.trim()}
        style={delay ? { animationDelay: `${delay / 1000}s` } : undefined}
      >
        {children}
      </div>
    );
  }

  // `delay` (ms) is spent as an animation-range OFFSET, never as a delay —
  // animation-delay is spec-ignored on a progress timeline. 100ms = one unit
  // of `--i` = a 6% shift down the entry range.
  //
  // The clamp is load-bearing: several call sites compute `delay={i * 100}`
  // inside a `.map()`, and an unbounded index would push the range END past
  // `entry 100%`, where it can never be reached — stranding late items
  // permanently half-faded. Capping at 5 holds the worst case at entry 30% →
  // entry 80%, comfortably inside the phase.
  const stagger = Math.min(Math.max(delay, 0) / 100, 5);

  return (
    <div
      className={[VARIANT_CLASS[variant], stagger ? 'reveal-stagger' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={stagger ? ({ '--i': stagger } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

// The scroll-driven classes in globals.css, whose keyframes reproduce the
// shapes the framer variants produced:
//   fade  → opacity + small lift (40px)   → .reveal
//   up    → opacity + strong lift (80px)  → .reveal-up
//   scale → opacity + scale-in            → .reveal-scale
const VARIANT_CLASS: Record<NonNullable<Props['variant']>, string> = {
  fade: 'reveal',
  up: 'reveal-up',
  scale: 'reveal-scale',
};
