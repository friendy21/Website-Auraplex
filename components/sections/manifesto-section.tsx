'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ManifestoSection — pinned, full-viewport cinematic statement.
 *
 * A single massive phrase fills the screen and animates in three beats:
 *   Beat 1 (0–30%): Signal line draws left-to-right. Massive words clip-wipe
 *                   in with variable font weight sweep, 60ms stagger.
 *   Beat 2 (30–60%): Sub-line fades up. Three signal dots pulse in a row.
 *   Beat 3 (60–100%): Entire cluster drifts upward and fades, handing off
 *                      cleanly to the next section.
 *
 * Pinned for +=2200px of scroll. Mobile falls back to a simple fade.
 */
export function ManifestoSection() {
  const container = useRef<HTMLElement>(null);
  const t = useTranslations('home.manifesto');

  useGSAP(
    () => {
      if (!container.current) return;

      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const prefersReduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReduce) {
        // Degraded: show final state immediately
        gsap.set('.m-word', { opacity: 1, clipPath: 'inset(0 0% 0 0)', fontVariationSettings: '"wght" 700' });
        gsap.set('.m-signal-line', { scaleX: 1 });
        gsap.set('.m-sub', { opacity: 1, y: 0 });
        gsap.set('.m-dots', { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      });

      // Beat 1 — signal line draws, words clip-wipe in
      tl.fromTo(
        '.m-signal-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.25, ease: 'power2.out' },
      )
        .fromTo(
          '.m-word',
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
            stagger: 0.04,
            ease: 'power3.out',
          },
          '<0.05',
        )
        // Beat 2 — sub-line + dots
        .fromTo(
          '.m-sub',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          '+=0.05',
        )
        .fromTo(
          '.m-dot',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.15, stagger: 0.06, ease: 'back.out(2)' },
          '<0.1',
        )
        // Beat 3 — exit drift for clean handoff
        .to(
          '.m-cluster',
          { y: -60, opacity: 0, duration: 0.25, ease: 'power2.in' },
          '+=0.15',
        );
    },
    { scope: container },
  );

  // Split the translated title into word tokens for the clip-wipe stagger.
  // CJK locales without inter-word spaces collapse to a single token — the
  // clip-wipe still reads as one cohesive reveal there, which is correct.
  const words = t('title').split(/\s+/).filter(Boolean);

  return (
    <section
      ref={container}
      className="relative h-[100dvh] overflow-hidden bg-[color:var(--color-ink)] flex items-center"
    >
      {/* Atmospheric noise grain for this section */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" aria-hidden>
          <filter id="manifesto-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#manifesto-noise)" />
        </svg>
      </div>

      <div className="m-cluster relative z-10 mx-auto max-w-[1600px] w-full px-6 lg:px-12">
        {/* Eyebrow signal line */}
        <div className="flex items-center gap-4 mb-10">
          <div className="m-signal-line h-px w-20 bg-[color:var(--color-signal)] origin-left" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
            {t('eyebrow')}
          </span>
        </div>

        {/* Massive manifesto text */}
        <h2 className="font-display text-[clamp(3.5rem,11vw,10rem)] tracking-[-0.03em] leading-[0.92] max-w-[90vw]">
          {words.map((w, i) => (
            <span
              key={i}
              className="m-word inline-block whitespace-pre"
              style={{ fontVariationSettings: '"wght" 700' }}
            >
              {w}{' '}
            </span>
          ))}
        </h2>

        {/* Sub-line */}
        <div className="m-sub mt-12 max-w-xl">
          <p className="font-mono text-sm md:text-base text-[color:var(--color-steel-soft)] leading-relaxed">
            {t('body')}
          </p>
        </div>

        {/* Signal dots */}
        <div className="m-dots mt-14 flex items-center gap-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="m-dot inline-block h-2 w-2 bg-[color:var(--color-signal)]"
            />
          ))}
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] ml-2">
            {t('region')}
          </span>
        </div>
      </div>

      {/* Bottom-right massive watermark */}
      <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16 font-display text-[color:var(--color-neutral-800)] text-[15vw] leading-none tracking-[-0.04em] select-none pointer-events-none" aria-hidden="true">
        01
      </div>
    </section>
  );
}
