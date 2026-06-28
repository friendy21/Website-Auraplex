'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'motion/react';
import { usePerfTier } from '@/lib/hooks';

type Machine = { image: string; slug: string; name: string };
type Props = { machines: Machine[] };

const ITEM_COUNT = 18;
const Z_GAP = 760;
const RANGE = ITEM_COUNT * Z_GAP;
const STAR_COUNT = 64;
const WORDS = ['LABELLING', 'PACKAGING', 'AUTOMATION', 'PRECISION', 'SELANGOR', 'BUILT HERE'];

// Deterministic pseudo-random in [0,1) — SSR-safe (no Math.random).
const rand = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

// Module-level geometry (stable across renders → clean effect deps).
const ITEMS_GEO = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  i,
  isText: i % 4 === 0,
  x: Math.cos(i * 2.399) * 340,
  y: Math.sin(i * 1.7) * 210,
  rot: ((i * 37) % 30) - 15,
  baseZ: -i * Z_GAP,
  word: WORDS[i % WORDS.length],
}));
const STARS_GEO = Array.from({ length: STAR_COUNT }, (_, i) => ({
  x: (rand(i) - 0.5) * 2600,
  y: (rand(i + 99) - 0.5) * 2600,
  baseZ: -rand(i + 7) * RANGE,
}));

/**
 * MachineHyperscroll — a scroll-driven 3D flythrough of Auraplex machines.
 * Faithful adaptation of aleksa-rakocevic/pvbboZx ("Hyper Scroll"): machine
 * cards, big family words and a starfield recede in Z; scrolling the section
 * flies the camera forward, items fade/scale by depth, with mouse parallax
 * tilt, a velocity FOV warp and a HUD + scanline/vignette overlay. Rebranded
 * to Auraplex ink + cerulean (no neon, no feTurbulence noise per the perf
 * rules) and scoped to its OWN scroll range via useScroll — no page-wide
 * scroll hijack, so it never fights the site's global Lenis. Cards link out.
 *
 * Mobile / reduced-motion: a static clickable grid (no 3D / rAF).
 */
