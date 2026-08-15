'use client';

import { useEffect } from 'react';

/**
 * LeanProvider — the LEAN physics tell, and nothing else.
 *
 * Replaces LenisProvider, which pulled in BOTH `lenis` and `gsap` (+ScrollTrigger)
 * on every route in the app just to (a) smooth the scroll and (b) write one CSS
 * variable. Two reasons that was the wrong trade:
 *
 *   1. PERF — it put ~110KB of library into the shared layout chunk that every
 *      page paid for, plus a permanent per-frame rAF loop for the life of the
 *      session.
 *   2. CORRECTNESS — Lenis interpolates scroll position in JS, which desynchronises
 *      native CSS scroll-driven animations (`animation-timeline: scroll()/view()`).
 *      Those are now the site's primary motion engine, so smooth-scroll hijacking
 *      actively fights the design. Native scroll also restores correct iOS
 *      momentum, trackpad feel and overscroll on the global audience's devices.
 *
 * What survives is LEAN: scroll velocity skews the big display surfaces (the
 * marquee bands, via `.lean`) by up to ±2.5°, then springs back to level — the
 * one effect that makes the site feel like it has mass. ~1KB, no dependencies.
 *
 * Reduced-motion: the loop never starts, and the variable stays 0deg.
 */
export function LeanProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Nothing to drive if no surface opted in.
    if (!document.querySelector('.lean')) return;

    const root = document.documentElement;
    let last = window.scrollY;
    let velocity = 0;
    let skew = 0;
    let raf = 0;
    let idle = 0;

    const frame = () => {
      const y = window.scrollY;
      velocity = velocity * 0.82 + (y - last);
      last = y;

      const target = Math.max(-2.5, Math.min(2.5, velocity * 0.06));
      skew += (target - skew) * 0.12;

      if (Math.abs(skew) < 0.005) {
        skew = 0;
        // Park the loop once the surface is level and the user has stopped —
        // no permanent every-frame work when nothing is moving.
        if (++idle > 20) {
          root.style.setProperty('--scroll-skew', '0deg');
          raf = 0;
          return;
        }
      } else {
        idle = 0;
      }

      root.style.setProperty('--scroll-skew', `${skew.toFixed(3)}deg`);
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener('scroll', wake, { passive: true });
    return () => {
      window.removeEventListener('scroll', wake);
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty('--scroll-skew');
    };
  }, []);

  return <>{children}</>;
}
