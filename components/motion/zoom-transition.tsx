'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  /** Image path (e.g. /products/Flexy_Applicator_11.png) */
  image: string;
  alt: string;
  /** Content that fades up over the dimmed image in Phase 3 */
  children: ReactNode;
  /** Total scroll length the pin consumes (desktop only). Default 2400 px. */
  scrollLength?: number;
  /** Image's initial scale before zoom-in starts. Default 0.14. */
  startScale?: number;
}

/**
 * Snowhouse-style zoom-to-fullbleed transition between sections.
 *
 * Phase 1 (0–35 %): the image — initially a thumbnail in the center —
 *                   scales up to fill the viewport while its border radius
 *                   shrinks to zero. Reads as "shutter closing."
 * Phase 2 (35–55%): image holds full-bleed, "arrived."
 * Phase 3 (55–80%): children content fades up from below; the image dims
 *                   under an ink veil and becomes a tinted backdrop.
 * Phase 4 (80–100%): ink floods, ready to hand off to the next section.
 *
 * Mobile behavior
 *   GSAP pinning is unreliable on iOS Safari (rubber-band scroll fights the
 *   pin). On viewports < 768 px we DO NOT pin — the section becomes a normal
 *   100dvh block that fades + scales in lightly on enter via Motion's
 *   prefers-reduced-motion-respecting useInView pattern (effectively a
 *   single-frame degraded version of the same effect).
 *
 * Reduced motion
 *   Skips the GSAP timeline entirely. Final state shows: image full-bleed
 *   at 0.7 opacity with the content overlaid. No zoom, no scrub.
 */
export function ZoomTransition({
  image,
  alt,
  children,
  scrollLength = 2400,
  startScale = 0.14,
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Guard: skip pinned scroll-driven animation on mobile + reduced-motion
      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const prefersReduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReduce) {
        // Degraded final state — image at 1, content visible, soft veil
        gsap.set('.zt-image-wrap', { scale: 1, borderRadius: 0 });
        gsap.set('.zt-image-overlay', { opacity: 0.7 });
        gsap.set('.zt-content', { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: `+=${scrollLength}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      });

      // Phase 1: zoom in
      tl.fromTo(
        '.zt-image-wrap',
        { scale: startScale, borderRadius: '6px' },
        { scale: 1, borderRadius: '0px', duration: 0.35, ease: 'power2.out' },
      )
        // Phase 2: hold (20% of timeline)
        .to('.zt-image-wrap', { scale: 1, duration: 0.2 })
        // Phase 3: content fades up while image dims
        .fromTo(
          '.zt-content',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.3 },
          '<0.1',
        )
        .to('.zt-image-overlay', { opacity: 0.72, duration: 0.3 }, '<')
        // Phase 4: ink flood for clean handoff to next section
        .to('.zt-ink-flood', { opacity: 1, duration: 0.15 }, '+=0.15');
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative h-[100dvh] overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* The zooming image */}
      <div
        className="zt-image-wrap absolute inset-0 overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
      {/* Ink veil appears as image dims */}
      <div className="zt-image-overlay absolute inset-0 bg-[color:var(--color-ink)] opacity-0 pointer-events-none" />
      {/* Final ink flood for the section handoff */}
      <div className="zt-ink-flood absolute inset-0 bg-[color:var(--color-ink)] opacity-0 pointer-events-none" />
      {/* Editorial content overlays the dimmed image */}
      <div className="zt-content relative z-10 h-full flex items-center">
        {children}
      </div>
    </div>
  );
}
