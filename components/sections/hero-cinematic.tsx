'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { ShaderGrid } from '@/components/three/shader-grid';
import { getFeaturedMachines } from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';

/**
 * Hero — orchestrated 3.2s entrance timeline:
 *
 *   0ms     Shader grid begins ramping in (0 → 60% over 1.2s)
 *   200ms   Signal line draws in left-to-right
 *   400ms   Eyebrow ("Auraplex · MY · 2026") tracks in
 *   600ms   H1 splits into words, each word: clip wipe + weight axis 200→700
 *           stagger 80ms, duration 0.9s per word
 *   1400ms  Subtitle: line-mask reveal
 *   1700ms  CTAs: scale 0.8 → 1 + opacity
 *   2000ms  Machine collage: each card spring-floats into position
 *   2400ms  Scroll indicator starts pulsing
 *
 * Scroll-driven (0 → 100vh):
 *   - H1 scales 1 → 0.85, translateY 0 → -60px
 *   - Machine collage parallaxes at 0.4× scroll
 *   - Shader fades out as ink overlay fades in
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
  const shaderOpacity = useTransform(scrollYProgress, [0, 0.6], [0.6, 0]);
  const inkOverlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 0.7]);
  const signalLineScaleX = useTransform(scrollYProgress, [0, 0.5], [0.1, 1]);

  // Split the headline into words for staggered reveal
  const headline = t('heroH1');
  const words = headline.split(/(\s+)/); // keeps whitespace tokens

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* Cursor spotlight halo */}
      <CursorSpotlight size={460} intensity={0.22} />

      {/* WebGL shader background — ramps to 60% over 1.2s, fades on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ opacity: shaderOpacity }}
        className="absolute inset-0"
      >
        <ShaderGrid />
      </motion.div>

      {/* Ink overlay that floods in as user scrolls */}
      <motion.div
        style={{ opacity: inkOverlayOpacity }}
        className="absolute inset-0 bg-[color:var(--color-ink)] pointer-events-none"
      />

      {/* Diagonal sweep + edge fades for editorial weight */}
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-ink)] via-transparent to-[color:var(--color-ink)] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[color:var(--color-ink)] via-[color:var(--color-ink)]/70 to-transparent pointer-events-none" />

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
              initial={{ opacity: 0, y: 80, rotate: p.rotate * 2, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotate: p.rotate, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 12,
                delay: p.delay,
                opacity: { duration: 0.6, delay: p.delay },
              }}
              style={{ right: p.right, bottom: p.bottom, width: p.size, height: p.size, position: 'absolute' }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 7 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 3 + i * 0.7,
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

      {/* Right-edge ink fade so text never collides with imagery */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-transparent hidden lg:block pointer-events-none" />

      <motion.div
        style={{ scale: h1Scale, y: h1Y }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 lg:px-12 lg:pb-32"
      >
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            {/* Eyebrow: signal line + ID — line draws @200ms, text tracks @400ms */}
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
                Auraplex · MY · 2026
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
                    href={whatsappLink('Hi Auraplex, I saw your site and want to talk.')}
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
              Live spec
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
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-px bg-[color:var(--color-steel)]"
        />
      </motion.div>
    </section>
  );
}

/**
 * Single hero word — clip-path wipe + variable font weight axis sweep.
 * Stagger handled via per-word delay (600ms + i * 80ms).
 */
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
