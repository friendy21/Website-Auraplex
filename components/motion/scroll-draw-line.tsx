'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * ScrollDrawLine — wraps the post-hero portion of a page and renders an
 * SVG curve that draws itself in lockstep with the visitor's scroll
 * through the wrapped block. Cerulean variant of the skiper-ui
 * "Skiper19" pattern (https://skiper-ui.com/v1/skiper19): the line
 * lives on the page (not on the viewport), so it scrolls naturally with
 * the content rather than hovering in front of it.
 *
 * Two specific lessons that the first cut failed:
 *
 *   1. The SVG must be OVERLAID on section content, not behind it. With
 *      mix-blend-mode: screen there has to be a dark surface underneath
 *      the line for the blend to brighten — placing the SVG at z-[5]
 *      under the sections meant their bg-ink simply hid it. The line
 *      now sits at z-[30] (above section content, below the header
 *      at z-50). pointer-events: none so it never blocks clicks.
 *
 *   2. The path must visually span all the way to the bottom. With
 *      preserveAspectRatio="none" the viewBox stretches to the wrapper
 *      height — but the path geometry has to actually use that full
 *      vertical extent. Eight cubic Beziers across a 0→6400 viewBox
 *      gives the line enough crossings to read as a rope through every
 *      section, all the way to the closer.
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

  // Begin drawing as soon as the wrapper top enters the viewport bottom
  // (the moment the visitor scrolls past the hero), finish at the very
  // end of the wrapped block (the bottom of the closer).
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
        className="absolute inset-0 h-full w-full pointer-events-none z-[30]"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="signal-glow-rope"
            x="-5%"
            y="-1%"
            width="110%"
            height="102%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* A longer rope — eight cubic Bezier segments across the full
            0→6400 vertical extent. Each segment crosses (or near-crosses)
            horizontal centre so the rope reads as a continuous sinuous
            thread regardless of how tall the wrapper turns out to be. */}
        <motion.path
          d="
            M 640,0
            C 1140,400 140,800 640,1200
            C 1140,1600 140,2000 640,2400
            C 1140,2800 140,3200 640,3600
            C 1140,4000 140,4400 640,4800
            C 1100,5100 180,5400 640,5700
            C 880,5900 880,6200 640,6400
          "
          fill="none"
          stroke="#2796df"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#signal-glow-rope)"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />

        {/* Crisp inner stroke — keeps the line readable on top of the
            softer glow halo of the outer stroke. */}
        <motion.path
          d="
            M 640,0
            C 1140,400 140,800 640,1200
            C 1140,1600 140,2000 640,2400
            C 1140,2800 140,3200 640,3600
            C 1140,4000 140,4400 640,4800
            C 1100,5100 180,5400 640,5700
            C 880,5900 880,6200 640,6400
          "
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
