'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Props = {
  /** Halo size in pixels. */
  size?: number;
  /** Halo color (CSS color). Defaults to brand signal. */
  color?: string;
  /** Opacity at the center of the halo. */
  intensity?: number;
};

/**
 * Cursor-following radial spotlight. Renders a single absolutely-positioned
 * div that scales with springed lag behind the cursor. Pure visual layer —
 * pointer-events: none, doesn't replace the cursor, doesn't intercept clicks.
 *
 * Drop into any section with `position: relative` and the spotlight scopes
 * itself to that container's bounds.
 *
 * Skips on touch + reduced-motion automatically.
 */
export function CursorSpotlight({
  size = 360,
  color = 'var(--color-signal)',
  intensity = 0.18,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 200, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const parent = ref.current?.parentElement;
    if (!parent) return;

    function onMove(e: PointerEvent) {
      const rect = parent!.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
    function onLeave() {
      x.set(-9999);
      y.set(-9999);
    }

    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        translateX: '-50%',
        translateY: '-50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: intensity,
        pointerEvents: 'none',
      }}
      className="absolute left-0 top-0 z-[1] mix-blend-screen"
      aria-hidden="true"
    />
  );
}
