import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Direction of the sweep. Default 'down'. */
  direction?: 'down' | 'up' | 'right' | 'left';
  /**
   * Sweep length. Was a duration in ms; now that the sweep is driven by scroll
   * position rather than wall-clock it is spent as scroll distance instead.
   * The default (700) maps to 35% of the entry phase.
   */
  duration?: number;
  /** Delay (ms) before the sweep starts after entering view. */
  delay?: number;
  className?: string;
};

/**
 * Adds a single signal-cerulean line that sweeps across the bounded child
 * once when the element enters the viewport. Pair with <AnimatedNumber> inside
 * so the line "reveals" the value behind it.
 *
 * The wrapper itself is non-blocking — children are visible from the start;
 * the line is an additive scan effect.
 *
 * Was `useInView` + `motion.div`. Now CSS scroll-driven. The named timeline
 * lives on the WRAPPER, matching where the `useInView` ref used to sit: the
 * beam is a 1px box, so an anonymous `view()` on the beam itself would trigger
 * against that 1px rather than against the card the reader is looking at.
 *
 * The beam is `aria-hidden` and its animation ends at `opacity: 0`, so the
 * no-scroll-timeline fallback (`fill: both` → end state) degrades to "no scan
 * line", which loses no content. Reduced motion resolves the same way via the
 * global block in globals.css.
 *
 * No state and no effects, so this is a Server Component.
 */
export function ScanLine({
  children,
  direction = 'down',
  duration = 700,
  delay = 0,
  className,
}: Props) {
  // The line travels across the major axis, animated via translate.
  //
  // KNOWN GEOMETRY QUIRK, PRESERVED: the translate is a percentage and the
  // beam is 1px on its travel axis, so a percentage translate (which resolves
  // against the element's OWN box) moves it 1px, not across the card. This was
  // true of the framer version too — it is transcribed rather than "fixed",
  // because changing the travel distance would be a redesign, not a mechanism
  // refactor. Flagged for follow-up.
  const orientationClasses =
    direction === 'down' || direction === 'up'
      ? 'left-0 right-0 h-px'
      : 'top-0 bottom-0 w-px';

  // `duration` (ms) → scroll span; `delay` (ms) → animation-range offset.
  // animation-delay is spec-ignored on a progress timeline, so the delay has
  // to be spent as range rather than as time.
  const span = Math.min(Math.max(duration / 20, 20), 70);
  const stagger = Math.min(Math.max(delay, 0) / 100, 5);

  return (
    <div className={`scan-host relative overflow-hidden ${className ?? ''}`.trim()}>
      {children}
      <div
        aria-hidden
        data-direction={direction}
        style={
          {
            '--scan-span': `${span}%`,
            ...(stagger ? { '--i': stagger } : null),
          } as CSSProperties
        }
        className={`scan-beam absolute ${orientationClasses} bg-[color:var(--color-signal)] shadow-[0_0_12px_color-mix(in_oklab,var(--color-signal)_60%,transparent)] pointer-events-none`}
      />
    </div>
  );
}
