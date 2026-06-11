'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * ScrollDrawLine — wraps the post-hero portion of a page and renders a
 * cerulean rope that draws itself as the visitor scrolls.
 *
 * Architecture (third revision — the first two kept losing the line):
 *
 *   Previous attempts placed the SVG INSIDE the wrapper at z-30 with
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
 *   This version uses a position:fixed layer at z-[40] that lives OUTSIDE
 *   any wrapped section's stacking context. The rope is always visible
 *   on every device, regardless of what's pinned or what theme any given
 *   section uses. No mix-blend-mode — straight cerulean at 0.7 opacity
 *   so it reads everywhere without dominating text.
 *
 *   The SVG is 300vh tall. We translate it from y=0vh to y=-200vh as the
 *   visitor scrolls through the wrapped block, so the rope appears to
 *   pass through their viewport from top to bottom — the "follow me"
 *   feeling the page-anchored version was supposed to deliver. pathLength
 *   reveals the path progressively and completes at 70% of scroll so the
 *   full rope is visible for the final third of the page.
 *
 * Reduced motion: Motion's useTransform respects prefers-reduced-motion
 * on style-driven outputs — the path snaps to fully drawn and stops
 * translating for those users.
 */
export function ScrollDrawLine({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // 'start start' → scrollYProgress = 0 until the wrapper top reaches
  // the top of viewport (i.e. the hero has fully scrolled out). Below
  // that the value is clamped, so pathLength stays 0 and the line is
  // fully invisible while the visitor is still looking at the hero.
  // 'end end' → completes at the very end of the wrapped block.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // pathLength STARTS at 0 (fully invisible during hero) and completes
  // at 55% of wrapper scroll — the rope finishes drawing well before
  // the visitor reaches the end of the wrapped block so there's a
  // generous "rope fully drawn" window before the opacity fade.
  const pathLength = useTransform(scrollYProgress, [0, 0.55, 1], [0, 1, 1]);

  // Vertical translation — the 300vh-tall SVG slides upward through the
  // 100vh fixed window so the rope appears to scroll through view.
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-200vh']);

  // Fade the overlay out aggressively in the back half of scroll. The
  // rope is fully drawn by 55% — from 70% onward we drive opacity to 0
  // so by the time the visitor reaches the end of the wrapped block
  // (FaqSection bottom on the home page) the line is already gone.
  // The CloserSection that follows is a sibling of the wrapper, not a
  // child, so the line cannot reach it structurally either.
  //
  // Peak opacity is intentionally low (0.45) so the rope reads as
  // atmospheric background texture rather than a foreground UI element.
  // Combined with mix-blend-mode: screen below, this gives the
  // on.energy / Adelt feel — the line is part of the environment, not
  // crossing over text.
  // Peak dropped 0.45 → 0.28: at 0.45 the rope read as a foreground
  // element slicing through machine photography. At 0.28 it reads as
  // the atmospheric thread it's meant to be. Sections with dense
  // imagery (carousel, scroll-narrative) additionally sit at z-[45],
  // above this overlay entirely.
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.88],
    [0.28, 0.28, 0],
  );

  return (
    <div ref={ref} className="relative">
      {/* Fixed overlay — three guards stack to keep the rope strictly
          inside its lane:
            1. top-20  clips the top so it never crosses the header.
            2. CSS mask gradient hard-fades the bottom 25% of the
               overlay to transparent at ALL times — the rope
               physically cannot render where the footer enters view
               from below, no matter what scrollYProgress reports.
            3. opacity drives to 0 in the last ~12% of wrapper scroll
               as a belt-and-suspenders fallback. */}
      <motion.div
        className="fixed top-20 bottom-0 inset-x-0 pointer-events-none z-[40] overflow-hidden"
        style={{
          opacity,
          // mix-blend: screen composites the cerulean against whatever
          // is underneath — on dark sections it reads as a glowing
          // wire, on lighter content it dims. Perceptually pushes the
          // rope BEHIND content even though z-index keeps it in front.
          mixBlendMode: 'screen',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <motion.svg
          viewBox="0 0 1280 3000"
          preserveAspectRatio="none"
          style={{
            y,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '300vh',
          }}
        >
          {/* Two strokes — single bright inner line + outer wider stroke
              at lower opacity for a glow halo. Cheaper than the previous
              feGaussianBlur filter which forced SVG-filter rasterization
              on every pathLength tick. */}
          <motion.path
            d="
              M 640,0
              C 1140,375 140,750 640,1125
              C 1140,1500 140,1875 640,2250
              C 880,2500 880,2750 640,3000
            "
            fill="none"
            stroke="#2796df"
            strokeWidth={10}
            strokeOpacity={0.35}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
          <motion.path
            d="
              M 640,0
              C 1140,375 140,750 640,1125
              C 1140,1500 140,1875 640,2250
              C 880,2500 880,2750 640,3000
            "
            fill="none"
            stroke="#4eaae9"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </motion.svg>
      </motion.div>

      {children}
    </div>
  );
}
