'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

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
 * Hydration-safe: always renders the same DOM structure (motion span wrapper
 * + per-char slots) on server and client. Reduced-motion is respected via
 * `useReducedMotion` inside each FlipSlot — when active, the transition
 * duration drops to 0 (the flip happens instantly), so the structure stays
 * the same but the animation is suppressed.
 *
 * Previously branched the DOM via a lazy `useState` reading window.matchMedia
 * which produced different trees on SSR vs CSR for users with reduced motion.
 */
export function FlipDigits({
  value,
  className,
  flipMs = 320,
  staggerMs = 30,
}: Props) {
  const str = String(value);
  const chars = str.split('');

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
  // `useReducedMotion` is hydration-safe — returns null on SSR and the first
  // client paint, then resolves to true|false after mount. We use it to
  // collapse the flip duration to 0 when the user prefers reduced motion,
  // without ever changing the rendered DOM structure.
  const shouldReduce = useReducedMotion();
  const duration = shouldReduce ? 0 : flipMs / 1000;
  const delay = shouldReduce ? 0 : delayMs / 1000;

  return (
    <span className="relative inline-block" style={{ minWidth: '0.55em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ch}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            duration,
            delay,
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
