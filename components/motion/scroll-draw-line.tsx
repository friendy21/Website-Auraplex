'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * ScrollDrawLine — wraps a slice of the page and renders an SVG curve
 * behind/over it that draws itself in lockstep with scroll progress
 * through the wrapped content. Cerulean variant of the skiper-ui
 * "Skiper19" pattern (https://skiper-ui.com/v1/skiper19).
 *
 * Usage on the home page:
 *
 *   <HeroCinematic />
 *   <ScrollDrawLine>
 *     ... every section after the hero ...
 *   </ScrollDrawLine>
 *
 * The line begins drawing the moment the top of the wrapped block
 * enters the viewport (i.e. as soon as you scroll past the hero) and
 * finishes when the bottom of the block reaches the bottom of the
 * viewport (i.e. when you're at the end of the page). It threads through
 * every wrapped section using mix-blend-mode: screen so it glows on the
 * dark ink backgrounds without disrupting text legibility.
 *
 * preserveAspectRatio="none" lets the SVG stretch to fit any wrapper
 * height; vectorEffect="non-scaling-stroke" keeps the stroke a constant
 * pixel width regardless of how stretched the curve becomes.
 *
 * Reduced-motion: Motion respects prefers-reduced-motion on style-driven
 * useTransform outputs — the path snaps to fully drawn for those users.
 */
export function ScrollDrawLine({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // start: container top hits bottom of viewport (first scroll past hero)
  // end:   container bottom hits bottom of viewport (last bit of page)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox="0 0 1280 6400"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none z-[5]"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="signal-glow-rope"
            x="-10%"
            y="-2%"
            width="120%"
            height="104%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer cerulean stroke with glow halo */}
        <motion.path
          d="M 640,0
             C 1180,800 100,1600 640,2400
             C 1180,3200 100,4000 640,4800
             C 880,5400 880,5900 640,6400"
          fill="none"
          stroke="#2796df"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#signal-glow-rope)"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />

        {/* Inner bright stroke for crispness */}
        <motion.path
          d="M 640,0
             C 1180,800 100,1600 640,2400
             C 1180,3200 100,4000 640,4800
             C 880,5400 880,5900 640,6400"
          fill="none"
          stroke="#4eaae9"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />
      </svg>

      {children}
    </div>
  );
}
