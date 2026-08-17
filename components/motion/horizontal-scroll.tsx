import { Children, type CSSProperties, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Extra scroll distance multiplier. Default 1.2 (20% overscroll). */
  overscroll?: number;
  className?: string;
}

/**
 * HorizontalScrollSection — pinned, scroll-driven horizontal runway.
 *
 * A tall runway pins an inner `position: sticky` viewport at `top: 0`; as the
 * user scrolls vertically the inner track translates horizontally. Each direct
 * child becomes a panel that occupies the full viewport width.
 *
 * All of that now lives in styles/motion/horizontal-scroll.css on a native
 * view progress timeline — there is no JS here at all, so this renders as a
 * server component and the pan is live from the first paint of the server
 * HTML. The old GSAP ScrollTrigger version had to measure `track.scrollWidth`
 * on mount (a forced reflow) and re-measure on every `refresh()`; the CSS
 * derives the same geometry from two custom properties published below.
 *
 * Mobile (< 768px), reduced-motion, and engines without scroll-driven
 * animations fall back to a normal vertical stack so every panel stays
 * reachable. That fallback used to be React state initialised to `false`,
 * which meant phones painted a clipped horizontal row until hydration; it is
 * a media query now and is correct in the first frame.
 *
 * NOTE ON `overscroll`: it lengthens the RUNWAY only — the distance you must
 * scroll to get through the section — which is what its name and this
 * docstring have always described. The GSAP version also multiplied the
 * track's x distance by it, over-travelling past the last panel into empty
 * background (120vw of nothing on /2026 at overscroll 1.4). The track now
 * travels exactly one viewport per panel gap and lands flush.
 */
export function HorizontalScrollSection({
  children,
  overscroll = 1.2,
  className,
}: Props) {
  // Every panel is one viewport wide, so the track's width — and therefore
  // the scroll distance ScrollTrigger used to measure at runtime — is fully
  // determined by the child count at render time.
  const panels = Children.count(children);

  return (
    <section
      className={`hs-runway bg-[color:var(--color-ink)] ${className ?? ''}`}
      style={
        {
          '--hs-panels': String(panels),
          '--hs-overscroll': String(overscroll),
        } as CSSProperties
      }
    >
      <div className="hs-viewport">
        <div className="hs-track">{children}</div>
      </div>
    </section>
  );
}
