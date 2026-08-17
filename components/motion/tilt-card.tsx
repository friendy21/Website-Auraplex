'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Max tilt in degrees on each axis. Default 6 (subtle, editorial). */
  intensity?: number;
  /** Optional className passed to wrapper. */
  className?: string;
};

/** Keeps the normalised pointer factor inside the card's own bounds, matching
 *  the clamp framer's `useTransform` applied at the ends of its input range. A
 *  pointer can land marginally outside on sub-pixel borders or under pointer
 *  capture, and without this the card would over-rotate past `intensity`. */
function clamp(v: number) {
  return v < -0.5 ? -0.5 : v > 0.5 ? 0.5 : v;
}

/**
 * 3D-perspective hover tilt — element rotates subtly on X/Y axes toward the
 * cursor's position within its bounds, then returns to flat on leave.
 * Wrap product cards, feature blocks, anything with a strong rectangular
 * boundary.
 *
 * MECHANISM: was two framer springs (useMotionValue + useSpring + useTransform)
 * driving a `motion.div`. It wraps the product-detail gallery hero, i.e. an
 * above-the-fold LCP surface, so it was pulling framer-motion onto the critical
 * path. It now follows the CALIPER pattern used by custom-cursor.tsx and
 * magnetic.tsx: a passive listener writes the normalised pointer position into
 * CSS custom properties and CSS owns the transform and the settle
 * (styles/motion/tilt-card.css).
 *
 * Nothing but the wrapper renders and no listener is attached unless the device
 * has a fine pointer and the user allows motion, so touch devices pay nothing.
 */
export function TiltCard({ children, intensity = 6, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
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

    let cx = 0;
    let cy = 0;
    let frame = 0;

    // One measure + one write per frame. The old handler ran
    // getBoundingClientRect on every pointermove, and a trackpad emits well
    // above 60Hz — that is a forced layout per event. Reading the rect here
    // (rather than caching it on enter) keeps the maths correct when the page
    // scrolls while the card is hovered.
    const write = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = clamp((cx - r.left) / r.width - 0.5);
      const py = clamp((cy - r.top) / r.height - 0.5);
      el.style.setProperty('--tilt-fx', px.toFixed(4));
      el.style.setProperty('--tilt-fy', py.toFixed(4));
      // Expose the pointer position (0–100%) as CSS vars so children can
      // render a cursor-following spotlight glow without their own handler.
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(2)}%`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // hybrid laptops: ignore taps
      cx = e.clientX;
      cy = e.clientY;
      if (!frame) frame = requestAnimationFrame(write);
    };

    // JS only writes the rest values; the transition does the return trip.
    const onLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      el.style.setProperty('--tilt-fx', '0');
      el.style.setProperty('--tilt-fy', '0');
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.removeProperty('--tilt-fx');
      el.style.removeProperty('--tilt-fy');
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    };
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={className ? `tilt-card ${className}` : 'tilt-card'}
      style={{ '--tilt-max': `${intensity}deg` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
