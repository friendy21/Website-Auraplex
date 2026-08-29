'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { LanguageSwitcher } from './language-switcher';
import { SearchDialog } from '@/components/search/search-dialog';
import { SoundToggle } from './sound-toggle';

type NavKey =
  | 'products'
  | 'services'
  | 'machineFinder'
  | 'caseStudies'
  | 'yearReview'
  | 'internship'
  | 'about';

// Internship sits as a top-level nav item — matches the real
// autolabellermalaysia.com convention and signals "we hire" to every
// visitor on every page rather than burying it inside /careers.
const NAV: { key: NavKey; href: string }[] = [
  { key: 'products', href: '/products' },
  { key: 'services', href: '/services' },
  { key: 'machineFinder', href: '/machine-finder' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'yearReview', href: '/2026' },
  { key: 'internship', href: '/internship' },
  { key: 'about', href: '/about' },
];

const MOBILE_NAV = [
  ['products', '/products'],
  ['services', '/services'],
  ['machineFinder', '/machine-finder'],
  ['caseStudies', '/case-studies'],
  ['news', '/news'],
  ['yearReview', '/2026'],
  ['internship', '/internship'],
  ['about', '/about'],
  ['contact', '/contact'],
] as const;

/**
 * Header behavior:
 *  - Top of page: signal dot + AURAPLEX wordmark visible (we don't hide the
 *    wordmark entirely because the morph-collapse experiment hurt brand
 *    recognition on first paint).
 *  - At >40px scroll: header collapses (less padding), backdrop-blur engages,
 *    border draws under it. Subtle, not theatrical.
 *  - Nav links: cerulean underline scale-x on hover + colour shift to signal.
 *  - Mobile menu: full-bleed ink panel slides from right (translateX 100%→0)
 *    with massive type and staggered link reveal.
 *
 * MOTION: all of the above is native CSS — see styles/motion/header.css.
 * This component ships on every route via app/[locale]/layout.tsx, so it
 * carries no animation library. The only motion-related JS left is a passive,
 * rAF-throttled scroll listener that writes a `data-scrolled` attribute
 * straight to the header node (no React re-render, no state), plus the
 * `data-open` attribute that drives the menu's CSS transitions.
 */
