'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import dynamic from 'next/dynamic';
import { HeroParticles } from '@/components/sections/hero-particles';

// ParticleMesh ships Three.js — keep it out of the server bundle and the
// initial JS payload. Lazy-loaded after first paint.
const ParticleMesh = dynamic(
  () => import('@/components/three/particle-mesh').then((m) => m.ParticleMesh),
  { ssr: false },
);
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

      {/* Cursor spotlight halo */}
      <CursorSpotlight size={420} intensity={0.2} />

      {/* ── Layer 2: ParticleMesh — replaces ShaderGrid (v3). 4000-point
              R3F field with cursor repulsion + scroll-velocity ripple.
              Hidden below sm to protect mobile perf. ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        style={{ opacity: shaderOpacity }}
        className="absolute inset-0 hidden sm:block"
      >
        <ParticleMesh opacity={1} />
      </motion.div>

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

            {/* H1 — words clip-wipe in with variable weight axis */}
            <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] tracking-[-0.02em] leading-[0.92]">
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

          {/* Live spec callout — slides in from right */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="col-span-12 lg:col-span-4 lg:col-start-9 border-l border-[color:var(--color-signal)] pl-6 py-2"
          >
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
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-px bg-[color:var(--color-steel)]"
        />
      </motion.div>
    </section>
  );
}

function HeroWord({ word, index }: { word: string; index: number }) {
  return (
    <motion.span
      initial={{
        clipPath: 'inset(0 100% 0 0)',
        fontVariationSettings: '"wght" 200',
      }}
      animate={{
        clipPath: 'inset(0 0% 0 0)',
        fontVariationSettings: '"wght" 700',
      }}
      transition={{
        duration: 0.9,
        delay: 0.6 + index * 0.04,
        ease: [0.76, 0, 0.24, 1],
      }}
      style={{ display: 'inline-block' }}
    >
      {word}
    </motion.span>
  );
}
