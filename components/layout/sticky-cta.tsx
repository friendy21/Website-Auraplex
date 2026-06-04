'use client';

import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Floating "Get a quote" pill — appears once the user scrolls past the hero
 * and stacks ABOVE the WhatsAppButton so the two don't fight for the
 * bottom-right corner.
 *
 * Hides on /contact, /machine-finder, /2026, and /case-studies/* where the
 * floating affordance would be noise.
 *
 * Previously included a hover-expand reveal that showed a secondary WhatsApp
 * button — removed because the standalone WhatsAppButton sitting just below
 * already serves that role. Single-action pill is cleaner.
 */
export function StickyCta() {
  const t = useTranslations('common');
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShow(y > 700);
  });

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
          /* Stack above WhatsAppButton — WhatsApp sits at bottom-6/right-6,
             this pill sits at bottom-24/right-6 (≈72px gap above it).
             On large screens we move further off the edge for breathing room. */
          className="fixed bottom-24 right-6 z-40 lg:bottom-28 lg:right-10 pointer-events-none"
        >
          <Link
            href="/contact"
            className="pointer-events-auto group inline-flex items-center gap-3 bg-[color:var(--color-signal)] text-[color:var(--color-ink)] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-[color:var(--color-signal)]/30 hover:bg-[color:var(--color-signal-bright)] transition-colors"
          >
            <span className="h-1.5 w-1.5 bg-[color:var(--color-ink)] animate-pulse" />
            {t('stickyCta')}
            <span className="text-base group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
