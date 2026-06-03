'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type Props = {
  value: number | string;
  className?: string;
  /** Per-digit flip duration in ms. */
  flipMs?: number;
  /** Stagger between adjacent digits (digit position × stagger). */
  staggerMs?: number;
};

/**
 * Split-flap board for a number or short string.
 *
 * Each character lives in its own slot that rotates X -90° → 0° when the
 * underlying value changes. A separate per-position stagger (default 30ms)
 * gives the airport-board cascade.
 *
 * Compared to NumberCounter (which springs a single integer), this is for
 * live values that update over time — the live data ticker, the ROI outputs
 * when sliders move.
 *
 * Respects prefers-reduced-motion by collapsing to a static render.
 */
export function FlipDigits({
  value,
  className,
  flipMs = 320,
  staggerMs = 30,
}: Props) {
  const [reduce] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Split into characters so each can flip independently.
  const str = String(value);
  const chars = str.split('');

  if (reduce) {
    return <span className={className}>{str}</span>;
  }

  return (
    <span
      className={`inline-flex items-baseline ${className ?? ''}`}
      style={{ perspective: 400 }}
    >
      {chars.map((ch, i) => (
        <FlipSlot
          key={`${i}-${ch}`}
          ch={ch}
          delayMs={i * staggerMs}
          flipMs={flipMs}
        />
      ))}
    </span>
  );
}

function FlipSlot({
  ch,
  delayMs,
  flipMs,
}: {
  ch: string;
  delayMs: number;
  flipMs: number;
}) {
  // Each render of a different ch creates a new motion key, triggering the
  // rotateX flip. AnimatePresence swaps the inner span.
  return (
    <span className="relative inline-block" style={{ minWidth: '0.55em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ch}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            duration: flipMs / 1000,
            delay: delayMs / 1000,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{ display: 'inline-block', transformOrigin: 'center' }}
          className="font-mono tabular-nums"
        >
          {ch}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