export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Set when the menu is closed while focus is still inside the panel, so the
  // close effect knows to hand focus back to the toggle instead of letting the
  // browser drop it on <body> when `inert` is applied.
  const restoreFocus = useRef(false);

  // Light-surface routes (e.g. the /2026 page opens on a paper background).
  // The nav text/logo are paper-coloured, so over a transparent header at the
  // top of a paper page they were invisible until the user scrolled 40px.
  // Force the solid (ink) header backdrop on these routes so the nav is
  // legible from first paint.
  const lightSurface = /\/2026(\/|$)/.test(pathname ?? '');

  // Scroll reactivity. Deliberately a listener rather than
  // `animation-timeline: scroll(root block)`: a scroll-driven animation needs
  // `fill: both` to degrade, and in a browser without scroll timelines that
  // snaps the header to its END (solid) state permanently — which would put an
  // opaque ink bar over every hero at the top of the page. The listener is
  // passive, rAF-coalesced, writes one attribute, and only when the threshold
  // actually flips.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let frame = 0;
    let last: boolean | null = null;
    const sync = () => {
      frame = 0;
      const next = window.scrollY > 40;
      if (next === last) return;
      last = next;
      el.dataset.scrolled = next ? 'true' : 'false';
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    // Sync once on mount so a reload part-way down the page (scroll
    // restoration) doesn't paint a transparent header over content.
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = useCallback(() => {
    const panel = panelRef.current;
    if (panel && panel.contains(document.activeElement)) {
      restoreFocus.current = true;
    }
    setOpen(false);
  }, []);

  // Lock body scroll while the mobile menu is open so touch events don't
  // bleed through to the page underneath. Also closes the menu on Escape
  // AND on resize-to-desktop. Without the resize handler, a user who
  // opens the menu on mobile and rotates / resizes past the lg breakpoint
  // (where the panel + toggle both become display:none) would be left
  // with overflow:hidden permanently stuck on body — the page becomes
  // un-scrollable with no visible UI to fix it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    const lgMq = window.matchMedia('(min-width: 1280px)');
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu();
    };
    window.addEventListener('keydown', onKey);
    lgMq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      lgMq.removeEventListener('change', onMq);
    };
  }, [open, closeMenu]);

  // The panel is never unmounted now (it slides off-canvas), so it is marked
  // `inert` while closed — nothing inside is focusable, clickable or exposed to
  // assistive tech. Applying `inert` blurs whatever was focused inside it, so
  // focus is explicitly returned to the toggle.
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    toggleRef.current?.focus();
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled="false"
        data-light-surface={lightSurface ? 'true' : 'false'}
        className="ap-hdr fixed inset-x-0 top-0 z-50"
      >
        <div className="ap-hdr-bar mx-auto flex max-w-[1600px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="ap-hdr-logo flex items-center gap-3 shrink-0"
            aria-label="Auraplex — home"
          >
            <div className="ap-hdr-logo-mark relative h-8 w-7 shrink-0">
              <Image
                src="/brand/auraplex-logo.png"
                alt=""
                fill
                sizes="32px"
                className="object-contain object-left"
              />
            </div>
            <span className="font-mono uppercase tracking-[0.2em] text-sm relative">
              Auraplex
              <span className="ap-hdr-sweep -bottom-0.5" aria-hidden />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ap-hdr-nav hidden xl:flex items-center gap-5 font-mono text-sm uppercase">
            {NAV.map(({ key, href }) => (
              <NavLink key={key} href={href} label={t(key)} />
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-4 shrink-0">
            <SoundToggle />
            <SearchDialog />
            <LanguageSwitcher />
            <Button asChild size="sm">
              <Link href="/contact" className="whitespace-nowrap">{t('quote')}</Link>
            </Button>
          </div>

          {/* Toolbar ends here — no mobile-toggle spacer needed because the
              toggle is now rendered OUTSIDE the <header> (see below). On
              mobile the toolbar's justify-between balances logo vs. the
              implicit empty right edge; the actual toggle floats over the
              top-right via position:fixed at viewport scope. */}
        </div>
      </header>
      {/* ─────────────────────────────────────────────────────────────────
          Both the toggle button AND the mobile menu panel are siblings of
          <header> rather than children. Reason: the header carries a
          transform (its y-axis entrance animation) which creates a
          containing block for any descendant position:fixed elements.
          That meant the toggle's `top-5 right-5` was being resolved
          relative to the header's bounding box rather than the viewport,
          causing the button to drift during entrance / pin animations.
          Lifting them out makes fixed positioning resolve cleanly against
          the viewport on every device.
          ───────────────────────────────────────────────────────────────── */}

      {/* Mobile toggle — both icons stay mounted and cross-rotate in CSS. */}
      <button
        ref={toggleRef}
        type="button"
        className="ap-hdr-toggle xl:hidden fixed top-5 right-5 h-10 w-10 z-[70] flex items-center justify-center text-[color:var(--color-paper)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-signal)] focus-visible:outline-offset-2"
        onClick={() => (open ? closeMenu() : setOpen(true))}
        aria-label={tCommon('menuToggle')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        data-open={open ? 'true' : 'false'}
      >
        <span className="ap-hdr-toggle-icon ap-hdr-toggle-icon--menu" aria-hidden>
          <Menu />
        </span>
        <span className="ap-hdr-toggle-icon ap-hdr-toggle-icon--close" aria-hidden>
          <X />
        </span>
      </button>

      {/* Mobile menu — full-bleed slide from right with massive type. Always
          mounted, translated off-canvas, `inert` while closed. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        data-open={open ? 'true' : 'false'}
        className="ap-hdr-panel xl:hidden fixed inset-0 top-0 bg-[color:var(--color-ink)] z-[55] flex flex-col"
      >
        {/* Spacer so the close button is reachable */}
        <div className="h-20" aria-hidden />

        {/* Mobile nav links — staggered clip-path reveal */}
        <nav className="flex-1 px-8 py-12 flex flex-col gap-6 overflow-y-auto">
          {MOBILE_NAV.map(([k, href], i) => (
            <div
              key={k}
              style={{ '--i': i } as React.CSSProperties}
              className="ap-hdr-panel-item border-b border-[color:var(--color-neutral-800)] pb-4"
            >
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="font-display text-[clamp(2.5rem,11vw,5rem)] tracking-[-0.02em] leading-[1] block group"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)]">
                    0{i + 1}
                  </span>
                  <span className="group-hover:text-[color:var(--color-signal)] transition-colors duration-300">
                    {t(k)}
                  </span>
                </span>
              </Link>
            </div>
          ))}

          <div
            style={{ '--i': MOBILE_NAV.length } as React.CSSProperties}
            className="ap-hdr-panel-tail mt-8"
          >
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile footer mark */}
        <div className="px-8 py-6 border-t border-[color:var(--color-neutral-800)] font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)] flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)]" />
          Auraplex · MY · 2026
        </div>
      </div>
    </>
  );
}

/**
 * Nav link with a signal underline sweep on hover/focus.
 * The old hover letter-spacing expansion (0.15em → 0.3em) is gone on purpose:
 * animating letter-spacing relaid out the entire flex nav row every frame and
 * pushed the neighbouring links sideways. Colour + the scaleX sweep (composited,
 * layout-free) carry the hover state instead. See styles/motion/header.css.
 */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="ap-hdr-link relative whitespace-nowrap py-2 tracking-[0.12em] text-[color:var(--color-paper)]"
    >
      {label}
      <span className="ap-hdr-sweep bottom-0" aria-hidden />
    </Link>
  );
}
