'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Slide = { title: string; desc: string };

type Item = { image: string; slug: string; name: string };

type Props = {
  items: Item[];
  slides: Slide[];
};

const CARD_COUNT = 24;
const RADIUS = 360; // fixed → deterministic SSR; scaled down on small screens via CSS

// Fibonacci-sphere placement (deterministic — no Math.random, SSR-safe).
function cardTransform(i: number): string {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / CARD_COUNT);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const x = RADIUS * Math.cos(theta) * Math.sin(phi);
  const y = RADIUS * Math.sin(theta) * Math.sin(phi);
  const z = RADIUS * Math.cos(phi);
  const rotY = Math.atan2(x, z) * (180 / Math.PI);
  const rotX = Math.asin(-y / RADIUS) * (180 / Math.PI);
  return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;
}

/**
 * MachineSphere — a rotating 3D Fibonacci sphere of machine photos, scrubbed
 * by GSAP ScrollTrigger over a tall sticky section, with a centered caption
 * that changes as it spins. Faithful adaptation of dermalhealth/KwNXWZb
 * ("Capturing moments gallery carousel: GSAP"), rebranded to Auraplex.
 *
 * Perf/a11y (matches scroll-narrative's policy): on mobile or reduced-motion
 * the immersive scroll-spin is skipped entirely and a static photo grid is
 * shown instead — no pinned scrub timeline on low-power devices. Uses a tall
 * runway + CSS sticky (no GSAP pin) to stay CLS-safe.
 */
export function MachineSphere({ items, slides }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const sphere = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lastIdx = useRef(0);

  const cards = Array.from(
    { length: CARD_COUNT },
    (_, i) => items[i % items.length],
  );

  useGSAP(
    () => {
      if (!container.current || !sphere.current) return;

      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const prefersReduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // The immersive sphere only runs on capable, motion-OK desktops. The
      // static fallback grid (rendered below) covers everyone else.
      if (isMobile || prefersReduce) return;

      gsap.to(sphere.current, {
        rotateY: 720,
        rotateX: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const idx =
              Math.floor(self.progress * slides.length) % slides.length;
            if (idx !== lastIdx.current) {
              lastIdx.current = idx;
              setActive(idx);
            }
          },
        },
      });
    },
    { scope: container, dependencies: [slides.length] },
  );

  if (!items.length) return null;

  return (
    <section className="relative bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
      {/* Immersive sphere (desktop / motion-OK) */}
      <div ref={container} className="relative hidden md:block h-[280vh]">
        <div
          className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          {/* Faint grid wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          {/* Centered caption */}
          <div className="absolute left-6 lg:left-[8%] top-1/2 -translate-y-1/2 z-10 max-w-xs pointer-events-none">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
              — Auraplex · 2026
            </div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] tracking-[-0.02em] leading-[1.02] mb-3">
              {slides[active]?.title}
            </h2>
            <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
              {slides[active]?.desc}
            </p>
          </div>

          {/* The sphere */}
          <div
            ref={sphere}
            className="relative"
            style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}
          >
            {cards.map((m, i) => (
              <Link
                key={i}
                href={`/products/${m.slug}`}
                data-cursor="caliper"
                aria-label={m.name}
                className="group absolute block h-[220px] w-[160px] -left-20 -top-[110px] rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-2 shadow-[8px_8px_24px_rgba(0,0,0,0.6)] transition-[border-color] duration-300 hover:border-[color:var(--color-signal)]"
                style={{ transform: cardTransform(i), transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover [filter:brightness(0.82)] transition-[filter] duration-300 group-hover:brightness-100"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback (mobile / reduced-motion) */}
      <div className="md:hidden mx-auto max-w-[1600px] px-6 py-24">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — Auraplex · 2026
        </div>
        <h2 className="font-display text-3xl tracking-[-0.02em] mb-8">
          {slides[0]?.title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.slice(0, 9).map((m, i) => (
            <Link
              key={i}
              href={`/products/${m.slug}`}
              aria-label={m.name}
              className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
