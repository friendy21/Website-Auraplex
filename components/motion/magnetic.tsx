'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Pixels of cursor influence on the wrapped element. Lower = subtler. */
  strength?: number;
  /** Radius (px) within which the cursor activates the magnetism. */
  radius?: number;
  className?: string;
};

/** Ceiling on the pull, in px. `strength` still scales the offset exactly as
 *  before; this clamps only the far end, where the springs reached ~40px and
 *  read as a bounce. Measurement, not bounce. */
const MAX_PULL = 6;

/**
 * Wraps any child element with cursor magnetism — inside `radius`, the element
 * translates toward the cursor's offset (scaled by `strength`). The two framer
 * springs are gone: this writes `--mx` / `--my` and CSS owns the transform and
 * the settle (styles/motion/magnetic.css). No listener is attached without a
 * fine pointer and allowed motion, so touch devices pay nothing.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Capability gate. Stays live so a plugged-in mouse or an OS motion-setting
  // change is picked up without a reload.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !calm.matches);
    sync();
    fine.addEventListener('change', sync);
    calm.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      calm.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let nx = 0;
    let ny = 0;
    let frame = 0;
    const write = () => {
      frame = 0;
      el.style.setProperty('--mx', `${nx.toFixed(2)}px`);
      el.style.setProperty('--my', `${ny.toFixed(2)}px`);
    };
    // One write per frame: a trackpad emits well above 60Hz and every write
    // invalidates this element's style.
    const set = (x: number, y: number) => {
      nx = x;
      ny = y;
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // hybrid laptops: ignore taps
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist > radius || dist === 0) {
        set(0, 0);
        return;
      }
      // Clamp the VECTOR, not each axis, so the pull keeps pointing at the
      // cursor once it saturates.
      const pull = Math.min(dist * strength, MAX_PULL) / dist;
      set(dx * pull, dy * pull);
    };
    const onLeave = () => set(0, 0);

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    };
  }, [enabled, strength, radius]);

  return (
    <span ref={ref} className={className ? `magnetic ${className}` : 'magnetic'}>
      {children}
    </span>
  );
}
