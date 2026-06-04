'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';
import { AnimatedNumber } from '@/components/motion/animated-number';

/**
 * Asymmetric value-prop trio — broken from the safe 3-column sameness.
 *
 *   01  Full-width banner — large display title, subtle grid background
 *   02  Right-aligned editorial card — split-flap RM 1,800 + payback months
 *       counting down from 60 → 14
 *   03  Diagonal layout — text top-left, SVG line drawing of a machine
 *       silhouette bottom-right, with the line drawing itself in on scroll
 *
 * Content still flows from i18n (home.valueProps.items) so copy is editable.
 */
export function ValuePropGrid() {
  const t = useTranslations('home.valueProps');
  const items = t.raw('items') as { num: string; title: string; body: string }[];
  const [one, two, three] = items;

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48 space-y-24 lg:space-y-32">
      <Reveal variant="up">
        <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
          {t('title')}
        </h2>
      </Reveal>

      {/* ────────── 01 — FULL-WIDTH BANNER ────────── */}
      {one && (
        <Reveal variant="up">
          <article
            className="relative overflow-hidden bg-[color:var(--color-neutral-800)] border border-[color:var(--color-neutral-700)] p-10 md:p-16 lg:p-24"
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in oklab, var(--color-signal) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-signal) 7%, transparent) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-8">
              — {one.num}
            </div>
            <h3 className="font-display text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.03em] leading-[0.92] max-w-5xl">
              {one.title}
            </h3>
            <p className="mt-10 max-w-xl prose-editorial text-[color:var(--color-steel-soft)] text-lg">
              {one.body}
            </p>
          </article>
        </Reveal>
      )}

      {/* ────────── 02 — RIGHT-ALIGNED w/ CAPABILITY STACK ────────── */}
      {two && (
        <div className="grid grid-cols-12 gap-6 items-center">
          <Reveal variant="up" className="col-span-12 md:col-span-5 order-2 md:order-1">
            <div className="border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/40 p-8 md:p-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-4">
                Under one roof
              </div>
              <ul className="space-y-3 font-display text-2xl md:text-3xl tracking-[-0.01em] leading-tight">
                <li className="flex items-baseline gap-3">
                  <span className="text-[color:var(--color-signal)] text-base">◆</span>
                  Self-adhesive labelling
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-[color:var(--color-signal)] text-base">◆</span>
                  Packaging machinery
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-[color:var(--color-signal)] text-base">◆</span>
                  3D printing & scanning
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-[color:var(--color-signal)] text-base">◆</span>
                  MES &amp; SCADA solutions
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-[color:var(--color-signal)] text-base">◆</span>
                  Custom automation
                </li>
              </ul>

              <div className="mt-10 pt-8 border-t border-[color:var(--color-neutral-700)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
                  Typical lead time
                </div>
                <div className="font-display text-5xl text-[color:var(--color-paper)]">
                  <AnimatedNumber value={4} suffix=" weeks" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            variant="up"
            delay={120}
            className="col-span-12 md:col-span-6 md:col-start-7 order-1 md:order-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 md:text-right">
              — {two.num}
            </div>
            <h3 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] md:text-right">
              {two.title}
            </h3>
            <p className="mt-8 max-w-md md:ml-auto prose-editorial text-[color:var(--color-steel-soft)] md:text-right">
              {two.body}
            </p>
          </Reveal>
        </div>
      )}

      {/* ────────── 03 — DIAGONAL w/ SVG MACHINE SILHOUETTE ────────── */}
      {three && (
        <div className="relative grid grid-cols-12 gap-6 min-h-[420px]">
          <Reveal variant="up" className="col-span-12 md:col-span-6 z-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — {three.num}
            </div>
            <h3 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
              {three.title}
            </h3>
            <p className="mt-8 max-w-md prose-editorial text-[color:var(--color-steel-soft)]">
              {three.body}
            </p>
          </Reveal>

          {/* SVG silhouette — strokes draw in via CSS animation triggered by
              CSS scroll-driven view() timeline. Pure CSS, no JS. */}
          <Reveal
            variant="fade"
            delay={200}
            className="col-span-12 md:col-span-6 md:col-start-7 relative"
          >
            <MachineSilhouette />
          </Reveal>
        </div>
      )}
    </section>
  );
}

/**
 * Stylized line drawing of a labelling machine — pure SVG with stroke-dasharray
 * draw-in animation. Triggered on scroll-into-view via CSS view() timeline so
 * no JS observers are needed.
 */
function MachineSilhouette() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="w-full h-full max-h-[420px] silhouette text-[color:var(--color-signal)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Base / frame */}
      <rect x="60" y="240" width="280" height="40" />
      {/* Conveyor */}
      <line x1="20" y1="260" x2="380" y2="260" />
      {/* Vertical mast */}
      <line x1="200" y1="80" x2="200" y2="240" />
      {/* Applicator arm */}
      <path d="M200 120 L300 120 L300 180 L240 180" />
      {/* Reel */}
      <circle cx="160" cy="100" r="28" />
      <circle cx="160" cy="100" r="14" />
      {/* HMI screen */}
      <rect x="280" y="60" width="60" height="40" />
      {/* Signal beacon */}
      <line x1="200" y1="80" x2="200" y2="50" />
      <circle cx="200" cy="40" r="5" fill="currentColor" />
      {/* Container on conveyor */}
      <rect x="180" y="210" width="40" height="50" rx="4" />
      {/* Label about to apply */}
      <rect x="220" y="220" width="20" height="14" strokeDasharray="2 2" />
    </svg>
  );
}
