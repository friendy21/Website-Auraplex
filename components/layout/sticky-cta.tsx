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
import { whatsappLink } from '@/lib/utils';

/**
 * Floating "Get a quote" pill that expands on hover to reveal a secondary
 * "WhatsApp us" button. Scales in once scrolled past hero, hides on contact /
 * machine-finder / 2026 / case-studies routes.
 */
export function StickyCta() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
          className="fixed bottom-6 right-6 z-40 lg:bottom-10 lg:right-10 pointer-events-none"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <motion.div
            animate={{
              boxShadow: expanded
                ? '0 24px 60px -12px color-mix(in oklab, var(--color-signal) 50%, transparent)'
                : '0 14px 40px -12px color-mix(in oklab, var(--color-signal) 30%, transparent)',
            }}
            className="pointer-events-auto inline-flex items-stretch overflow-hidden bg-[color:var(--color-signal)] text-[color:var(--color-ink)]"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-[color:var(--color-signal-bright)] transition-colors"
            >
              {/* Idle pulse dot */}
              <motion.span
                animate={
                  expanded
                    ? { scale: [1, 1.5], opacity: [1, 0] }
                    : { scale: [1, 1.03, 1] }
                }
                transition={
                  expanded
                    ? { duration: 0.4 }
                    : { duration: 1.6, repeat: Infinity, repeatDelay: 3 }
                }
                className="inline-block h-1.5 w-1.5 bg-[color:var(--color-ink)] rounded-full"
              />
              Get a quote
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* Secondary CTA — width animates from 0 → auto when expanded */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.a
                  href={whatsappLink(
                    'Hi — saw the Auraplex site and want to talk.',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    width: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.2, delay: 0.1 },
                  }}
                  className="inline-flex items-center overflow-hidden border-l border-[color:var(--color-ink)]/15"
                >
                  <span className="whitespace-nowrap px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-[color:var(--color-neutral-800)] transition-colors">
                    WhatsApp →
                  </span>
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
