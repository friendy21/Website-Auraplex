import type { ReactNode } from 'react';


/**
 * ScrollDrawLine — wraps the post-hero portion of a page and renders a
 * cerulean rope that draws itself as the visitor scrolls.
 *
 * Architecture (fourth revision — CSS scroll-driven, no framer-motion):
 *
 *   Earlier attempts placed the SVG INSIDE the wrapper at z-30 with
 *   mix-blend-mode: screen. That broke for two reasons:
 *
 *     1. Several wrapped sections (ProductShowcase, ScrollNarrative,
 *        ManifestoSection, CloserSection) create their own stacking
 *        contexts via transform / will-change / GSAP pin. Once a section
 *        owns its stacking context, no z-index from a sibling can lift
 *        the SVG above it.
 *
 *     2. mix-blend-mode: screen is unreliable on mobile browsers and
 *        fails entirely against any section whose composited background
 *        isn't dark — the cerulean just disappears.
 *
 *   So the rope lives in a position:fixed layer at z-[40], outside any
 *   wrapped section's stacking context. The SVG is 300vh tall and travels
 *   from y=0 to y=-200vh across the wrapped block, so the rope appears to
 *   pass through the viewport top-to-bottom. The stroke reveals
 *   progressively and completes at 55% of scroll, leaving the full rope
 *   visible before the fade.
 *
 *   This revision replaces framer's useScroll/useTransform with a named
 *   CSS view timeline (see styles/motion/scroll-rope.css). Consequences:
 *
 *     - No 'use client'. With no hooks left, this is a Server Component;
 *       it ships zero JS and no longer hydrates.
 *     - mix-blend-mode is gone from the fixed layer. On a full-viewport
 *       fixed element it forced the compositor to re-blend the entire page
 *       on every scroll frame.
 *     - Reduced-motion users now get no rope at all instead of a scrubbing
 *       one (framer's useTransform does not honour the media query on
 *       scroll-driven outputs, despite what the old comment here claimed).
 *
 *   Public API is unchanged — app/[locale]/page.tsx needs no edit.
 */

/* Shared by both strokes: a wide translucent halo under a bright hairline.
   Cheaper than the feGaussianBlur this replaced, which forced SVG-filter
   rasterisation on every tick of the draw. */
const ROPE_PATH = `
  M 640,0
  C 1140,375 140,750 640,1125
  C 1140,1500 140,1875 640,2250
  C 880,2500 880,2750 640,3000
`;

export function ScrollDrawLine({ children }: { children: ReactNode }) {
  return (
    <div className="scroll-rope">
      {/* Fixed overlay — three guards stack to keep the rope strictly
          inside its lane:
            1. top-20 clips the top so it never crosses the header.
            2. A CSS mask gradient hard-fades the bottom 30% of the overlay
               to transparent at ALL times, so the rope physically cannot
               render where the footer enters view from below.
            3. The fade animation drives opacity to 0 over the last ~12% of
               wrapper scroll as a belt-and-suspenders fallback.
          Guards 2 and 3 live in scroll-rope.css. */}
      <div
        className="scroll-rope__layer fixed top-20 bottom-0 inset-x-0 pointer-events-none z-[40] overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="scroll-rope__svg"
          viewBox="0 0 1280 3000"
          preserveAspectRatio="none"
        >
          {/* pathLength={1} normalises the geometry so the CSS dash offset
              animation runs in 0→1 progress units regardless of the path's
              real length or the non-uniform viewBox scaling. */}
          <path
            className="scroll-rope__path scroll-rope__path--halo"
            d={ROPE_PATH}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="scroll-rope__path scroll-rope__path--core"
            d={ROPE_PATH}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {children}
    </div>
  );
}
