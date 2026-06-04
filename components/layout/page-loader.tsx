'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * First-mount brand loader.
 *
 *  0–400ms   Signal dot pulses with spring physics. 40px SVG ring traces
 *            itself via stroke-dashoffset.
 *  400–650ms Ring explodes outward (scale 1→3, opacity→0). Incoming page
 *            does a micro-landing zoom (scale 1.02→1) so the user feels
 *            the content "arrive" rather than just appear.
 *
 * On unsupported platforms (reduced-motion) the loader resolves instantly
 * to a static mark for 200ms, then dismisses.
 */
export function PageLoader() {
  const [done, setDone] = useState(false);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      const t = setTimeout(() => setDone(true), 200);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setExplode(true), 420);
    const t2 = setTimeout(() => setDone(true), 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[color:var(--color-ink)] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <div className="relative flex items-center justify-center">
            {/* Exploding ring */}
            <motion.svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="absolute"
              initial={{ scale: 1, opacity: 1, rotate: -90 }}
              animate={
                explode
                  ? { scale: 3, opacity: 0, rotate: 0 }
                  : { scale: 1, opacity: 1, rotate: -90 }
              }
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="1.5"
                strokeDasharray={226}
                strokeDashoffset={0}
                style={{
                  animation: 'ring-trace 500ms ease-out forwards',
                }}
              />
            </motion.svg>

            {/* Pulsing dot */}
            <motion.div
              className="h-3 w-3 bg-[color:var(--color-signal)]"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Wordmark */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
              className="absolute top-full mt-5 font-mono uppercase tracking-[0.4em] text-sm text-[color:var(--color-paper)]"
            >
              Auraplex
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
