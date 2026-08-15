'use client';

import { useEffect, useRef } from 'react';

type Props = {
  size?: number;
  color?: string;
  intensity?: number;
};

/**
 * CursorSpotlight — a soft signal-coloured halo that follows the pointer inside
 * its parent. Purely decorative; pointer-events: none, never intercepts clicks.
 *
 * Drop into any section with `position: relative` and it scopes itself to that
 * container's bounds.
 *
 * MECHANISM: was two framer springs (useMotionValue + useSpring). It is rendered
 * by HeroCinematic, i.e. on the homepage's above-the-fold path, so it was the
 * last thing keeping the framer-motion bundle on the LCP surface. It now follows
 * the CALIPER pattern used by custom-cursor.tsx and magnetic.tsx: a passive
 * listener writes the position into CSS custom properties and CSS does the
 * moving, with the spring settle coming from the shared --ease-spring token
 * (a linear() port of the framer config it replaces).
 *
 * Skips entirely on touch/coarse-pointer and under reduced-motion: no listener
 * is attached and nothing is rendered, so mobile pays nothing at all.
 */
export function CursorSpotlight({
  size = 360,
  color = 'var(--color-signal)',
  intensity = 0.18,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    let dirty = false;

    const flush = () => {
      raf = 0;
      el.style.setProperty('--spot-x', `${px}px`);
      el.style.setProperty('--spot-y', `${py}px`);
      dirty = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = parent.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      el.style.setProperty('--spot-o', '1');
      if (!dirty) {
        dirty = true;
        raf = requestAnimationFrame(flush);
      }
    };
    const onLeave = () => {
      el.style.setProperty('--spot-o', '0');
    };

    parent.addEventListener('pointermove', onMove, { passive: true });
    parent.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-spotlight"
      aria-hidden="true"
      style={
        {
          '--spot-size': `${size}px`,
          '--spot-color': color,
          '--spot-intensity': String(intensity),
        } as React.CSSProperties
      }
    />
  );
}
