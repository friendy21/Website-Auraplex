'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

type Step = { num: string; name: string; summary: string };

/**
 * ProcessTimeline — the "how we build" steps as a connected vertical
 * timeline: a cerulean rail fills top-to-bottom as you scroll through the
 * section, and each step's node lights up + content reveals as it enters
 * view. Replaces the previous flat list of rows.
 *
 * a11y: semantic <ol>/<li>. Reduced-motion: the rail is shown full and
 * nodes/content appear without offset. transform/opacity only.
 */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  });
  const fillScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative">
      {/* Rail track */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[color:var(--color-neutral-700)]" />
      {/* Rail fill — scroll-linked */}
      <motion.div
        style={{ scaleY: reduced ? 1 : fillScaleY, originY: 0 }}
        className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[color:var(--color-signal)] to-[color:var(--color-signal-bright)]"
      />

      {steps.map((step) => (
        <StepRow key={step.num} step={step} reduced={reduced} />
      ))}
    </ol>
  );
}

function StepRow({ step, reduced }: { step: Step; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -45% 0px' });

  return (
    <li
      ref={ref}
      className="grid grid-cols-[16px_1fr] gap-x-5 md:gap-x-8 pb-12 last:pb-0"
    >
      {/* Node */}
      <div className="relative">
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            backgroundColor: inView
              ? 'var(--color-signal)'
              : 'var(--color-ink)',
            scale: inView ? 1 : 0.7,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-1 block h-4 w-4 rounded-full border-2 border-[color:var(--color-signal)]"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 16 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="group grid grid-cols-12 gap-x-6 gap-y-2 -mt-1"
      >
        <div className="col-span-12 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] pt-2">
          {step.num}
        </div>
        <div className="col-span-12 md:col-span-3">
          <h3 className="font-display text-2xl md:text-3xl tracking-[-0.01em]">
            {step.name}
          </h3>
        </div>
        <div className="col-span-12 md:col-span-8">
          <p className="prose-editorial text-[color:var(--color-steel-soft)]">
            {step.summary}
          </p>
        </div>
      </motion.div>
    </li>
  );
}
