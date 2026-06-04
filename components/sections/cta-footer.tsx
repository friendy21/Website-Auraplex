'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { whatsappLink } from '@/lib/utils';

/**
 * CTA footer with cinematic flourish:
 *
 *  - 20vw "AURAPLEX" watermark behind the title, scales from 1.15 → 1 + fades
 *    in as the section enters view (opacity ~3%, just shy of subliminal).
 *  - Headline is split by words; each word fades + lifts with a variable
 *    font weight axis sweep (300 → 700, 80ms stagger).
 *  - Top signal-gradient hairline that fades out at both edges.
 *  - All three buttons wrapped in Magnetic so they pull toward the cursor.
 *  - WhatsApp button uses WhatsApp green (#25D366) gradient bleed-in on hover.
 */
export function CtaFooter() {
  const t = useTranslations('home.ctaFooter');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  const title = t('title');
  const words = title.split(/(\s+)/);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[color:var(--color-neutral-700)] mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48"
    >
      {/* Top signal hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent pointer-events-none" />

      {/* Watermark — massive AURAPLEX behind the title */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 0.035 } : { scale: 1.15, opacity: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display tracking-[-0.04em] leading-none whitespace-nowrap text-[color:var(--color-paper)] text-[20vw]">
          AURAPLEX
        </span>
      </motion.div>

      <div className="relative z-10">
        {/* Eyebrow signal mark */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-10 flex items-center gap-3"
        >
          <span className="h-px w-12 bg-[color:var(--color-signal)]" />
          {t('eyebrow')}
        </motion.div>

        {/* Title — word-by-word weight + lift reveal */}
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] tracking-[-0.03em] leading-[0.95] max-w-4xl">
          {words.map((w, i) => {
            if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
            return (
              <motion.span
                key={i}
                initial={{
                  opacity: 0,
                  y: 60,
                  fontVariationSettings: '"wght" 300',
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        y: 0,
                        fontVariationSettings: '"wght" 700',
                      }
                    : {
                        opacity: 0,
                        y: 60,
                        fontVariationSettings: '"wght" 300',
                      }
                }
                transition={{
                  duration: 0.9,
                  delay: i * 0.04,
                  ease: [0.65, 0, 0.35, 1],
                }}
                style={{ display: 'inline-block' }}
              >
                {w}
              </motion.span>
            );
          })}
        </h2>

        {/* Button cluster */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="mt-14 flex flex-wrap gap-4"
        >
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
                href={whatsappLink(t('whatsapp'))}
                target="_blank"
                rel="noreferrer"
              >
                {t('whatsapp')} →
              </a>
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
