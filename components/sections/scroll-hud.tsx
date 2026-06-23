'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

type Props = { label: string };

/**
 * ScrollHud — a fixed cinematic HUD overlay: corner telemetry readouts + a
 * live scroll-progress bar and percentage. Faithful to the *HUD* layer of
 * aleksa-rakocevic/pvbboZx ("Hyper Scroll"), minus its full-page 3D world
 * flythrough and the feTurbulence noise overlay (which this codebase removed
 * for performance — see atmosphere-provider). Desktop-only, pointer-events
 * none, reduced-motion safe (the bar is scroll-linked, not time-animated).
 */
export function ScrollHud({ label }: Props) {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const p = Math.round(v * 100);
    setPct((prev) => (prev === p ? prev : p));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
    >
      {/* Top scroll-progress line */}
      <motion.div
        style={{ scaleX: scrollYProgress, originX: 0 }}
        className="absolute top-0 left-0 right-0 h-px bg-[color:var(--color-signal)]"
      />

      {/* Top-left identity */}
      <div className="absolute top-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/45">
        {label}
      </div>

      {/* Top-right REC + scroll % */}
      <div className="absolute top-5 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)] animate-pulse" />
        REC · {String(pct).padStart(3, '0')}%
      </div>

      {/* Bottom telemetry (real Seri Kembangan coordinates) */}
      <div className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/40">
        LAT 3.02°N · LON 101.71°E
      </div>
      <div className="absolute bottom-5 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/40">
        Selangor · MY
      </div>

      {/* Corner brackets */}
      <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[color:var(--color-ink)]/25" />
      <span className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[color:var(--color-ink)]/25" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[color:var(--color-ink)]/25" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[color:var(--color-ink)]/25" />
    </div>
  );
}
