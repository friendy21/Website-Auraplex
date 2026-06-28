'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

/**
 * Module-level flag — false only on the very first client mount of the app.
 * Next.js `template.tsx` remounts on every navigation but the JS context
 * persists across client-side route changes, so this stays true after the
 * first paint. We use it to SKIP the reveal on initial load (the overlay
 * would otherwise cover the LCP hero and delay it), and play it only on
 * subsequent in-app navigations — where it costs nothing for Core Web Vitals.
 */
let hasNavigated = false;

/**
 * PageTransition — the site's signature route reveal. On each in-app
 * navigation an ink panel (with the wordmark + a cerulean leading edge)
 * covers the viewport for a beat, then slides up to reveal the already
 * server-rendered page beneath.
 *
 * Award-craft + performance discipline (per the research):
 *   - Drives the panel with `transform: translateY` only — compositor-friendly,
 *     no layout/paint thrash, no `filter`/`clip-path` animation.
 *   - Skips entirely on first load (no LCP penalty) and unmounts when done.
 *   - Fully disabled under prefers-reduced-motion (WCAG 2.3.3).
 *   - The page content (children) is always rendered and fully opaque, so
 *     crawlers and the LCP element are never gated behind the animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [play] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (!hasNavigated) return false; // first load → no reveal
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [done, setDone] = useState(!play);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {children}
      {play && !done && (
        <motion.div
          aria-hidden="true"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          onAnimationComplete={() => setDone(true)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--color-ink)] pointer-events-none will-change-transform"
        >
          {/* Cerulean leading edge */}
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[color:var(--color-signal)]" />
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0], y: 0 }}
            transition={{ duration: 0.72, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
            className="font-display text-[clamp(2rem,6vw,4rem)] tracking-[-0.03em] text-[color:var(--color-paper)]"
          >
            Auraplex
          </motion.span>
        </motion.div>
      )}
    </>
  );
}
