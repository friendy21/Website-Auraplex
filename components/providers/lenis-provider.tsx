'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Module-level scroll-velocity ref. Lenis writes to this on every scroll
 * tick (cheap, no React re-renders). Anyone who needs scroll velocity
 * (ParticleMesh, etc.) reads it from here every frame. Velocity is in
 * pixels-per-frame at 60fps — typical range 0–80 during fast scroll.
 */
export const lenisScrollVel: { current: number } = { current: 0 };

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Scroll velocity → CSS var. Elements with class `scroll-blur` will
    // pick this up via filter: blur(var(--scroll-blur)) (see globals.css).
    // Clamped to 6px so it never destroys legibility.
    // Track velocity in a module-level ref for downstream consumers.
    let last = 0;
    let signedVel = 0;
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      const d = scroll - last;
      last = scroll;
      lenisScrollVel.current = Math.abs(d);
      signedVel = d;
    });

    // ── Velocity lean ──
    // The signature "site has physics" move: scroll speed skews the big
    // display surfaces (marquees, wordmark bands) by up to ±2.5°, then
    // springs back to level when scrolling stops. One CSS variable
    // written per ticker frame; consumers opt in with the .lean class
    // (transform-only — composited, no layout). The spring runs in the
    // same GSAP ticker that drives Lenis, so there's no extra rAF loop.
    let skew = 0;
    const raf = (time: number) => {
      lenis.raf(time * 1000);
      const target = Math.max(-2.5, Math.min(2.5, signedVel * 0.06));
      signedVel *= 0.82; // decay the impulse so lean releases smoothly
      skew += (target - skew) * 0.12;
      if (Math.abs(skew) < 0.005 && skew !== 0) skew = 0;
      document.documentElement.style.setProperty(
        '--scroll-skew',
        `${skew.toFixed(3)}deg`,
      );
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
