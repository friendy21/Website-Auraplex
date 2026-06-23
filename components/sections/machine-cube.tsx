'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Face = { image: string; label: string };

type Props = { faces: Face[] }; // exactly 6

const S = 340; // cube edge (px)
const H = S / 2;

// Standard cube face placements.
const FACE_TF = [
  `translateZ(${H}px)`, // 0 front
  `rotateY(90deg) translateZ(${H}px)`, // 1 right
  `rotateY(180deg) translateZ(${H}px)`, // 2 back
  `rotateY(-90deg) translateZ(${H}px)`, // 3 left
  `rotateX(90deg) translateZ(${H}px)`, // 4 top
  `rotateX(-90deg) translateZ(${H}px)`, // 5 bottom
];

// Cube rotation that brings each face to the front, in scroll order.
const STOPS = [
  { rx: 0, ry: 0 }, // front
  { rx: 0, ry: -90 }, // right
  { rx: 0, ry: -180 }, // back
  { rx: 0, ry: -270 }, // left
  { rx: -90, ry: -360 }, // top
  { rx: 90, ry: -360 }, // bottom
];

const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/**
 * MachineCube — a 3D cube whose six faces (machine photos) rotate past the
 * camera as you scroll. Faithful to the cube centerpiece of luis-lessrain/
 * ZYpyoRV ("Six Faces"), but driven by GSAP ScrollTrigger scrub rather than
 * the pen's custom wheel-hijack momentum engine (which would conflict with
 * this site's Lenis smooth-scroll). Rebranded to Auraplex.
 *
 * Mobile / reduced-motion: skips GSAP and shows the six faces as a static
 * grid (codebase perf policy). CSS-sticky runway, no GSAP pin (CLS-safe).
 */
export function MachineCube({ faces }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);
  const lastStop = useRef(0);
  const six = faces.slice(0, 6);

  useGSAP(
    () => {
      if (!container.current || !cube.current) return;
      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isMobile || reduce) return;

      const proxy = { t: 0 };
      const n = STOPS.length;
      gsap.to(proxy, {
        t: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            const s = self.progress;
            const x = s * (n - 1);
            const i = Math.min(Math.floor(x), n - 2);
            const f = easeIO(x - i);
            const a = STOPS[i];
            const b = STOPS[i + 1];
            const rx = a.rx + (b.rx - a.rx) * f;
            const ry = a.ry + (b.ry - a.ry) * f;
            if (cube.current) {
              cube.current.style.transform = `translateZ(-${H}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
            }
            const idx = Math.min(n - 1, Math.round(x));
            if (idx !== lastStop.current) {
              lastStop.current = idx;
              setStop(idx);
            }
          },
        },
      });
    },
    { scope: container, dependencies: [six.length] },
  );

  if (six.length < 6) return null;

  return (
    <section className="relative bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
      {/* Immersive cube (desktop / motion-OK) */}
      <div ref={container} className="relative hidden md:block h-[260vh]">
        <div
          className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          {/* HUD caption */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-signal)]">
              {String(stop + 1).padStart(2, '0')} / 06
            </div>
            <div className="font-display text-2xl tracking-[-0.01em] mt-2">
              {six[stop]?.label}
            </div>
          </div>

          {/* Cube */}
          <div
            ref={cube}
            className="relative"
            style={{
              width: S,
              height: S,
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${H}px)`,
            }}
          >
            {six.map((face, i) => (
              <div
                key={i}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-[color:var(--color-signal)]/30 bg-[color:var(--color-neutral-800)]"
                style={{ transform: FACE_TF[i], backfaceVisibility: 'hidden' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={face.image}
                  alt={face.label}
                  loading="lazy"
                  className="h-full w-full object-cover [filter:brightness(0.8)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-paper)]">
                  {face.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback (mobile / reduced-motion) */}
      <div className="md:hidden mx-auto max-w-[1600px] px-6 py-24 grid grid-cols-2 gap-3">
        {six.map((face, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={face.image} alt={face.label} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-paper)] bg-[color:var(--color-ink)]/70 px-2 py-1">
              {face.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
