'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDragRotate } from '@/components/motion/use-drag-rotate';

type Item = { image: string; slug: string; name: string };
type Slide = { title: string; desc: string };
type Props = { items: Item[]; slides: Slide[] };

const CARD_COUNT = 24;
const RADIUS = 360;

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
 * MachineSphere — a draggable 3D Fibonacci sphere of machine photos. Grab it
 * to spin (free X/Y); it idles with a slow auto-rotation and throws with
 * momentum on release (useDragRotate). Each card links to its machine. The
 * caption cycles slowly. Faithful to dermalhealth/KwNXWZb's sphere, made
 * directly interactive instead of scroll-scrubbed.
 *
 * Mobile / reduced-motion: a static photo grid (drag/3D skipped).
 */
export function MachineSphere({ items, slides }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const sphere = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const moved = useDragRotate(stage, sphere, {
    allowVertical: true,
    dragRatio: 0.28,
    idleSpeed: 360 / 60000,
  });

  // Gentle caption cycle (decoupled from rotation).
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      4200,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const cards = Array.from({ length: CARD_COUNT }, (_, i) => items[i % items.length]);
  if (!items.length) return null;

  return (
    <section className="relative bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
      {/* Draggable sphere (desktop) */}
      <div
        ref={stage}
        className="relative hidden md:block h-[82vh] overflow-hidden select-none"
        style={{ perspective: '1200px', cursor: 'grab', touchAction: 'pan-y' }}
        onClickCapture={(e) => {
          if (moved.current > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="absolute left-6 lg:left-[8%] top-1/2 -translate-y-1/2 z-10 max-w-xs pointer-events-none">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — Auraplex · drag to spin
          </div>
          <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] tracking-[-0.02em] leading-[1.02] mb-3">
            {slides[active]?.title}
          </h2>
          <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
            {slides[active]?.desc}
          </p>
        </div>

        {/* Centred at the stage middle */}
        <div className="absolute left-1/2 top-1/2">
          <div
            ref={sphere}
            className="relative"
            style={{ width: 0, height: 0, transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {cards.map((m, i) => (
              <Link
                key={i}
                href={`/products/${m.slug}`}
                data-cursor="caliper"
                aria-label={m.name}
                draggable={false}
                className="group absolute h-[200px] w-[150px] -left-[75px] -top-[100px] rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-2 shadow-[8px_8px_24px_rgba(0,0,0,0.6)] transition-[border-color] duration-300 hover:border-[color:var(--color-signal)]"
                style={{ transform: cardTransform(i), transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  draggable={false}
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
        <h2 className="font-display text-3xl tracking-[-0.02em] mb-8">{slides[0]?.title}</h2>
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
