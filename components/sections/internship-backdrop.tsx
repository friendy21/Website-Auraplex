import type { CSSProperties } from 'react';

const WORDS = [
  { text: 'BUILD', top: '6%', side: 'left' as const, drift: '-160px' },
  { text: 'ENGINEER', top: '32%', side: 'right' as const, drift: '200px' },
  { text: 'INTERN', top: '58%', side: 'left' as const, drift: '-130px' },
  { text: 'AURAPLEX', top: '82%', side: 'right' as const, drift: '230px' },
];

/**
 * Scroll-reactive backdrop for the internship page — giant outlined words
 * and a blueprint grid drift at different rates as you scroll, giving a
 * sense of depth and motion "behind" the content.
 *
 * Sits in an `absolute inset-0` layer behind the page (content is z-10).
 * Decorative + aria-hidden. transform-only (compositor-friendly).
 *
 * Motion lives in styles/motion/sections.css as a native scroll-driven
 * animation on `scroll(root block)` — the document scroller, which is exactly
 * what the argument-less useScroll() this replaces measured. Each layer's
 * distance is handed to CSS as `--drift`, one per former useTransform.
 *
 * No JS at all now: the component dropped 'use client' along with framer-motion
 * and usePerfTier(). The `tier === 'minimal'` freeze was, by definition,
 * `prefers-reduced-motion`, and the stylesheet gates the whole animation on
 * that media query instead. Devices on the 'lite' tier kept the drift before
 * and still do.
 */
export function InternshipBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Drifting blueprint grid */}
      <div
        style={
          {
            '--drift': '140px',
            backgroundImage:
              'linear-gradient(color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          } as CSSProperties
        }
        className="ib-layer absolute inset-[-15%] opacity-[0.05]"
      />

      {/* Giant outlined words */}
      {WORDS.map((w) => (
        <div
          key={w.text}
          style={{ top: w.top, '--drift': w.drift } as CSSProperties}
          className={`ib-layer absolute ${
            w.side === 'left' ? 'left-[-1%]' : 'right-[-1%]'
          } font-display leading-none select-none`}
        >
          <span
            className="block text-[clamp(4rem,14vw,13rem)] tracking-[-0.04em] text-transparent opacity-[0.06]"
            style={{
              WebkitTextStroke:
                '1px color-mix(in oklab, var(--color-signal) 70%, transparent)',
            }}
          >
            {w.text}
          </span>
        </div>
      ))}
    </div>
  );
}
