'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { LanguageSwitcher } from './language-switcher';
import { SearchDialog } from '@/components/search/search-dialog';
import { cn } from '@/lib/utils';

type NavKey =
  | 'products'
  | 'machineFinder'
  | 'financing'
  | 'caseStudies'
  | 'yearReview'
  | 'about';

const NAV: { key: NavKey; href: string }[] = [
  { key: 'products', href: '/products' },
  { key: 'machineFinder', href: '/machine-finder' },
  { key: 'financing', href: '/financing' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'yearReview', href: '/2026' },
  { key: 'about', href: '/about' },
];

export function Header() {
  const t = useTranslations('nav');
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
          ? 'backdrop-blur-xl bg-[color:var(--color-ink)]/80 border-b border-[color:var(--color-steel)]/20 py-1'
          : 'bg-transparent py-2',
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3 lg:px-12">
        {/* Logo with hover micro-interaction */}
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

        {/* Desktop nav — animated cerulean underline on hover */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-sm uppercase tracking-wider">
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

        {/* Mobile menu toggle with icon swap animation */}
        <button
          className="lg:hidden text-[color:var(--color-paper)] relative h-6 w-6"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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
      </div>

      {/* Mobile menu — staggered link entrance */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden border-t border-[color:var(--color-steel)]/20 bg-[color:var(--color-ink)] overflow-hidden"
          >
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: {},
              }}
              className="px-6 py-8 flex flex-col gap-6 font-mono uppercase tracking-wider"
            >
              {(
                [
                  ['products', '/products'],
                  ['machineFinder', '/machine-finder'],
                  ['financing', '/financing'],
                  ['caseStudies', '/case-studies'],
                  ['yearReview', '/2026'],
                  ['about', '/about'],
                  ['contact', '/contact'],
                ] as const
              ).map(([k, href]) => (
                <motion.div
                  key={k}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-2xl block hover:text-[color:var(--color-signal)] transition-colors"
                  >
                    {t(k)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                transition={{ duration: 0.3 }}
              >
                <LanguageSwitcher />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/**
 * Nav link with animated left-to-right underline on hover.
 * Uses pure CSS transforms for compositor-accelerated motion (no JS per frame).
 */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative py-2 hover:text-[color:var(--color-signal)] transition-colors">
      {label}
      <span className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
    </Link>
  );
}
