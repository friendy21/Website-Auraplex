'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { HeroParticles } from '@/components/sections/hero-particles';

// ParticleMesh (4000 R3F points) was removed from the hero — running it
// alongside HeroParticles (Canvas2D constellation) AND the YouTube video
// meant three concurrent particle systems composited every frame, the
// single biggest perf hit on the page. HeroParticles + the video give
// enough visual depth on their own; ParticleMesh can be revived on a
// less-trafficked page later if needed.
import { YoutubeHeroBg } from '@/components/sections/youtube-hero-bg';
import { getFeaturedMachines } from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';

// Hero background YouTube video. If YouTube blocks the embed (Shorts
// restriction, bot wall, region lock, etc.), YoutubeHeroBg detects the
// failure within 6s and fades itself to opacity 0 — the HeroParticles
// layer underneath then carries the hero seamlessly.
const HERO_VIDEO_ID = 'vqv4IKY30BU';

/**
 * Hero — orchestrated 3.2s entrance timeline, generative background.
 *
 * Background layers (deepest → nearest):
 *   1. HeroParticles — 120 drifting signal-coloured nodes with proximity
 *      connections. Reacts to cursor. Pure Canvas2D, no video asset.
 *   2. ShaderGrid — existing WebGL ripple overlay (now more prominent).
 *   3. Ink darkening + vignette — ensures legibility.
 *   4. CursorSpotlight — reactive halo following pointer.
 *
 * Scroll-driven (0 → 100vh):
 *   - H1 scales 1 → 0.85, translateY 0 → -60px
 *   - Machine collage parallaxes at 0.4× scroll with per-card lag
 *   - Particles fade out as ink overlay floods in
 *   - Shader fades out
 */
