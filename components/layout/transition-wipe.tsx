'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';

/**
 * TransitionWipe — a 2px signal-cerulean line that sweeps across the
 * viewport on every route change. Pairs with the View Transitions API
 * "power-on" clip animation in globals.css so navigations read as a
 * machine state change rather than a fade.
 *
 * Hooks into Next's App Router via `usePathname()` — fires after the
 * new route mounts. The line scales from x=0 to x=100% over 500ms with
 * a soft signal glow trailing behind it.
 *
 * Reduced-motion: the line is rendered but the animation is skipped
 * (motion handles this implicitly via prefers-reduced-motion respect
 *  on `animate`).
 */
export function TransitionWipe() {
  const pathname = usePathname();
  const x = useMotionValue('-2px');

  useEffect(() => {
    const controls = animate(x, ['-2px', '100vw'], {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    });
    return () => controls.stop();
  }, [pathname, x]);

  return (
    <motion.div
      aria-hidden
      style={{ x }}
      className="fixed inset-y-0 left-0 w-0.5 z-[200] pointer-events-none bg-[color:var(--color-signal)] shadow-[0_0_18px_color-mix(in_oklab,var(--color-signal)_80%,transparent)]"
    />
  );
}
