'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
 * Panel timing. MUST stay in sync with `.page-reveal` in
 * styles/motion/transitions.css.
 */
const PANEL_DELAY_MS = 50;
const PANEL_DURATION_MS = 720;
/**
 * Hard unmount deadline. `setTimeout` fires whether or not the CSS animation
 * ever ran, so the panel cannot outlive this even if the stylesheet is
 * missing, animations are disabled, or `animationend` never arrives. This is
 * the animation-independent half of the removal guarantee; the other half is
 * the at-rest off-screen transform (see below).
 */
const UNMOUNT_AFTER_MS = PANEL_DELAY_MS + PANEL_DURATION_MS + 80;

/**
 * PageTransition — the site's signature route reveal. On each in-app
 * navigation an ink panel (with the wordmark + a cerulean leading edge)
 * covers the viewport for a beat, then slides up to reveal the already
 * server-rendered page beneath.
 *
 * Award-craft + performance discipline (per the research):
 *   - Pure CSS keyframes (styles/motion/transitions.css). A fresh DOM node
 *     runs its animation from the top, and `template.tsx` + `key={pathname}`
 *     guarantee a fresh node per navigation — so no motion library, no JS
 *     clock, no animation runtime on the critical path.
 *   - Drives the panel with `transform: translateY` only — compositor-friendly,
 *     no layout/paint thrash, no `filter`/`clip-path` animation.
 *   - Skips entirely on first load (no LCP penalty) and unmounts when done.
 *   - Fully disabled under prefers-reduced-motion (WCAG 2.3.3).
 *   - The page content (children) is always rendered and fully opaque, so
 *     crawlers and the LCP element are never gated behind the animation.
 *
 * NEVER let this panel become reachable in a state where it covers the page:
 * it is a full-screen opaque element. Three independent guarantees keep that
 * impossible — the timeout above, the at-rest `translateY(-100%)` set both
 * inline and in the stylesheet, and `pointer-events: none`.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [play] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (!hasNavigated) return false; // first load → no reveal
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [done, setDone] = useState(!play);

  useEffect(() => {
    hasNavigated = true;
    if (!play) return;
    const id = window.setTimeout(() => setDone(true), UNMOUNT_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [play]);

  return (
    <>
      {children}
      {play && !done && (
        <div
          key={pathname}
          aria-hidden="true"
          /* Belt-and-braces at-rest state: off-screen even if
             transitions.css is not loaded. CSS animations outrank the style
             attribute in the cascade, so `.page-reveal` still drives the
             reveal while it runs. */
          style={{ transform: 'translateY(-100%)' }}
          className="page-reveal fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--color-ink)] pointer-events-none will-change-transform"
        >
          {/* Cerulean leading edge */}
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[color:var(--color-signal)]" />
          <span className="page-reveal-wordmark font-display text-[clamp(2rem,6vw,4rem)] tracking-[-0.03em] text-[color:var(--color-paper)]">
            Auraplex
          </span>
        </div>
      )}
    </>
  );
}