export function HeroCinematic() {
  const t = useTranslations('home');
  const machines = getFeaturedMachines().slice(0, 3);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven values for the entire hero
  const h1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const h1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const collageY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const shaderOpacity = useTransform(scrollYProgress, [0, 0.6], [0.45, 0]);
  const particleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const inkOverlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 0.75]);
  const signalLineScaleX = useTransform(scrollYProgress, [0, 0.5], [0.1, 1]);

  const headline = t('heroH1');
  const words = headline.split(/(\s+)/);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* ── Layer 0: Particle constellation — deepest layer, always rendered.
              Acts as the visual fallback when the YouTube embed fails. ── */}
      <motion.div
        style={{ opacity: particleOpacity }}
        className="absolute inset-0"
      >
        <HeroParticles />
      </motion.div>

      {/* ── Layer 1: YouTube factory video — sits above the particle layer.
              When playing, it covers the particles entirely. When YouTube
              blocks the embed it fades to opacity 0 and the particles below
              become the hero. Watchdog: 6s for state PLAYING. ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        style={{ opacity: particleOpacity }}
        className="absolute inset-0"
      >
        <YoutubeHeroBg id={HERO_VIDEO_ID} title={t('heroVideoTitle')} />
      </motion.div>

      {/* ── Layer 2: video darkening + brand wash ── */}
      <div className="absolute inset-0 bg-[color:var(--color-ink)]/50 pointer-events-none" />

      {/* ── Atmosphere: drifting cerulean aurora + static grain tile.
              Both compositor-safe — the aurora animates transform only;
              the grain is a static background-image (no runtime filter). ── */}
      <div className="aurora-blob -bottom-[20vw] -left-[15vw]" aria-hidden="true" />
      <div className="absolute inset-0 grain-static" aria-hidden="true" />

      {/* Cursor spotlight halo */}
      <CursorSpotlight size={420} intensity={0.2} />

      {/* Ink overlay that floods in as user scrolls past the hero */}
      <motion.div
        style={{ opacity: inkOverlayOpacity }}
        className="absolute inset-0 bg-[color:var(--color-ink)] pointer-events-none"
      />

      {/* Diagonal sweep + left-edge fade */}
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-ink)] via-[color:var(--color-ink)]/25 to-[color:var(--color-ink)] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[color:var(--color-ink)] via-[color:var(--color-ink)]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color:var(--color-ink)] to-transparent pointer-events-none" />

      {/* Machine collage — parallaxes on scroll, springs in on load */}
      <motion.div
        style={{ y: collageY }}
        className="pointer-events-none absolute right-0 bottom-0 w-full max-w-[55vw] h-[80%] hidden lg:block"
        aria-hidden="true"
      >
        {machines.map((m, i) => {
          if (!m.image) return null;
          const positions = [
            { right: '8%', bottom: '12%', size: 380, rotate: -4, delay: 2.0 },
            { right: '28%', bottom: '32%', size: 280, rotate: 6, delay: 2.15 },
            { right: '2%', bottom: '52%', size: 220, rotate: -2, delay: 2.3 },
          ];
          const p = positions[i];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 100, rotate: p.rotate * 2.5, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, rotate: p.rotate, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 14,
                delay: p.delay,
                opacity: { duration: 0.7, delay: p.delay },
              }}
              style={{
                right: p.right,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
                position: 'absolute',
              }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{
                  duration: 6 + i * 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 3 + i * 0.6,
                }}
                className="relative w-full h-full"
              >
                <div className="absolute inset-0 bg-[color:var(--color-neutral-800)]/80 backdrop-blur-sm border border-[color:var(--color-neutral-700)]" />
                <Image
                  src={m.image}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-contain p-8 mix-blend-luminosity opacity-90"
                />
                <div className="absolute bottom-2 left-2 right-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-400)]">
                  {m.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Right-edge ink fade */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-transparent hidden lg:block pointer-events-none" />

      <motion.div
        style={{ scale: h1Scale, y: h1Y }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 lg:px-12 lg:pb-32"
      >
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            {/* Eyebrow: signal line + ID */}
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                style={{ originX: 0 }}
                className="h-px w-12 bg-[color:var(--color-signal)]"
              />
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('heroEyebrow')}
              </motion.span>
            </div>

            {/* H1 — words fly in from a 3D depth plane (perspective on
                the parent so each word's rotateX reads as true depth) */}
            <h1
              className="font-display text-[clamp(3rem,8vw,7.5rem)] tracking-[-0.02em] leading-[0.92]"
              style={{ perspective: 900 }}
            >
              {words.map((word, i) => {
                if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
                return <HeroWord key={i} word={word} index={i} />;
              })}
            </h1>

            {/* Subtitle — mask reveal */}
            <motion.p
              initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.9, delay: 1.4, ease: [0.65, 0, 0.35, 1] }}
              className="mt-8 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)]"
            >
              {t('heroSub')}
            </motion.p>

            {/* CTAs — magnetic, spring-scale in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 1.7,
              }}
              className="mt-10 flex flex-wrap gap-4"
            >
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
            </motion.div>
          </div>

          {/* Live spec callout — slides in from right, with a slowly
              rotating dashed precision ring behind it (CSS spin-slow,
              compositor-only) */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="relative col-span-12 lg:col-span-4 lg:col-start-9 border-l border-[color:var(--color-signal)] pl-6 py-2"
          >
            <svg
              viewBox="0 0 200 200"
              className="spin-slow absolute -top-16 -right-10 h-44 w-44 opacity-25 pointer-events-none hidden lg:block"
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="1"
                strokeDasharray="4 10"
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="var(--color-signal-bright)"
                strokeWidth="0.5"
                strokeDasharray="2 14"
              />
            </svg>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--color-steel)] mb-2">
              {t('heroLiveSpecLabel')}
            </div>
            <div className="font-mono text-lg text-[color:var(--color-paper)] leading-relaxed">
              {t('heroCallout')}
            </div>
          </motion.aside>
        </div>
      </motion.div>

      {/* Bottom signal line — scales to full width on scroll */}
      <motion.div
        style={{ scaleX: signalLineScaleX, originX: 0 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[color:var(--color-signal)] via-[color:var(--color-signal-bright)] to-[color:var(--color-signal)]/0"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] flex flex-col items-center gap-2 z-20 pointer-events-none"
      >
        <span>{t('heroScrollLabel')}</span>
        {/* Breathing line + traveling spark (CSS-only via .scroll-spark —
            the dot rides the ::after, no JS per-frame cost) */}
        <div className="scroll-spark h-8 w-px bg-gradient-to-b from-[color:var(--color-steel)] via-[color:var(--color-signal)]/60 to-transparent" />
      </motion.div>
    </section>
  );
}

function HeroWord({ word, index }: { word: string; index: number }) {
  return (
    <motion.span
      // 3D flight entrance — each word launches from below the baseline,
      // rotated back 75° in depth, blurred, then snaps into place.
      // transform + opacity + filter only: composited, zero layout cost,
      // CLS-exempt (the weight stays static — animating
      // fontVariationSettings reflows glyph widths and was measured at
      // 0.15 CLS before being removed). Base delay stays tight at 0.1s
      // because the H1 is the page's LCP element.
      style={{
        display: 'inline-block',
        fontVariationSettings: '"wght" 700',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      initial={{
        opacity: 0,
        y: 70,
        rotateX: 75,
        scale: 0.85,
        filter: 'blur(10px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: 0.85,
        delay: 0.1 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {word}
    </motion.span>
  );
}
