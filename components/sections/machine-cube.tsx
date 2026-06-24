'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useDragRotate } from '@/components/motion/use-drag-rotate';

type Face = { image: string; label: string; slug: string };
type Props = { faces: Face[] }; // exactly 6

const S = 340; // cube edge (px)
const H = S / 2;

const FACE_TF = [
  `translateZ(${H}px)`, // 0 front
  `rotateY(90deg) translateZ(${H}px)`, // 1 right
  `rotateY(180deg) translateZ(${H}px)`, // 2 back
  `rotateY(-90deg) translateZ(${H}px)`, // 3 left
  `rotateX(90deg) translateZ(${H}px)`, // 4 top
  `rotateX(-90deg) translateZ(${H}px)`, // 5 bottom
];

/**
 * MachineCube — a draggable 3D cube whose six faces are machine photos. Grab
 * to rotate freely (X/Y), idles with a slow auto-rotation, throws with
 * momentum on release (useDragRotate). Each face links to its machine.
 * Faithful to luis-lessrain/ZYpyoRV's cube, made directly interactive
 * instead of scroll-scrubbed.
 *
 * Mobile / reduced-motion: a static 6-image grid.
 */
export function MachineCube({ faces }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const six = faces.slice(0, 6);

  const moved = useDragRotate(stage, cube, {
    allowVertical: true,
    dragRatio: 0.32,
    idleSpeed: 360 / 55000,
    baseTransform: `translateZ(-${H}px)`,
    initialX: -18,
  });

  if (six.length < 6) return null;

  return (
    <section className="relative bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
      {/* Draggable cube (desktop) */}
      <div
        ref={stage}
        className="relative hidden md:block h-[82vh] overflow-hidden select-none flex items-center justify-center"
        style={{ perspective: '1400px', cursor: 'grab', touchAction: 'pan-y' }}
        onClickCapture={(e) => {
          if (moved.current > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-signal)]">
            Drag to rotate · 6 machines
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -ml-[170px] -mt-[170px]">
          <div
            ref={cube}
            className="relative"
            style={{
              width: S,
              height: S,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              transform: `translateZ(-${H}px)`,
            }}
          >
            {six.map((face, i) => (
              <Link
                key={i}
                href={`/products/${face.slug}`}
                data-cursor="caliper"
                aria-label={face.label}
                draggable={false}
                className="absolute inset-0 block overflow-hidden rounded-2xl border border-[color:var(--color-signal)]/30 bg-[color:var(--color-neutral-800)]"
                style={{ transform: FACE_TF[i], backfaceVisibility: 'hidden' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={face.image}
                  alt={face.label}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover [filter:brightness(0.8)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-paper)]">
                  {face.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback (mobile / reduced-motion) */}
      <div className="md:hidden mx-auto max-w-[1600px] px-6 py-24 grid grid-cols-2 gap-3">
        {six.map((face, i) => (
          <Link
            key={i}
            href={`/products/${face.slug}`}
            aria-label={face.label}
            className="relative aspect-square overflow-hidden rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={face.image} alt={face.label} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-paper)] bg-[color:var(--color-ink)]/70 px-2 py-1">
              {face.label}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
