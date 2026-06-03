'use client';

import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { getMachine, getFeaturedMachines } from '@/lib/catalog';

gsap.registerPlugin(ScrollTrigger);

const SPEC_LINES = [
  { label: 'Container', value: '30 – 250 mm Ø' },
  { label: 'Vision', value: '1 ms detection' },
  { label: 'Label feed', value: 'servo-driven' },
  { label: 'Throughput', value: '120 units/min sustained' },
  { label: 'Reject', value: 'auto-deviation handling' },
  { label: 'Output', value: 'line-integration ready' },
];

/**
 * Pinned 5-scene narrative — replaces the mockup-bottle timeline with real
 * machine imagery driven by GSAP ScrollTrigger.
 *
 * Scenes (scrub-driven, total scroll = +=3800px):
 *   0 – 20%  Title chord — location dateline, signal dot pulses
 *   20 – 40% Hero machine enters from left, decelerates with overshoot.
 *            Spec lines clip-wipe in from right, stagger.
 *   40 – 60% Hero rotates 360°. Label graphic slides in and "applies" to it.
 *   60 – 80% Hero shrinks 1 → 0.55. Two supporting machines tile in beside it.
 *            Counter increments 1 → 30.
 *   80 –100% Machines fly off screen in stagger. Final CTA "30 machines."
 */
