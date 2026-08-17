import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Direction of the wipe. 'up' is the default editorial pattern. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * Reveal length. Was an animation duration in seconds; now that the wipe is
   * driven by scroll position rather than wall-clock it is spent as scroll
   * distance instead — a larger value = a longer throw. The default (1.1)
   * maps to the same 55% of the entry phase the rest of the family uses, so
   * existing call sites are unaffected.
   */
  duration?: number;
  /** Delay before the reveal kicks off, in seconds. */
  delay?: number;
  className?: string;
};

/**
 * Clip-path mask reveal — wraps an Image (or anything visual) and unmasks
 * it from a chosen edge when the element scrolls into view. The image stays
 * static; only the clip mask animates. Crisper than a simple opacity fade
 * and very recognisable as a signature editorial-site move.
 *
 * Was `useInView` + `motion.div`. Now `animation-timeline: view()`; the
 * polygon geometry in styles/motion/reveal-family.css is a literal
 * transcription of the framer VARIANTS map, so the wipe is unchanged.
 *
 * No state and no effects, so this is a Server Component.
 * `prefers-reduced-motion` is handled by the global block in globals.css.
 */
export function ImageReveal({
  children,
  direction = 'up',
  duration = 1.1,
  delay = 0,
  className,
}: Props) {
  // `duration` (s) → scroll span. 1.1s is the default and yields 55%, matching
  // the family's baseline. Clamped so an extreme value cannot collapse the
  // wipe to nothing or run past the end of the entry phase.
  const span = Math.min(Math.max(duration * 50, 25), 70);
  // `delay` (s) → animation-range offset. animation-delay is spec-ignored on a
  // progress timeline, so it must be spent as range, not time.
  const stagger = Math.min(Math.max(delay, 0) / 0.1, 5);

  return (
    <div
      data-direction={direction}
      className={`image-reveal ${className ?? ''}`.trim()}
      style={
        {
          '--reveal-span': `${span}%`,
          ...(stagger ? { '--i': stagger } : null),
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
