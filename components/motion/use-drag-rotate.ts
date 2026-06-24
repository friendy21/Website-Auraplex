'use client';

import { useEffect, useRef, type RefObject } from 'react';

type Opts = {
  /** Allow vertical drag to tilt rotateX (sphere/cube). Carousel: false. */
  allowVertical?: boolean;
  /** Idle auto-spin speed on Y, deg/ms. Default ≈ one rev / 50s. */
  idleSpeed?: number;
  /** Degrees of rotation per pixel dragged. */
  dragRatio?: number;
  /** Transform string prepended before the rotateX/rotateY (e.g. a cube's translateZ). */
  baseTransform?: string;
  /** Clamp for vertical tilt (deg). */
  maxVertical?: number;
  /** Starting vertical tilt (deg). */
  initialX?: number;
};

/**
 * useDragRotate — grab-to-spin for a 3D element. One rAF loop writes one
 * transform to `targetRef` (composited, no layout). Idle auto-spins on Y;
 * dragging the `stageRef` takes over 1:1 and throws with momentum on release,
 * easing back to idle. Pauses offscreen / when the tab is hidden. Respects
 * prefers-reduced-motion (no idle spin; drag still works — it's user-
 * initiated). Returns a ref of total px moved so callers can suppress a click
 * that was actually a drag.
 *
 * Mirrors the homepage MachineCarousel interaction model, generalised to
 * X+Y rotation and an arbitrary base transform.
 */
export function useDragRotate(
  stageRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  opts: Opts = {},
) {
  const {
    allowVertical = true,
    idleSpeed = 360 / 50000,
    dragRatio = 0.3,
    baseTransform = '',
    maxVertical = 50,
    initialX = -12,
  } = opts;

  const moved = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    const target = targetRef.current;
    if (!stage || !target) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const idle = reduced ? 0 : idleSpeed;

    let ry = 0;
    let rx = allowVertical ? initialX : 0;
    let vy = idle;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastMoveT = 0;
    let instV = 0;

    let raf = 0;
    let running = false;
    let lastT = 0;

    const apply = () => {
      target.style.transform = `${baseTransform} rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };

    const frame = (t: number) => {
      if (!running) return;
      const dt = lastT ? Math.min(t - lastT, 48) : 16;
      lastT = t;
      if (!dragging) {
        vy += (idle - vy) * 0.02;
        ry += vy * dt;
      }
      apply();
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

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveT = performance.now();
      moved.current = 0;
      instV = 0;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      stage.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved.current += Math.abs(dx) + Math.abs(dy);
      const dRy = dx * dragRatio;
      ry += dRy;
      if (allowVertical) {
        rx = Math.max(-maxVertical, Math.min(maxVertical, rx - dy * dragRatio));
      }
      const ddt = Math.max(now - lastMoveT, 1);
      lastMoveT = now;
      instV = dRy / ddt;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.style.cursor = 'grab';
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      vy = Math.max(-0.6, Math.min(0.6, instV));
    };

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    apply();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
    };
  }, [stageRef, targetRef, allowVertical, idleSpeed, dragRatio, baseTransform, maxVertical, initialX]);

  return moved;
}
