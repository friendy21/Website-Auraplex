'use client';

import { useEffect } from 'react';

/**
 * Lenis smooth scrolling, driven by GSAP's ticker.
 *
 * Load strategy — none of this is on the critical path:
 *   · Both libraries are dynamic imports, fetched only after the page has
 *     loaded and the main thread goes idle, so they never touch FCP/LCP/TBT.
 *   · Skipped entirely for reduced-motion users and touch-only devices
 *     (phones keep native momentum scrolling, which Lenis can't beat).
 *
 * Why this coexists with the CSS scroll-driven animations: Lenis moves the
 * real window scroll position every frame, so `animation-timeline: scroll()`
 * / `view()` simply follow a smoothed position instead of stepped wheel
 * notches — the reveals glide rather than jump.
 *
 * GSAP's ticker owns the single rAF loop (Lenis has `autoRaf: false`) and
 * ScrollTrigger is kept in sync, so any GSAP scroll animation added later
 * reads the same smoothed position.
 *
 * Scroll locks: the mobile menu sets `body.style.overflow = 'hidden'` and Radix
 * dialogs set `body[data-scroll-locked]`; Lenis is stopped while either is on.
 * Scrollable panels opt out with `data-lenis-prevent`.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const body = document.body;
      const syncLock = () => {
        const locked = body.style.overflow === 'hidden' || body.hasAttribute('data-scroll-locked');
        if (locked) lenis.stop();
        else lenis.start();
      };
      const lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(body, { attributes: true, attributeFilter: ['style', 'data-scroll-locked'] });
      syncLock();

      cleanup = () => {
        lockObserver.disconnect();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };

    // After load, then after the main thread goes idle.
    let idleId = 0;
    const schedule = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = ric(() => void start(), { timeout: 2500 });
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleId) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      cleanup();
    };
  }, []);

  return null;
}
