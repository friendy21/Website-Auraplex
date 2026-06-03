'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Floating "Get a quote" pill that scales into view once the user has scrolled
 * roughly one viewport height past the hero. Hides on the contact page (where
 * the form already lives) and on the 2026 spread (its own narrative pacing).
 */
export function StickyCta() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShow(y > 700);
  });

  // Suppress on certain routes
  if (
    pathname.endsWith('/contact') ||
    pathname.endsWith('/machine-finder') ||
    pathname.match(/\/(2026|case-studies)(\/.*)?$/)
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed bottom-6 right-6 z-40 lg:bottom-10 lg:right-10 pointer-events-none"
        >
          <Link
            href="/contact"
            className="pointer-events-auto group inline-flex items-center gap-3 bg-[color:var(--color-signal)] text-[color:var(--color-ink)] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-[color:var(--color-signal)]/30 hover:bg-[color:var(--color-signal-bright)] transition-colors"
          >
            <span className="h-1.5 w-1.5 bg-[color:var(--color-ink)] animate-pulse" />
            Get a quote
            <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
