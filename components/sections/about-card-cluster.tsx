'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  images: string[];
  eyebrow: string;
  heading: string;
  sub: string;
};

// Rest cluster offset (px from centre) + scroll fan-out offset, per card.
const CARDS = [
  { rx: -340, ry: -30, rot: -12, fx: -270, fy: -50, frot: -16 },
  { rx: -230, ry: 60, rot: -7, fx: -200, fy: 30, frot: -12 },
  { rx: -120, ry: -70, rot: 5, fx: -130, fy: 90, frot: -8 },
  { rx: -40, ry: 30, rot: -3, fx: -50, fy: 130, frot: -3 },
  { rx: 60, ry: -40, rot: 4, fx: 50, fy: 130, frot: 3 },
  { rx: 150, ry: 55, rot: -5, fx: 130, fy: 90, frot: 8 },
  { rx: 250, ry: -20, rot: 8, fx: 200, fy: 30, frot: 13 },
  { rx: 340, ry: 40, rot: -9, fx: 270, fy: -50, frot: 17 },
];

/**
 * AboutCardCluster — a cluster of machine-photo cards that fly in on load,
 * then fan outward as the section scrolls while the heading behind them
 * scales up and fades. Faithful adaptation of dermalhealth/KwNNbYZ
 * ("GSAP carousel / gallery" hero), rebranded to Auraplex.
 *
 * Rest position + hover use the independent CSS translate/rotate/scale
 * properties, so they compose cleanly with GSAP's animated `transform`
 * (intro + fan-out). Per the codebase's perf policy, mobile / reduced-motion
 * skip GSAP entirely: the cluster falls back to its static CSS rest layout,
 * and small screens render a simple photo grid instead.
 */
export function AboutCardCluster({ images, eyebrow, heading, sub }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isMobile || reduce) return;

      // Intro — fly in from above, staggered from the centre.
      gsap.from('.acc-card', {
        y: -480,
        opacity: 0,
        scale: 0.7,
        rotation: 18,
        duration: 1.1,
        stagger: { each: 0.07, from: 'center' },
        ease: 'back.out(1.4)',
      });

      // Scroll — cards fan out, heading scales up + fades.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          const cards = root.current!.querySelectorAll<HTMLElement>('.acc-card');
          cards.forEach((card, i) => {
            const m = CARDS[i % CARDS.length];
            gsap.set(card, { x: m.fx * p, y: m.fy * p, rotation: m.frot * p });
          });
          gsap.set('.acc-heading', { scale: 1 + 0.12 * p, opacity: 1 - 0.55 * p });
        },
      });
    },
    { scope: root },
  );

  if (!images.length) return null;

  return (
    <section className="relative bg-[color:var(--color-ink)] text-[color:var(--color-paper)] overflow-hidden">
      {/* Immersive cluster (desktop / motion-OK) */}
      <div ref={root} className="relative hidden md:block h-[180vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Heading behind the cards */}
          <div className="acc-heading relative z-0 text-center px-6 max-w-3xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5">
              — {eyebrow}
            </div>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.03em] leading-[0.95]">
              {heading}
            </h2>
            <p className="mt-6 mx-auto max-w-md text-[color:var(--color-steel-soft)]">
              {sub}
            </p>
          </div>

          {/* Centred 0×0 anchor; cards offset from it */}
          <div className="absolute left-1/2 top-1/2 z-10">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className="acc-card absolute -left-[75px] -top-[105px] h-[210px] w-[150px] rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-2 shadow-[8px_8px_28px_rgba(0,0,0,0.6)] [transition:scale_0.4s_ease] hover:z-20 hover:[scale:1.1]"
                style={{
                  translate: `${c.rx}px ${c.ry}px`,
                  rotate: `${c.rot}deg`,
                  willChange: 'transform',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[i % images.length]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover [filter:brightness(0.88)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback (mobile / reduced-motion) */}
      <div className="md:hidden mx-auto max-w-[1600px] px-6 py-24">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — {eyebrow}
        </div>
        <h2 className="font-display text-3xl tracking-[-0.02em] mb-8">{heading}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.slice(0, 6).map((src, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