export function ScrollNarrative() {
  const container = useRef<HTMLElement>(null);

  // Real machines from the catalog — never hardcode image paths.
  const hero =
    getMachine('flexy-applicator') ?? getFeaturedMachines()[0] ?? null;
  const supporting = getFeaturedMachines()
    .filter((m) => m.slug !== hero?.slug)
    .slice(0, 2);

  useGSAP(
    () => {
      if (!container.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=3800',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
        defaults: { ease: 'power3.out' },
      });

      // ── Scene 1 — title chord (0–20% ≈ 0–0.7s scrub units)
      tl.fromTo(
        '.s1-dot',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
      )
        .fromTo(
          '.s1-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: 'power2.out' },
          '<0.1',
        )
        .fromTo(
          '.s1-dateline',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '<',
        )
        .fromTo(
          '.s1-headline',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '<0.2',
        )

        // ── Scene 2 — hero enters, specs cascade (20–40%)
        .to(
          '.s1-cluster',
          { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' },
          '+=0.3',
        )
        .fromTo(
          '.machine-hero',
          { x: '-120vw', opacity: 0, rotate: -8 },
          {
            x: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.4,
            ease: 'power4.out',
          },
          '<0.2',
        )
        .fromTo(
          '.machine-hero',
          { filter: 'drop-shadow(0 0 0 rgba(39,150,223,0))' },
          {
            filter: 'drop-shadow(0 0 60px rgba(39,150,223,0.45))',
            duration: 0.6,
          },
          '<0.6',
        )
        .fromTo(
          '.spec-row',
          { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '<-0.4',
        )

        // ── Scene 3 — rotation + label-application (40–60%)
        .to(
          '.machine-hero',
          { rotateY: 360, duration: 1.6, ease: 'power2.inOut' },
          '+=0.4',
        )
        .fromTo(
          '.s3-label',
          { x: '-100%', opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '<0.6',
        )

        // ── Scene 4 — zoom out, trio assembles, counter increments (60–80%)
        .to('.spec-row', { opacity: 0.25, duration: 0.4 }, '+=0.3')
        .to('.s3-label', { opacity: 0, duration: 0.4 }, '<')
        .to('.machine-hero', { scale: 0.55, duration: 0.8 }, '<')
        .fromTo(
          '.machine-side',
          { opacity: 0, x: 0, scale: 0.7 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: { each: 0.15, from: 'start' },
            x: (i) => (i === 0 ? '-110%' : '110%'),
            ease: 'power3.out',
          },
          '<0.2',
        )
        .fromTo(
          '.s4-counter',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '<0.2',
        )
        .to(
          '.s4-counter-value',
          {
            innerText: 30,
            duration: 1.0,
            snap: { innerText: 1 },
            ease: 'power1.out',
          },
          '<',
        )

        // ── Scene 5 — exit + closer (80–100%)
        .to(
          '.spec-row',
          { opacity: 0, x: 60, duration: 0.5, stagger: 0.04 },
          '+=0.4',
        )
        .to('.s4-counter', { opacity: 0, duration: 0.4 }, '<')
        .to(
          '.machine-hero, .machine-side',
          {
            x: '+=140vw',
            opacity: 0,
            duration: 1.0,
            stagger: 0.08,
            ease: 'power3.in',
          },
          '<-0.2',
        )
        .fromTo(
          '.s5-closer',
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          '<0.3',
        )
        .fromTo(
          '.s5-arrow',
          { x: -10, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '<0.2',
        );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative h-[100dvh] overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* Noise grain layer for cinematic texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" aria-hidden>
          <filter id="narrative-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#narrative-noise)" />
        </svg>
      </div>

      <div className="relative h-full mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* ── SCENE 1 — title chord (absolute layer, fades on transition) */}
        <div className="s1-cluster absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="s1-dot inline-block h-2 w-2 bg-[color:var(--color-signal)]" />
              <span className="s1-line inline-block h-px w-16 bg-[color:var(--color-signal)] origin-left" />
              <span className="s1-dateline font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
                Shah Alam · Selangor
              </span>
            </div>
            <h2 className="s1-headline font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl mx-auto">
              One machine.
              <br />
              <span className="text-[color:var(--color-neutral-400)]">
                Described in motion.
              </span>
            </h2>
          </div>
        </div>

        {/* ── SCENES 2–4 — hero + supporting machines + specs ── */}
        <div className="absolute inset-0 grid grid-cols-12 gap-6 items-center">
          {/* Left: machine cluster */}
          <div className="col-span-12 lg:col-span-7 relative h-full flex items-center justify-center">
            {/* Hero machine */}
            {hero?.image && (
              <div
                className="machine-hero relative w-[60%] aspect-square opacity-0"
                style={{
                  perspective: 1200,
                  transformStyle: 'preserve-3d',
                }}
              >
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-contain"
                />

                {/* Label graphic that "applies" itself in Scene 3 */}
                <div className="s3-label absolute left-[18%] right-[18%] top-[42%] bg-[color:var(--color-paper)] py-3 opacity-0 shadow-lg">
                  <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-[color:var(--color-ink)] text-center">
                    Auraplex · Made in Malaysia
                  </div>
                </div>
              </div>
            )}

            {/* Supporting machines — fly in from sides in Scene 4 */}
            {supporting.map((m) =>
              m.image ? (
                <div
                  key={m.id}
                  className="machine-side absolute w-[28%] aspect-square opacity-0"
                >
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-contain opacity-80"
                  />
                </div>
              ) : null,
            )}
          </div>

          {/* Right: spec list + counter */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — In motion / {hero?.name ?? 'Solo machine'}
            </div>
            {SPEC_LINES.map((s, i) => (
              <div
                key={i}
                className="spec-row font-mono text-sm md:text-base flex items-baseline gap-4 opacity-0 border-b border-[color:var(--color-neutral-800)] pb-2"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] min-w-[100px]">
                  {s.label}
                </span>
                <span className="text-[color:var(--color-paper)]">{s.value}</span>
              </div>
            ))}

            {/* Scene 4 counter */}
            <div className="s4-counter opacity-0 pt-8 flex items-baseline gap-4">
              <span className="font-display text-6xl text-[color:var(--color-signal)] tracking-[-0.02em]">
                <span className="s4-counter-value">1</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
                of 30 machines
              </span>
            </div>
          </div>
        </div>

        {/* ── SCENE 5 — final CTA ── */}
        <div className="s5-closer absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0">
          <div className="text-center">
            <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.03em] leading-[0.95]">
              30 machines.
              <br />
              <span className="text-[color:var(--color-signal)]">
                One floor.
              </span>
            </h2>
            <div className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-[color:var(--color-paper)] inline-flex items-center gap-3">
              See them all
              <span className="s5-arrow inline-block text-[color:var(--color-signal-bright)]">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
