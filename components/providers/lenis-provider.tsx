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
    let last = 0;
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      const v = Math.abs(scroll - last);
      last = scroll;
      lenisScrollVel.current = v;
      const blur = Math.min(v * 0.08, 6);
      document.documentElement.style.setProperty('--scroll-blur', `${blur}px`);
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
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
