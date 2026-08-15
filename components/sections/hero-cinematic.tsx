'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from '@/lib/navigation';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { HeroTunnel } from '@/components/sections/hero-tunnel';
import { whatsappLink } from '@/lib/utils';

/**
 * Hero — the runway INTO the MachineHyperscroll signature.
 *
 * The background is a single bespoke element: HeroTunnel, a receding
 * perspective corridor of signal rings + motes on ink. It reads as "the
 * mouth of the machine tunnel", so when the visitor scrolls the hero
 * dissolves straight into the Hyperscroll flythrough — one continuous dive,
 * no video, no stacked particle systems, no hard cut.
 *
 * Type is deliberately loud (up to ~14vw) and the entrance is cinematic:
 * the headline is the LCP element and paints from server HTML via the
 * CSS-driven .hero-word class (no motion-bundle wait).
 *
 * Scroll-driven (0 → 100vh): headline scales down + lifts, tunnel and copy
 * fade, ink floods so the Hyperscroll's first frame emerges from the centre.
 */
export function HeroCinematic() {
  const t = useTranslations('home');

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const h1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const h1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const tunnelOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const tunnelScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const inkOverlayOpacity = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const signalLineScaleX = useTransform(scrollYProgress, [0, 0.5], [0.1, 1]);

  const headline = t('heroH1');
  const words = headline.split(/(\s+)/);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* ── Bespoke tunnel background (single element) ── */}
      <motion.div
        style={{ opacity: tunnelOpacity, scale: tunnelScale }}
        className="absolute inset-0"
      >
        {/* Static gradient shows through on minimal tier / before mount */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 52%, color-mix(in oklab, var(--color-signal) 10%, transparent), transparent 70%)',
          }}
        />
        <HeroTunnel />
      </motion.div>

      {/* Cursor spotlight halo */}
      <CursorSpotlight size={460} intensity={0.16} />

      {/* Ink flood — the Hyperscroll below emerges from this centre as we scroll */}
      <motion.div
        style={{ opacity: inkOverlayOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[color:var(--color-ink)]" />
      </motion.div>

      {/* Edge vignette so the corridor fades into the frame */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[color:var(--color-ink)]/60 via-transparent to-[color:var(--color-ink)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-transparent" />

      {/* ── Content ── */}
      <motion.div
        style={{ scale: h1Scale, y: h1Y, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 lg:px-12"
      >
        {/* Eyebrow — SIGNAL SWEEP. CSS-driven so it paints from server HTML.
            The old version animated `letterSpacing`, which is a LAYOUT property:
            it reflowed the eyebrow row on every frame and was a measured CLS
            source (0.005 per shift, three times during load). Tracking is now
            static and only the hairline scales — transform-only, no reflow. */}
        <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
          <span className="signal-sweep h-px w-16 bg-[color:var(--color-signal)]" />
          <span className="hero-rise">{t('heroEyebrow')}</span>
        </div>

        {/* H1 — loud, CSS-driven LCP flight */}
        <h1
          className="font-display tracking-[-0.03em] leading-[0.86] text-[clamp(3.25rem,12vw,11rem)] max-w-[15ch]"
          style={{ perspective: 900 }}
        >
          {words.map((word, i) => {
            if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
            return <HeroWord key={i} word={word} index={i} />;
          })}
        </h1>

        {/* Subtitle — THE LCP ELEMENT (larger than the H1 on mobile).
            CSS transform-only entrance so it paints from the server HTML
            instead of waiting for hydration. See .hero-rise. */}
        <p className="hero-rise hero-rise-2 mt-10 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)] text-lg">
          {t('heroSub')}
        </p>

        {/* CTAs */}
        <div className="hero-rise hero-rise-3 mt-12 flex flex-wrap gap-4">
          <Magnetic strength={0.4} radius={100}>
            <Button asChild size="lg">
              <Link href="/products">{t('ctaPrimary')} →</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="ghost" size="lg">
              <a
                href={whatsappLink(t('heroWhatsappMsg'))}
                target="_blank"
                rel="noreferrer"
              >
                {t('ctaSecondary')} →
              </a>
            </Button>
          </Magnetic>
        </div>
      </motion.div>

      {/* Corner HUD — rhymes with the MachineHyperscroll HUD so the hero reads
          as the entrance to the same system. Fades out as we dive in. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        style={{ opacity: copyOpacity }}
        className="pointer-events-none absolute inset-6 z-20 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] lg:block"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 text-right leading-relaxed">
          <div className="text-[color:var(--color-signal)]">SYS / READY</div>
          <div>DEPTH 0000</div>
        </div>
        <div className="absolute bottom-0 right-0">MY · 03.1189 N · 101.6869 E</div>
        <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-[color:var(--color-paper)]/25" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[color:var(--color-paper)]/25" />
      </motion.div>

      {/* Bottom signal line */}
      <motion.div
        style={{ scaleX: signalLineScaleX, originX: 0 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[color:var(--color-signal)] via-[color:var(--color-signal-bright)] to-[color:var(--color-signal)]/0"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        style={{ opacity: copyOpacity }}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] pointer-events-none"
      >
        <span>{t('heroScrollLabel')}</span>
        <div className="scroll-spark h-8 w-px bg-gradient-to-b from-[color:var(--color-steel)] via-[color:var(--color-signal)]/60 to-transparent" />
      </motion.div>
    </section>
  );
}

function HeroWord({ word, index }: { word: string; index: number }) {
  // LCP element — CSS-driven (.hero-word) so it paints from server HTML.
  //
  // RULE ZERO: the keyframe animates TRANSFORM ONLY (no opacity), so every word
  // is an LCP candidate from the first frame. The stagger is also capped: the
  // English headline is 15 tokens, and at the old 0.06s/word the last word did
  // not settle until ~1.8s, which put a network-independent floor under LCP.
  // 0.028s/word capped at 0.28s keeps the sweep legible without gating paint.
  return (
    <span
      className="hero-word"
      style={{
        fontVariationSettings: '"wght" 700',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        animationDelay: `${Math.min(0.06 + index * 0.028, 0.28)}s`,
      }}
    >
      {word}
    </span>
  );
}
