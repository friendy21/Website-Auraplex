'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * 2px progress bar at the top of the viewport, tracking total document
 * scroll. Sits above the header and below the page loader.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[color:var(--color-signal)] z-[60] pointer-events-none"
      aria-hidden="true"
    />
  );
}
