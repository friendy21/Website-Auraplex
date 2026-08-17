'use client';

import { useState, type CSSProperties } from 'react';

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
 * underlying value changes. A per-position stagger (default 30ms) gives the
 * airport-board cascade. All of that now lives in styles/motion/numbers.css —
 * see that file for the keyframes and the framer archaeology.
 *
 * ── WHAT CHANGED ──────────────────────────────────────────────────────────
 * The framer version mounted an <AnimatePresence> plus a <motion.span> per
 * character. It also never animated: `AnimatePresence initial={false}`
 * suppresses the `initial` state for children present on its first render, and
 * because the character was part of the FlipSlot `key`, every character change
 * remounted the slot and handed its AnimatePresence a fresh first render. The
 * `exit` variant was likewise unreachable — nothing wrapped the slots in an
 * AnimatePresence, so they unmounted instantly.
 *
 * So this conversion keeps the first paint byte-for-byte as it ships today —
 * static, fully opaque, no animation — and makes the flip fire on an actual
 * value change, which is what the per-position stagger was written for. The
 * only current call site (LiveDataTicker) passes constants, so nothing on the
 * live site moves that did not move before.
 *
 * Hydration-safe: `gen` is 0 on the server and on the first client render, so
 * the markup matches exactly and no animation class is emitted.
 */
export function FlipDigits({
  value,
  className,
  flipMs = 320,
  staggerMs = 30,
}: Props) {
  const str = String(value);
  const chars = str.split('');

  // `gen` bumps once per value change and is folded into the slot keys, so a
  // change remounts every slot — a fresh element runs its CSS animation on
  // mount, which is the whole trigger mechanism. While `gen` is 0 (first
  // render, and every render until the value first changes) no animation class
  // is applied, reproducing today's static board.
  //
  // This is React's sanctioned "adjust state during render" pattern rather
  // than an effect: it re-runs this component before the commit, so a value
  // change never paints an un-animated intermediate frame.
  const [board, setBoard] = useState({ seen: str, gen: 0 });
  if (board.seen !== str) {
    setBoard((b) => ({ seen: str, gen: b.gen + 1 }));
  }
  const { gen } = board;

  return (
    <span
      className={`flip-digits inline-flex items-baseline ${className ?? ''}`}
      style={
        {
          '--flip-dur': `${flipMs}ms`,
          '--flip-stagger': `${staggerMs}ms`,
        } as CSSProperties
      }
    >
      {chars.map((ch, i) => (
        // `relative inline-block` stay as utilities so the box model survives
        // even if the motion stylesheet is absent; .flip-slot adds the
        // min-width reservation.
        <span key={`${gen}-${i}-${ch}`} className="relative inline-block flip-slot">
          <span
            className={`inline-block font-mono tabular-nums flip-char${
              gen === 0 ? '' : ' flip-char--in'
            }`}
            style={{ '--flip-i': i } as CSSProperties}
          >
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}
