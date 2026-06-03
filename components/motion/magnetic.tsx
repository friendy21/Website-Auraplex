'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Props = {
  children: ReactNode;
  /** Pixels of cursor influence on the wrapped element. Lower = subtler. */
  strength?: number;
  /** Radius (px) within which the cursor activates the magnetism. */
  radius?: number;
  className?: string;
};

/**
 * Wraps any child element with cursor magnetism — when the cursor enters a
 * defined radius, the element translates toward the cursor's offset (scaled
 * by `strength`). Common signature on award-tier sites for primary CTAs.
 * Skip on touch / reduced-motion (Motion handles the latter via global pref).
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 22, mass: 0.4 });

  function onMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
