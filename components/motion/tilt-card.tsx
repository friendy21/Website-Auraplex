'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

type Props = {
  children: ReactNode;
  /** Max tilt in degrees on each axis. Default 6 (subtle, editorial). */
  intensity?: number;
  /** Optional className passed to wrapper. */
  className?: string;
};

/**
 * 3D-perspective hover tilt — element rotates subtly on X/Y axes toward the
 * cursor's position within its bounds, then returns to flat on leave.
 * Wrap product cards, feature blocks, anything with a strong rectangular
 * boundary. Touch devices skip the tilt automatically.
 */
export function TiltCard({ children, intensity = 6, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    x.set(px);
    y.set(py);
    // Expose the pointer position (0–100%) as CSS vars so children can
    // render a cursor-following spotlight glow without their own handler.
    el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    const el = ref.current;
    if (el) {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
    }
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
