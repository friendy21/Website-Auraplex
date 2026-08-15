'use client';

import { Link } from '@/lib/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import '@/styles/motion/sticky-cta.css';

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
 *
 * MOTION: the show/hide used to be framer (`useScroll` → React state →
 * <AnimatePresence>), which put framer-motion in the root layout and wrote
 * state on scroll. It is now a CSS scroll-driven animation — see
 * styles/motion/sticky-cta.css. The 700px threshold lives there as an
 * `animation-range`, and the keyframes toggle `visibility` so the link is
 * genuinely inert (untabbable, out of the a11y tree) before it appears,
 * which is what unmounting used to buy us.
 *
 * Still a Client Component only because the route test below needs
 * `usePathname()` — a layout gets `params`, never the full path.
 */
export function StickyCta() {
  const t = useTranslations('common');
  const pathname = usePathname();

  if (
    pathname.endsWith('/contact') ||
    pathname.endsWith('/machine-finder') ||
    pathname.match(/\/(2026|case-studies)(\/.*)?$/)
  ) {
    return null;
  }

  return (
    <div
      /* Stack above WhatsAppButton — WhatsApp sits at bottom-6/right-6,
         this pill sits at bottom-24/right-6 (≈72px gap above it).
         On large screens we move further off the edge for breathing room. */
      className="sticky-cta fixed bottom-24 right-6 z-40 lg:bottom-28 lg:right-10 pointer-events-none"
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
    </div>
  );
}
