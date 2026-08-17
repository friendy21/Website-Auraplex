import type { CSSProperties } from 'react';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/primitives/button';
import { whatsappLink } from '@/lib/utils';

/**
 * CloserSection — full-viewport cinematic finale for the home page.
 *
 * Scene (scroll-scrubbed across the 2400px runway below the sticky viewport):
 *   0–25%  Massive "AURAPLEX" watermark scales from 1.15→1 + fades to 4%.
 *   25–50% Eyebrow draws in. Headline words clip-wipe with a weight sweep.
 *   50–75% Buttons spring-scale in with magnetic hover states.
 *   75–100% Entire cluster drifts upward, HUD powers down, handing off to
 *           the footer.
 *
 * No pin: the section is a static 100dvh + 2400px runway with a CSS `sticky`
 * viewport inside it, so no pin-spacer is injected at runtime and the section's
 * height is known to the layout engine on the first frame (the CLS rationale
 * this section has always carried).
 *
 * Motion lives in styles/motion/closer.css, wired centrally from globals.css.
 * It replaces a GSAP timeline + ScrollTrigger scrub with a single named view
 * timeline (`--closer-run`), which is why this component no longer needs
 * 'use client': the choreography is live from the first paint of the server
 * HTML instead of waiting on hydration.
 */
export function CloserSection() {
  const t = useTranslations('home.ctaFooter');

  // Split translated title into tokens for the clip-wipe stagger.
  const words = t('title').split(/\s+/).filter(Boolean);

  return (
    <section className="closer-stage relative bg-[color:var(--color-ink)] h-[100dvh] md:h-[calc(100dvh+2400px)] motion-reduce:h-[100dvh]!">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
      {/* Watermark */}
      <div
        className="c-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display tracking-[-0.04em] leading-none whitespace-nowrap text-[color:var(--color-paper)] text-[22vw]">
          AURAPLEX
        </span>
      </div>

      {/* Content cluster */}
      <div className="c-cluster relative z-10 mx-auto max-w-[1600px] w-full px-6 lg:px-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="c-eyebrow-line h-px w-16 bg-[color:var(--color-signal)] origin-left" />
          <span className="c-eyebrow-text font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
            {t('eyebrow')}
          </span>
        </div>

        {/* Headline. `--i` drives the per-word stagger through animation-range
            offsets (a time-based animation-delay is ignored on a progress
            timeline). Clamped so a long translation cannot push a word's range
            past the end of the run. */}
        <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
          {words.map((w, i) => (
            <span
              key={i}
              className="c-word inline-block whitespace-pre"
              style={{ '--i': Math.min(i, 6) } as CSSProperties}
            >
              {w}{' '}
            </span>
          ))}
        </h2>

        {/* Buttons */}
        <div className="c-buttons mt-14 flex flex-wrap gap-4">
          <Magnetic strength={0.4} radius={100}>
            <Button asChild size="lg">
              <Link href="/contact">{t('quote')} →</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="ghost" size="lg">
              <Link href="/about#tour">{t('tour')} →</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="ghost" size="lg">
              <a
                href={whatsappLink(t('whatsappMsg'))}
                target="_blank"
                rel="noreferrer"
              >
                {t('whatsapp')} →
              </a>
            </Button>
          </Magnetic>
        </div>
      </div>

      {/* Corner HUD — "exit the system". Mirrors the hero console: DEPTH
          counts back down to 0000 and the state flips to STANDBY as the
          finale drifts away. Closes the arc symmetrically.
          The DEPTH digits are generated content driven by an animated
          registered custom property (see closer.css) — the span is empty on
          purpose, and the whole HUD is aria-hidden decoration. */}
      <div
        className="c-hud pointer-events-none absolute inset-6 z-20 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] lg:block"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 text-right leading-relaxed">
          <div className="c-hud-state text-[color:var(--color-signal)]">SYS / STANDBY</div>
          <div>
            DEPTH <span className="c-depth" />
          </div>
        </div>
        <div className="absolute bottom-0 right-0">MY · 03.1189 N · 101.6869 E</div>
        <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-[color:var(--color-paper)]/25" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[color:var(--color-paper)]/25" />
      </div>

      {/* Bottom signal hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
