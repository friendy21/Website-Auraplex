import type { CSSProperties, ReactNode } from 'react';

/**
 * KineticReveal — scroll-triggered word-by-word headline animation.
 *
 * Splits children text into words. Each word animates with:
 *   - clip-path wipe: inset(0 100% 0 0) → inset(0 0% 0 0)
 *   - variable font weight sweep: 200 → 700
 *   - stagger per word
 *
 * Was `useInView` + per-word `motion.span`. Now CSS scroll-driven: the heading
 * owns a named `view-timeline` (`--kinetic`) and every word animates against
 * it, so the whole line shares one clock even when it wraps. Per-word stagger
 * moved from `transition.delay` onto `--i` / `animation-range` offsets, since
 * `animation-delay` is spec-ignored on a progress timeline.
 *
 * This also removes a real LCP bug. Both non-`immediate` call sites are
 * above-the-fold H1s (/services, /about), and the framer version held every
 * word at `opacity: 0` until hydration. Under a view timeline an element
 * already in the viewport at scroll 0 sits past the end of its `entry` range,
 * so `fill: both` paints it fully visible on the first frame.
 *
 * No state and no effects, so this is a Server Component.
 * `prefers-reduced-motion` is handled in styles/motion/reveal-family.css.
 *
 * NOTE ON UNITS: unlike <Reveal>, this component's `delay` prop is in SECONDS
 * (it fed a framer `transition.delay` directly). That is preserved.
 */
export function KineticReveal({
  children,
  className,
  as: Tag = 'h2',
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
  /**
   * Above-the-fold mode. Renders the heading visible in the server HTML with a
   * time-based CSS entrance rather than the per-word wipe. Trades the per-word
   * kinetic wipe for a single fade-up on that heading.
   */
  immediate?: boolean;
}) {
  // Accept either a string or React children that render to a string. If a
  // caller passes mixed JSX we render the children unanimated rather than
  // silently dropping them.
  const text = typeof children === 'string' ? children : null;
  const words = text ? text.split(/(\s+)/) : [];

  if (immediate) {
    return (
      <Tag
        className={`reveal-immediate ${className ?? ''}`.trim()}
        style={delay ? { animationDelay: `${delay}s` } : undefined}
      >
        {children}
      </Tag>
    );
  }

  if (!text) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={`kinetic-reveal ${className ?? ''}`.trim()}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        // The framer original computed `delay + i * 0.04` off the index in the
        // SPLIT array, so whitespace tokens consumed stagger slots too. Using
        // the same `i` preserves the exact per-word cadence.
        //
        // `delay` is seconds and the per-word step was 0.04s, so the delay is
        // converted into the same index units before being handed to CSS.
        // Clamped so a long headline cannot push the range end past
        // `entry 100%`, where a word would strand mid-wipe.
        const stagger = Math.min(Math.max(delay, 0) / 0.04 + i, 12);
        return (
          <span
            key={i}
            className="kinetic-word"
            style={{ '--i': stagger } as CSSProperties}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}
