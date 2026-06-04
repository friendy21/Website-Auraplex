'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { LanguageSwitcher } from './language-switcher';
import { SearchDialog } from '@/components/search/search-dialog';
import { cn } from '@/lib/utils';

type NavKey =
  | 'products'
  | 'services'
  | 'machineFinder'
  | 'caseStudies'
  | 'yearReview'
  | 'about';

const NAV: { key: NavKey; href: string }[] = [
  { key: 'products', href: '/products' },
  { key: 'services', href: '/services' },
  { key: 'machineFinder', href: '/machine-finder' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'yearReview', href: '/2026' },
  { key: 'about', href: '/about' },
];

/**
 * Header behavior:
 *  - Top of page: signal dot + AURAPLEX wordmark visible (we don't hide the
 *    wordmark entirely because the morph-collapse experiment hurt brand
 *    recognition on first paint).
 *  - At >40px scroll: header collapses (less padding), backdrop-blur engages,
 *    border draws under it. Subtle, not theatrical.
 *  - Nav links: cerulean underline scale-x on hover + letter-spacing
 *    expansion 0.15em → 0.3em.
 *  - Mobile menu: full-bleed ink panel slides from right (translateX 100%→0)
 *    with massive type and staggered link reveal.
 */
export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-xl bg-[color:var(--color-ink)]/80 border-b border-[color:var(--color-signal)]/15'
          : 'bg-transparent',
      )}
    >
      <motion.div
        animate={{ paddingTop: scrolled ? 10 : 18, paddingBottom: scrolled ? 10 : 18 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 lg:px-12"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="h-2 w-2 bg-[color:var(--color-signal)]"
            whileHover={{ scale: 1.5, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          />
          <span className="font-mono uppercase tracking-[0.2em] text-sm relative">
            Auraplex
            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-sm uppercase">
          {NAV.map(({ key, href }) => (
            <NavLink key={key} href={href} label={t(key)} />
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <SearchDialog />
          <LanguageSwitcher />
          <Button asChild size="sm">
            <Link href="/contact">{t('quote')}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-[color:var(--color-paper)] relative h-6 w-6 z-[60]"
          onClick={() => setOpen(!open)}
          aria-label={tCommon('menuToggle')}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {open ? <X /> : <Menu />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Mobile menu — full-bleed slide from right with massive type */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            className="lg:hidden fixed inset-0 top-0 bg-[color:var(--color-ink)] z-[55] flex flex-col"
          >
            {/* Spacer so the close button is reachable */}
            <div className="h-20" aria-hidden />

            {/* Mobile nav links — staggered clip-path reveal */}
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.2 },
                },
                closed: {},
              }}
              className="flex-1 px-8 py-12 flex flex-col gap-6 overflow-y-auto"
            >
              {(
                [
                  ['products', '/products'],
                  ['services', '/services'],
                  ['machineFinder', '/machine-finder'],
                  ['caseStudies', '/case-studies'],
                  ['news', '/news'],
                  ['yearReview', '/2026'],
                  ['careers', '/careers'],
                  ['about', '/about'],
                  ['contact', '/contact'],
                ] as const
              ).map(([k, href], i) => (
                <motion.div
                  key={k}
                  variants={{
                    open: { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' },
                    closed: {
                      opacity: 0,
                      y: 20,
                      clipPath: 'inset(0 100% 0 0)',
                    },
                  }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  className="border-b border-[color:var(--color-neutral-800)] pb-4"
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[clamp(2.5rem,11vw,5rem)] tracking-[-0.02em] leading-[1] block group"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
                        0{i + 1}
                      </span>
                      <span className="group-hover:text-[color:var(--color-signal)] transition-colors duration-300">
                        {t(k)}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 },
                }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <LanguageSwitcher />
              </motion.div>
            </motion.nav>

            {/* Mobile footer mark */}
            <div className="px-8 py-6 border-t border-[color:var(--color-neutral-800)] font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)]" />
              Auraplex · MY · 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/**
 * Nav link with letter-spacing expansion + signal underline draw on hover.
 * The tracking change is animated via CSS transition on letter-spacing, which
 * is a paint-only operation (no layout thrash at this scale).
 */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative py-2 tracking-[0.15em] hover:tracking-[0.3em] hover:text-[color:var(--color-signal)] text-[color:var(--color-paper)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    >
      {label}
      <span className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
    </Link>
  );
}
