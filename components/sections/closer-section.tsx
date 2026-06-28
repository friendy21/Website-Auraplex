'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/primitives/button';
import { whatsappLink } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * CloserSection — pinned, full-viewport cinematic finale for the home page.
 *
 * Scene (scrub-driven, +=2400px):
 *   0–25%  Massive "AURAPLEX" watermark scales from 1.2→1 + fades to 4% opacity.
 *   25–50% Eyebrow draws in. Headline words clip-wipe with weight sweep.
 *   50–75% Buttons spring-scale in with magnetic hover states.
 *   75–100% Entire scene drifts upward, ink floods, handing off to footer.
 */
export function CloserSection() {
  const container = useRef<HTMLElement>(null);
  const t = useTranslations('home.ctaFooter');

  useGSAP(
    () => {
      if (!container.current) return;

      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const prefersReduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReduce) {
        gsap.set('.c-watermark', { opacity: 0.04, scale: 1 });
        gsap.set('.c-eyebrow', { opacity: 1, scaleX: 1 });
        gsap.set('.c-word', { opacity: 1, clipPath: 'inset(0 0% 0 0)', fontVariationSettings: '"wght" 700' });
        gsap.set('.c-buttons', { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // No pin — static 100dvh+2400px runway + CSS sticky (see
      // manifesto-section.tsx for the CLS rationale).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
        defaults: { ease: 'none' },
      });

      // Beat 1 — watermark settles
      tl.fromTo(
        '.c-watermark',
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 0.04, duration: 0.25, ease: 'power2.out' },
      )
        // Beat 2 — eyebrow + headline
        .fromTo(
          '.c-eyebrow-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.15, ease: 'power2.out' },
          '+=0.05',
        )
        .fromTo(
          '.c-eyebrow-text',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.15 },
          '<0.05',
        )
        .fromTo(
          '.c-word',
          {
            opacity: 0,
            clipPath: 'inset(0 100% 0 0)',
            fontVariationSettings: '"wght" 200',
          },
          {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            fontVariationSettings: '"wght" 700',
            duration: 0.35,
            stagger: 0.035,
            ease: 'power3.out',
          },
          '<0.05',
        )
        // Beat 3 — buttons
        .fromTo(
          '.c-buttons',
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' },
          '+=0.05',
        )
        // Beat 4 — exit drift
        .to(
          '.c-cluster',
          { y: -80, opacity: 0, duration: 0.25, ease: 'power2.in' },
          '+=0.2',
        );
    },
    { scope: container },
  );

  // Split translated title into tokens for the clip-wipe stagger.
  const words = t('title').split(/\s+/).filter(Boolean);

  return (
    <section
      ref={container}
      className="relative bg-[color:var(--color-ink)] h-[100dvh] md:h-[calc(100dvh+2400px)] motion-reduce:h-[100dvh]!"
    >
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

        {/* Headline */}
        <h2 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
          {words.map((w, i) => (
            <span
              key={i}
              className="c-word inline-block whitespace-pre"
              style={{ fontVariationSettings: '"wght" 700' }}
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

      {/* Bottom signal hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-signal)]/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
