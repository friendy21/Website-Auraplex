'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28 });
  const springY = useSpring(y, { stiffness: 400, damping: 28 });
  const [mode, setMode] = useState<'default' | 'caliper'>('default');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      setMode(el.closest('[data-cursor="caliper"]') ? 'caliper' : 'default');
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="caliper-cursor"
      aria-hidden
    >
      {mode === 'caliper' ? (
        <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="16" r="14" />
          <path d="M16 2v8M16 22v8M2 16h8M22 16h8" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      ) : (
        <div className="h-2 w-2 rounded-full bg-[color:var(--color-paper)]" />
      )}
    </motion.div>
  );
}
