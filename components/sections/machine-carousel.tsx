'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';
import { getMachinesWithCover } from '@/lib/catalog';

/**
 * MachineCarousel — a true 3D rotating ring of machine photography,
 * now DRAG-TO-SPIN with momentum.
 *
 * Interaction model:
 *   - Idle: the ring auto-rotates slowly (≈ one revolution / 44s).
 *   - Drag (pointer or touch): the ring follows the pointer 1:1
 *     (0.3°/px), and on release it keeps the throw velocity, decaying
 *     smoothly back to the idle speed — flick it and it spins.
 *   - Click a panel → opens that machine. Clicks are suppressed when
 *     the pointer travelled >6px so a drag never misfires a navigation.
 *
 * Performance contract (same rules the Lighthouse work established):
 *   - ONE rAF loop writing ONE transform (rotateY on the ring) —
 *     composited, no layout, no paint storms.
 *   - The loop pauses entirely when the section is offscreen
 *     (IntersectionObserver) or the tab is hidden.
 *   - Fixed-height stage → zero CLS.
 *   - prefers-reduced-motion: no auto-spin; drag still works (it's
 *     user-initiated motion, which reduced-motion explicitly allows).
 *
 * Geometry: 8 panels of 280px → ring radius R = 140/tan(π/8) ≈ 338px.
 */
const PANEL_W = 280;
const PANEL_COUNT = 8;
const RADIUS = Math.round(PANEL_W / 2 / Math.tan(Math.PI / PANEL_COUNT));
/** Idle rotation speed in deg/ms (≈ one revolution per 44s). */
const BASE_SPEED = 360 / 44000;
/** Degrees of ring rotation per pixel of horizontal drag. */
const DRAG_RATIO = 0.3;

export function MachineCarousel() {
  const t = useTranslations('home.carousel');
  const machines = getMachinesWithCover().slice(0, PANEL_COUNT);

  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // All animation state lives in refs — the rAF loop never touches React.
  const rotation = useRef(0);
  const velocity = useRef(BASE_SPEED);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastMoveTime = useRef(0);
  const movedTotal = useRef(0);
  const instVel = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const idleSpeed = reduced ? 0 : BASE_SPEED;
    velocity.current = idleSpeed;

    let raf = 0;
    let running = false;
    let lastT = 0;

    const frame = (t: number) => {
      if (!running) return;
      const dt = lastT ? Math.min(t - lastT, 48) : 16;
      lastT = t;
      if (!dragging.current) {
        // Ease the throw velocity back toward idle speed.
        velocity.current += (idleSpeed - velocity.current) * 0.015;
        rotation.current += velocity.current * dt;
      }
      ring.style.transform = `rotateY(${rotation.current}deg)`;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastT = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause the loop when offscreen / tab hidden — no wasted frames.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(stage);
    const onVis = () => {
      if (document.hidden) stop();
      else if (stage.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener('visibilitychange', onVis);

    // ── Drag handlers ──
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      lastMoveTime.current = performance.now();
      movedTotal.current = 0;
      instVel.current = 0;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const now = performance.now();
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      movedTotal.current += Math.abs(dx);
      const deg = dx * DRAG_RATIO;
      rotation.current += deg;
      const dt = Math.max(now - lastMoveTime.current, 1);
      lastMoveTime.current = now;
      instVel.current = deg / dt;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      stage.style.cursor = 'grab';
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* capture may already be released */
      }
      // Throw: keep release velocity, clamped so a hard flick spins
      // fast but never becomes a blur.
      velocity.current = Math.max(-0.6, Math.min(0.6, instVel.current));
    };

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
    };
  }, []);

  if (machines.length < 3) return null;
  const step = 360 / machines.length;

  return (
    <section className="relative py-32 overflow-hidden border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
      {/* Section heading */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mb-4">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
            {t('h2')}
          </h2>
        </Reveal>
      </div>

      {/* 3D stage — fixed height, drag to spin. touch-action pan-y keeps
          vertical page scroll working on mobile while horizontal drags
          spin the ring. */}
      <div
        ref={stageRef}
        className="relative mx-auto h-[420px] md:h-[480px] w-full max-w-[1600px] select-none"
        style={{
          perspective: '1400px',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
        // Suppress panel navigation when the gesture was a drag.
        onClickCapture={(e) => {
          if (movedTotal.current > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 scale-[0.55] sm:scale-75 lg:scale-100"
          style={{
            width: PANEL_W,
            height: 340,
            marginLeft: -PANEL_W / 2,
            marginTop: -170,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {machines.map((m, i) =>
            m.image ? (
              <Link
                key={m.id}
                href={`/products/${m.slug}`}
                draggable={false}
                className="card-shine group absolute inset-0 border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/90 hover:border-[color:var(--color-signal)] transition-colors"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="relative h-[260px] m-3 mb-0 pointer-events-none">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="280px"
                    draggable={false}
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
                <div className="px-4 py-3 flex items-baseline justify-between gap-2 pointer-events-none">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] truncate">
                    {m.name}
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--color-signal)] shrink-0">
                    0{i + 1}
                  </span>
                </div>
              </Link>
            ) : null,
          )}
        </div>

        {/* Floor glow under the ring */}
        <div
          className="absolute left-1/2 bottom-4 h-16 w-[60%] -translate-x-1/2 rounded-[100%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, color-mix(in oklab, var(--color-signal) 14%, transparent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Hint row */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mt-2 flex items-center justify-between flex-wrap gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          {t('hint')}
        </span>
        <Link
          href="/products"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-signal)] hover:text-[color:var(--color-paper)] transition-colors"
        >
          {t('cta')} →
        </Link>
      </div>
    </section>
  );
}
