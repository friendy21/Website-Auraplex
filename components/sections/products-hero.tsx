'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePerfTier } from '@/lib/hooks';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

/**
 * Catalogue hero — replaces the previous static one-time fade with a living
 * header: a large machine image levitates on the right behind a cerulean
 * halo and a slow-spinning precision ring, parallaxing as you scroll while
 * the headline stays anchored.
 *
 * Performance / a11y:
 *   - The whole visual is desktop-only (`hidden lg:block`) — phones never
 *     pay for it.
 *   - On reduced-motion (perf tier 'minimal') the levitation and scroll
 *     parallax are switched off; the image sits still.
 *   - Only transform/opacity animate (compositor-friendly). The decorative
 *     halo + ring are aria-hidden.
 */
export function ProductsHero({ eyebrow, title, subtitle, imageSrc, imageAlt }: Props) {
  const ref = useRef<HTMLElement>(null);
  const tier = usePerfTier();
  const still = tier === 'minimal';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -90]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-[1600px] px-6 lg:px-12 pt-32 pb-12 overflow-hidden"
    >
      {/* ── Floating machine (desktop only, decorative) ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: imgY, opacity: imgOpacity }}
        className="pointer-events-none absolute right-0 lg:right-8 -top-2 hidden lg:block w-[42vw] max-w-[600px] aspect-square"
      >
        {/* Cerulean halo */}
        <div
          className="absolute inset-[8%] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-signal) 38%, transparent) 0%, transparent 68%)',
          }}
        />

        {/* Slow-spinning dashed precision rings */}
        <svg
          viewBox="0 0 200 200"
          className="spin-slow absolute inset-0 h-full w-full opacity-30"
        >
          <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-signal)" strokeWidth="0.4" strokeDasharray="3 9" />
          <circle cx="100" cy="100" r="74" fill="none" stroke="var(--color-signal-bright)" strokeWidth="0.3" strokeDasharray="2 12" />
        </svg>

        {/* The levitating machine */}
        <motion.div
          animate={still ? undefined : { y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="relative h-full w-full"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="600px"
            priority
            className="object-contain p-10 [filter:drop-shadow(0_28px_50px_color-mix(in_oklab,var(--color-signal)_22%,transparent))]"
          />
        </motion.div>
      </motion.div>

      {/* ── Headline (anchored, fades up once) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — {eyebrow}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.95]">
            {title}
          </h1>
          <p className="max-w-md text-[color:var(--color-steel-soft)] text-base lg:text-lg lg:max-w-sm">
            {subtitle}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
