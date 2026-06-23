'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  image: string;
  text: string;
};

const REPS = 14;

/**
 * ParallaxMarqueeBand — a full-bleed image that parallaxes on scroll with an
 * arched SVG text marquee scrolling across it. Faithful to the *visible*
 * signature of joebentaylor/emBEyNa (parallax hero + radial text marquee),
 * minus its infinite-scroll Lenis hijack, which would conflict with this
 * site's global smooth-scroll.
 *
 * Reduced-motion: parallax + marquee freeze (transform/attr only otherwise).
 */
export function ParallaxMarqueeBand({ image, text }: Props) {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const tp = useRef<SVGTextPathElement>(null);
  const phrase = ` ${text}   ✦  `.repeat(REPS);

  useGSAP(
    () => {
      if (!root.current) return;
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      // Parallax the oversized image as the band passes through the viewport.
      if (img.current) {
        gsap.fromTo(
          img.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      // Seamless arched marquee — shift startOffset by one repeat unit.
      if (tp.current && tp.current.getComputedTextLength) {
        const total = tp.current.getComputedTextLength();
        const unit = total / REPS;
        if (unit > 0) {
          const proxy = { x: 0 };
          gsap.to(proxy, {
            x: unit,
            duration: unit / 90,
            ease: 'none',
            repeat: -1,
            onUpdate: () => {
              tp.current?.setAttribute('startOffset', `${-(proxy.x % unit)}px`);
            },
          });
        }
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[60vh] min-h-[420px] overflow-hidden bg-[color:var(--color-ink)]"
      aria-label={text}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover [filter:brightness(0.45)_grayscale(0.2)]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-[color:var(--color-ink)]/70" />

      {/* Arched scrolling marquee */}
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <path id="amq-arc" d="M -120 300 Q 600 110 1320 300" fill="none" />
        </defs>
        <text
          className="font-display fill-[color:var(--color-signal)]"
          style={{ fontSize: 58, letterSpacing: '0.04em', opacity: 0.9 }}
        >
          <textPath ref={tp} href="#amq-arc" startOffset="0px">
            {phrase}
          </textPath>
        </text>
      </svg>
    </section>
  );
}
