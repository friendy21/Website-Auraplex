'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/hooks';

type Step = { num: string; name: string; summary: string };

/**
 * StackingSteps — the "how we build" journey as sticky stacking cards: each
 * card pins near the top and, as the next scrolls up over it, recedes (scales
 * down + dims) to build a fanned deck.
 *
 * Correctness notes (this replaced a version that overlapped illegibly on
 * short/laptop viewports):
 *  - Cards are OPAQUE (solid --color-neutral-800, no gradient-to-transparent),
 *    so a covering card fully hides the one behind except its peeking header.
 *  - Content is TOP-aligned and the sticky `top` step (~2.6rem) is large enough
 *    that each stacked card peeks its "STEP 0N · name" header — the readable
 *    stacked-deck look, never two titles colliding mid-card.
 *  - Depth uses scale + a dim overlay ONLY. The previous 3D `rotateX` tilt
 *    reordered sibling paint in the 3D context and let the covered card's title
 *    bleed through the covering card — removed.
 *  - transform/opacity only; reduced-motion keeps the cards flat + opaque
 *    (coverage alone still reads as a clean stack).
 */
export function StackingSteps({ steps }: { steps: Step[] }) {
  const container = useRef<HTMLOListElement>(null);
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
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const t = useTranslations('common');
  const reduced = useReducedMotion();

  // Card starts receding once the scroll passes its slot.
  const start = index / total;
  const targetScale = reduced ? 1 : 1 - (total - index) * 0.04;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, 1], [0, reduced ? 0 : 0.5]);

  return (
    <li
      className="sticky"
      // Each card sticks ~2.6rem lower than the previous, so stacked cards peek
      // their header row. 10vh base leaves the fixed header clear.
      style={{ top: `calc(10vh + ${index * 2.6}rem)` }}
    >
      <motion.div
        style={{ scale, transformOrigin: '50% 0%' }}
        className="relative mb-6 flex min-h-[300px] flex-col justify-start overflow-hidden rounded-3xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-8 md:h-[52vh] md:p-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
      >
        {/* Signal top edge */}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[color:var(--color-signal)] via-[color:var(--color-signal-bright)] to-transparent" />

        {/* Ghost number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-4 md:right-10 font-display text-[clamp(6rem,16vw,14rem)] leading-none text-[color:var(--color-signal)]/10"
        >
          {step.num}
        </span>

        <div className="relative max-w-3xl">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
            {t('step')} {step.num}
          </div>
          <h3 className="mb-5 font-display text-[clamp(1.9rem,4.5vw,3.5rem)] tracking-[-0.02em] leading-[1.02]">
            {step.name}
          </h3>
          <p className="prose-editorial max-w-2xl text-base leading-relaxed text-[color:var(--color-steel-soft)] md:text-lg">
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
