'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * ScrollDrawLine — a tall section with an SVG path that draws itself as
 * the user scrolls through it. Cerulean variant of the skiper-ui
 * "Skiper19" pattern (https://skiper-ui.com/v1/skiper19) — same scroll-
 * follow technique, swapped to brand signal colour with a soft glow on
 * the ink background.
 *
 * The section reserves ~280vh of scroll so the draw spans almost three
 * screen heights — long enough to feel like a deliberate transitional
 * moment, short enough not to bore. Path geometry is a flowing S-curve
 * that crosses centre at each junction.
 *
 * Behaviour:
 *   - useScroll target: the section itself, offset start/end so the path
 *     begins drawing as the section enters view (top of section hits
 *     bottom of viewport) and finishes when its bottom exits the top.
 *   - pathLength: linearly mapped from scrollYProgress so scrubbing back
 *     up un-draws the path. No spring — feels physically connected to
 *     scroll.
 *
 * Reduced motion: Motion respects prefers-reduced-motion automatically
 * on `useTransform` outputs that drive `style`, so the path will snap to
 * fully drawn for those users (no animation, no flashing in/out).
 */
export function ScrollDrawLine({
  /** Optional label drawn faintly at the top of the section. */
  label,
}: {
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress into the path-length the motion.path will reveal.
  // Starts at 0 (invisible), ends at 1 (fully drawn). Slight head-room at
  // the top (0.02) so the very first pixel is always faintly visible —
  // gives users a hint that there's something to scroll through.
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative h-[180vh] w-full overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* Optional eyebrow label, fades in with scroll */}
      {label && (
        <div className="sticky top-1/2 -translate-y-1/2 z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-signal)]/70 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]/60" />
            {label}
          </div>
        </div>
      )}

      {/* The drawing canvas — full-bleed SVG, transparent background.
          Position absolute so it spans the entire 280vh section but
          renders behind sticky overlays. */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 1280 3200"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          {/* Soft cerulean glow via SVG filter — keeps the line legible
              against the ink background without needing CSS box-shadow. */}
          <defs>
            <filter id="signal-glow" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing S-curve. The four cubic Bezier segments cross the
              centre four times — creates a sinuous, almost-organic shape
              against the otherwise rectilinear page grid. Y values span
              0 → 3200, X swings 640 ± 480 across the four crossings. */}
          <motion.path
            d="
              M 640,0
              C 1120,400 160,800 640,1200
              C 1120,1600 160,2000 640,2400
              C 880,2700 880,2900 640,3200
            "
            fill="none"
            stroke="#2796df"
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#signal-glow)"
            style={{ pathLength }}
          />

          {/* A second, thinner inner stroke for crispness — the glow on the
              outer stroke softens edges, so layering a sharp inner line
              keeps the path readable. */}
          <motion.path
            d="
              M 640,0
              C 1120,400 160,800 640,1200
              C 1120,1600 160,2000 640,2400
              C 880,2700 880,2900 640,3200
            "
            fill="none"
            stroke="#4eaae9"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />
        </svg>
      </div>
    </section>
  );
}