export function MachineHyperscroll({ machines }: Props) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const tier = usePerfTier();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (tier !== 'full') return;
    const vp = viewport.current;
    const wl = world.current;
    const sec = section.current;
    if (!vp || !wl || !sec) return;

    let running = false;
    let lastP = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);

    const frame = () => {
      if (!running) return;
      const p = scrollYProgress.get();
      const vel = p - lastP;
      lastP = p;
      const cameraZ = p * (RANGE + 1400);

      wl.style.transform = `rotateX(${(mouse.current.y * 4).toFixed(2)}deg) rotateY(${(mouse.current.x * 4).toFixed(2)}deg)`;
      vp.style.perspective = `${1000 - Math.min(Math.abs(vel) * 9000, 520)}px`;

      ITEMS_GEO.forEach((it, idx) => {
        const el = itemRefs.current[idx];
        if (!el) return;
        const z = it.baseZ + cameraZ;
        let alpha = 1;
        if (z < -3000) alpha = 0;
        else if (z < -2000) alpha = (z + 3000) / 1000;
        if (z > 80) alpha = 1 - (z - 80) / 460;
        alpha = Math.max(0, Math.min(1, alpha));
        el.style.opacity = String(alpha);
        el.style.transform =
          alpha > 0
            ? `translate3d(${it.x}px, ${it.y}px, ${z.toFixed(0)}px) rotateZ(${it.rot}deg)`
            : 'translate3d(0,0,-9999px)';
      });

      const stretch = Math.max(1, Math.min(1 + Math.abs(vel) * 1400, 8));
      STARS_GEO.forEach((st, idx) => {
        const el = starRefs.current[idx];
        if (!el) return;
        let z = (((st.baseZ + cameraZ) % RANGE) + RANGE) % RANGE;
        if (z > 500) z -= RANGE;
        el.style.transform = `translate3d(${st.x}px, ${st.y}px, ${z.toFixed(0)}px) scaleZ(${stretch.toFixed(2)})`;
        el.style.opacity = z < -3200 ? '0' : '0.7';
      });

      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(sec);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [tier, scrollYProgress]);

  if (!machines.length) return null;

  // ── Mobile / reduced-motion fallback ──
  // The 3D flythrough can't run here, so present the same machines as a clean
  // editorial gallery — named, spaced and linked, matching the rest of the
  // homepage rather than the old cramped thumbnail grid.
  if (tier !== 'full') {
    return (
      <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-24 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 flex items-center gap-3">
                <span className="h-px w-12 bg-[color:var(--color-signal)]" />
                Featured machines
              </div>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1]">
                The full range.
              </h2>
            </div>
            <Link
              href="/products"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] hover:text-[color:var(--color-signal)] transition self-start md:self-auto"
            >
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {machines.slice(0, 8).map((m, i) => (
              <Link
                key={m.slug}
                href={`/products/${m.slug}`}
                data-cursor="caliper"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-colors duration-300 hover:border-[color:var(--color-signal)]"
              >
                <div
                  className="relative aspect-square"
                  style={{
                    background:
                      'radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--color-signal) 12%, transparent), transparent 60%)',
                  }}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-3 left-3 font-mono text-[10px] text-[color:var(--color-steel)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="border-t border-[color:var(--color-neutral-700)] p-4">
                  <h3 className="font-display text-base leading-tight line-clamp-2">{m.name}</h3>
                  <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] transition">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      className="relative h-[360vh] bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
    >
      <div
        ref={viewport}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={world}
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {STARS_GEO.map((_, idx) => (
            <div
              key={`s${idx}`}
              ref={(el) => {
                starRefs.current[idx] = el;
              }}
              className="absolute h-[2px] w-[2px] bg-[color:var(--color-signal)]"
            />
          ))}
          {ITEMS_GEO.map((it, idx) => {
            const machine = machines[idx % machines.length];
            return (
              <div
                key={`i${idx}`}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                {it.isText ? (
                  <div className="font-display text-[clamp(4rem,12vw,11rem)] font-extrabold tracking-[-0.04em] text-transparent [-webkit-text-stroke:2px_color-mix(in_oklab,var(--color-signal)_55%,transparent)] whitespace-nowrap select-none">
                    {it.word}
                  </div>
                ) : machine ? (
                  <Link
                    href={`/products/${machine.slug}`}
                    data-cursor="caliper"
                    className="group relative block h-[420px] w-[320px] border border-[color:var(--color-signal)]/30 bg-[color:var(--color-neutral-800)]/40 backdrop-blur-md p-7 hover:border-[color:var(--color-signal)] transition-colors"
                  >
                    <span className="absolute -top-px -left-px h-3 w-3 border-t border-l border-[color:var(--color-paper)]" />
                    <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[color:var(--color-paper)]" />
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-signal)] border-b border-[color:var(--color-neutral-700)] pb-3">
                      <span>ID-{String(idx).padStart(2, '0')}</span>
                      <span className="h-2.5 w-2.5 bg-[color:var(--color-signal)]" />
                    </div>
                    <div className="relative h-[210px] my-4">
                      <Image src={machine.image} alt={machine.name} fill sizes="320px" className="object-contain" />
                    </div>
                    <h3 className="font-display text-2xl leading-tight tracking-[-0.01em] line-clamp-2">
                      {machine.name}
                    </h3>
                    <div className="absolute bottom-6 left-7 right-7 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]">
                      <span>Auraplex</span>
                      <span className="text-[color:var(--color-signal)] group-hover:translate-x-1 transition-transform">View →</span>
                    </div>
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Scanlines + vignette (cheap, no noise) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-60"
          style={{ background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 50%)', backgroundSize: '100% 4px' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: 'radial-gradient(circle, transparent 45%, var(--color-ink) 125%)' }}
        />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-6 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel-soft)]">
          <div className="absolute top-0 left-0 text-[color:var(--color-signal)]">— Featured machines</div>
          <div className="absolute top-0 right-0">Hyperscroll · drag down</div>
          <div className="absolute bottom-0 left-0">Auraplex · Selangor</div>
          <div className="absolute bottom-0 right-0">{ITEM_COUNT} nodes</div>
          <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-[color:var(--color-paper)]/30" />
          <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-[color:var(--color-paper)]/30" />
          <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[color:var(--color-paper)]/30" />
          <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[color:var(--color-paper)]/30" />
        </div>

        {/* Scroll-progress bar */}
        <motion.div
          style={{ scaleX: scrollYProgress, originX: 0 }}
          className="absolute top-0 left-0 right-0 z-30 h-px bg-[color:var(--color-signal)]"
        />
      </div>
    </section>
  );
}
