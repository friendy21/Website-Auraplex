'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const SPEC_LINES = [
  'Container intake · 30–250mm diameter',
  'Vision system · 1ms detection',
  'Label feed · servo-driven precision',
  'Wrap & smooth · 120 units/min sustained',
  'Reject station · automatic deviation handling',
  'Output · ready for line integration',
];

export function ScrollNarrative() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.from('.bottle', { x: -400, opacity: 0, duration: 1, ease: 'power2.out' })
        .to('.label-strip', { scaleX: 1, duration: 0.6 }, '<0.4')
        .to('.bottle', { rotate: 360, duration: 0.8, ease: 'power1.inOut' })
        .from('.spec-line', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '<-0.4')
        .to('.bottle', { x: 400, opacity: 0, duration: 1, ease: 'power2.in' });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative h-[100dvh] overflow-hidden bg-[color:var(--color-ink-soft)]"
    >
      <div className="mx-auto max-w-[1600px] h-full px-6 lg:px-12 grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 lg:col-span-7 relative h-full flex items-center justify-center">
          <div className="bottle relative w-32 h-72 bg-gradient-to-br from-[color:var(--color-steel-soft)] to-[color:var(--color-steel)] rounded-t-full rounded-b-lg shadow-2xl">
            <div className="label-strip absolute inset-x-0 top-1/3 h-24 bg-[color:var(--color-paper)] origin-left scale-x-0">
              <div className="h-full flex items-center justify-center text-[color:var(--color-ink)] font-mono text-[10px] uppercase tracking-widest">
                Auraplex
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-8">
            — In motion / Solo-Wrap Labeller
          </div>
          {SPEC_LINES.map((line, i) => (
            <div
              key={i}
              className="spec-line font-mono text-sm md:text-base text-[color:var(--color-paper)] flex items-center gap-3"
            >
              <span className="text-[color:var(--color-signal)]">→</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
