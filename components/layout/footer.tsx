import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import type { CSSProperties, ReactNode } from 'react';

import '@/styles/motion/footer.css';

// Real Auraplex social profiles, extracted from the live
// autolabellermalaysia.com footer HTML (canonical forms, tracking
// params stripped). Do not add networks that aren't verified there.
const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/p/Auraplex-100068561114645' },
  { name: 'Instagram', href: 'https://www.instagram.com/auraplex_/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@auraplex5219' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@auraplex_' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/auraplex/' },
  { name: 'Shopee', href: 'https://shopee.com.my/auraplex' },
] as const;

/**
 * Global footer — animated reveals + cerulean underline on every link.
 *
 * Columns reveal on a scroll-driven cascade (see styles/motion/footer.css);
 * the footer is below the fold on every page, so the scroll clock — not a
 * wall clock — is the correct transport. Every link has a left-anchored
 * underline that scaleX-draws on hover. Bottom band has a pulsing signal dot
 * next to the "Made in Malaysia" mark.
 *
 * Server Component: this renders on every route, and nothing here needs
 * state, effects or handlers. next-intl's useTranslations is server-safe.
 */
export function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative mt-32 pb-8 overflow-hidden">
      {/* Signal gradient hairline at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/50 to-transparent" />

      {/* The Motion stagger orchestrator that used to wrap this grid is gone:
          each column now carries its own scroll-driven reveal, offset by
          --footer-col-i. */}
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand block */}
        <FooterCol index={0} className="col-span-2">
          <Link
            href="/"
            className="footer-brand group inline-flex items-center gap-3"
            aria-label="Auraplex — home"
          >
            <div className="footer-logo-mark relative h-10 w-9 shrink-0">
              <Image
                src="/brand/auraplex-logo.png"
                alt=""
                fill
                sizes="40px"
                className="object-contain object-left"
              />
            </div>
            <span className="font-mono uppercase tracking-[0.2em] relative">
              Auraplex
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
            </span>
          </Link>
          <p className="mt-6 max-w-md text-[color:var(--color-steel-soft)] prose-editorial">
            {t('meta.tagline')}
          </p>
          <div className="mt-8 font-mono text-xs uppercase tracking-wider text-[color:var(--color-steel)] space-y-1">
            <div>{t('footer.address')}</div>
            <div className="text-[color:var(--color-steel-soft)]">
              sales.auraplex@gmail.com
            </div>
            <div className="text-[color:var(--color-steel-soft)]">
              1700-82-6502 · 603-8940-7709
            </div>
          </div>

          {/* Social row — mono text links matching the design system */}
          <div className="mt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
              {t('footer.follow')}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] hover:text-[color:var(--color-paper)] transition-colors duration-300"
                >
                  <span className="relative">
                    {s.name}
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FooterCol>

        <FooterCol index={1}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5">
            {t('nav.products')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <FooterLink href="/products?category=labelling">
                {t('home.categories.labelling')}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/products?category=packaging">
                {t('home.categories.packaging')}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/products?category=automation">
                {t('home.categories.automation')}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/products">{t('footer.allMachines')} →</FooterLink>
            </li>
          </ul>
        </FooterCol>

        <FooterCol index={2}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5">
            {t('nav.company')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <FooterLink href="/about">{t('nav.about')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/services">{t('nav.services')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/case-studies">{t('nav.caseStudies')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/news">{t('nav.news')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/internship">{t('nav.internship')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/2026">{t('nav.yearReview')}</FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">{t('nav.contact')}</FooterLink>
            </li>
          </ul>
        </FooterCol>
      </div>

      {/* Bottom rights band */}
      <div className="footer-band-in mx-auto max-w-[1600px] px-6 lg:px-12 flex justify-between flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] pt-6 border-t border-[color:var(--color-neutral-800)]">
        <span className="flex items-center gap-6 flex-wrap">
          <span>{t('footer.rights')}</span>
          <span className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[color:var(--color-paper)] transition"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              className="hover:text-[color:var(--color-paper)] transition"
            >
              {t('footer.terms')}
            </Link>
          </span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-[color:var(--color-signal)] ping-signal" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]" />
          </span>
          {t('footer.made')}
        </span>
      </div>
    </footer>
  );
}

/**
 * One footer column. `index` is the cascade position: it feeds
 * --footer-col-i, which offsets the column's `animation-range` start inside
 * the entry phase. That offset IS the stagger — `animation-delay` is a time
 * value and is ignored on a scroll progress timeline.
 */
function FooterCol({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <div
      className={`footer-col-rule footer-col-in ${className ?? ''}`.trim()}
      style={{ '--footer-col-i': index } as CSSProperties}
    >
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[color:var(--color-steel-soft)] hover:text-[color:var(--color-paper)] transition-colors duration-300"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
      </span>
    </Link>
  );
}
