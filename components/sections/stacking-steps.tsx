'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

type Step = { num: string; name: string; summary: string };

/**
 * StackingSteps — the "how we build" steps as sticky stacking cards
 * (faithful to karabharat/YPWXqmx "CSS-Only Stacking Cards", rebranded to
 * Auraplex). Each card pins near the top and, as the next card scrolls up to
 * cover it, scales down + tilts back + dims — building a fanned stack.
 *
 * The reference pen uses `animation-timeline: scroll()/view()`, which this
 * codebase deliberately dropped for cross-browser reliability (see
 * motion/reveal.tsx). We reproduce the identical effect with Motion's
 * `useScroll`/`useTransform` (works in every browser). transform/opacity only;
 * reduced-motion keeps the cards flat (no scale/tilt/dim).
 */
export function StackingSteps({ steps }: { steps: Step[] }) {
  const container = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ol ref={container} className="relative list-none p-0 m-0">
      {steps.map((step, i) => (
        <StepCard
          key={step.num}
          step={step}
          index={i}
          total={steps.length}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </ol>
  );
}

function StepCard({
  step,
  index,
  total,
  progress,
  reduced,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // This card starts transforming once the scroll passes its slot.
  const start = index / total;
  const targetScale = reduced ? 1 : 1 - (total - index) * 0.035;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const rotateX = useTransform(progress, [start, 1], [0, reduced ? 0 : -9]);
  const dim = useTransform(progress, [start, 1], [0, reduced ? 0 : 0.55]);

  return (
    <li
      className="sticky"
      style={{ top: `calc(16vh + ${index * 1.4}rem)` }}
    >
      <motion.div
        style={{
          scale,
          rotateX,
          transformPerspective: 1200,
          transformOrigin: '50% 0%',
        }}
        className="relative mb-8 h-[56vh] min-h-[360px] overflow-hidden rounded-3xl border border-[color:var(--color-neutral-700)] bg-gradient-to-br from-[color:var(--color-neutral-800)] to-[color:var(--color-ink)] p-10 md:p-16 flex flex-col justify-center shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
      >
        {/* Signal top edge */}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[color:var(--color-signal)] via-[color:var(--color-signal-bright)] to-transparent" />

        {/* Ghost number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-4 md:right-10 font-display text-[clamp(7rem,18vw,16rem)] leading-none text-[color:var(--color-signal)]/10"
        >
          {step.num}
        </span>

        <div className="relative max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5">
            Step {step.num}
          </div>
          <h3 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1] mb-6">
            {step.name}
          </h3>
          <p className="prose-editorial text-[color:var(--color-steel-soft)] text-lg md:text-xl max-w-2xl">
            {step.summary}
          </p>
        </div>

        {/* Dim overlay as the card gets covered */}
        <motion.span
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 bg-[color:var(--color-ink)]"
        />
      </motion.div>
    </li>
  );
}
