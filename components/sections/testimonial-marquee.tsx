'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ⚠ Placeholder testimonials — to be replaced with verified customer
// quotes (with on-file permission) before launch. All entries below are
// un-attributed and need verification against real customer interviews.
// Keep this array sized to 4+ items so the two-row marquee still loops
// cleanly when one is removed.
const TESTIMONIALS = [
  {
    quote: 'Installation took two days. Production hit spec on day three.',
    author: 'Ops Director · KL beverage co.',
  },
  {
    quote:
      'Local support means a part on the floor by next morning, not next month.',
    author: 'Plant Manager · Penang food line',
  },
  {
    quote: 'We retired three Chinese-import labellers for one Auraplex unit.',
    author: 'CEO · Sabah edible oils',
  },
  {
    quote: 'Throughput up 40%. Labour reallocated, not laid off. That mattered.',
    author: 'COO · Selangor pharma',
  },
  {
    quote: 'Their engineer answered my Sunday-night WhatsApp at 9:14pm.',
    author: 'Plant Manager · Klang cosmetics',
  },
];

/**
 * Two-row marquee, opposite directions. Row 1 carries the quotes in display
 * type at 60s/loop; row 2 carries attributions in mono signal-cerulean at 45s
 * (different rates = depth).
 *
 * Hover behavior — on entry of any quote:
 *   - Both rows freeze (CSS animation-play-state via :has() ancestor)
 *   - The hovered quote: opacity 1, color signal, underline draws in
 *   - Siblings: opacity 0.35, slight blur
 *   - Listening attribution row tracks the active index by aria-relationship
 *
 * Pure CSS — no JS scroll, no rAF cost, gracefully degrades on Firefox where
 * :has() may not yet apply (then both rows just keep scrolling — still fine).
 */
export function TestimonialMarquee() {
  const t = useTranslations('home.testimonials');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-28 lg:py-36 overflow-hidden border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-16 mx-auto max-w-[1600px] px-6 lg:px-12 flex items-center gap-3">
        <span className="h-px w-12 bg-[color:var(--color-signal)]" />
        {t('eyebrow')}
      </div>

      {/* Edge-faded marquee container. Both rows live inside so a single hover
          can pause both via the parent's [&:has(...)] selector. */}
      <div
        className="group/marquee lean relative"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)',
        }}
      >
        {/* ── Row 1 — quotes in display type, 60s left ── */}
        <div className="flex gap-20 whitespace-nowrap animate-[scroll-x_60s_linear_infinite] group-hover/marquee:[animation-play-state:paused] mb-10">
          {doubled.map((t, i) => {
            const idx = i % TESTIMONIALS.length;
            const isActive = activeIdx === idx;
            const dim = activeIdx !== null && !isActive;
            // The second copy exists purely for the seamless CSS loop —
            // hide it from assistive tech and the tab order, otherwise
            // screen readers announce every quote twice and keyboard
            // users tab through phantom duplicates.
            const isDuplicate = i >= TESTIMONIALS.length;
            return (
              <button
                key={`q-${i}`}
                aria-hidden={isDuplicate || undefined}
                tabIndex={isDuplicate ? -1 : undefined}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onFocus={() => setActiveIdx(idx)}
                onBlur={() => setActiveIdx(null)}
                className={`relative inline-flex max-w-2xl shrink-0 items-baseline gap-3 whitespace-normal text-left transition-all duration-500 ${
                  isActive
                    ? 'text-[color:var(--color-paper)] scale-[1.02]'
                    : dim
                      ? 'text-[color:var(--color-neutral-400)] opacity-50 blur-[1px]'
                      : 'text-[color:var(--color-paper)]'
                }`}
              >
                <span
                  className={`font-display text-6xl leading-none translate-y-2 transition-colors duration-500 ${
                    isActive
                      ? 'text-[color:var(--color-signal)]'
                      : 'text-[color:var(--color-neutral-600)]'
                  }`}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <span className="font-display text-2xl md:text-3xl leading-snug max-w-xl relative">
                  {t.quote}
                  {/* Underline draws in under the active quote */}
                  <span
                    className={`absolute -bottom-2 left-0 right-0 h-px bg-[color:var(--color-signal)] origin-left transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Row 2 — attributions, mono signal, 45s right (reversed) ── */}
        <div className="flex gap-16 whitespace-nowrap animate-[scroll-x-reverse_45s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
          {doubled.map((t, i) => {
            const idx = i % TESTIMONIALS.length;
            const isActive = activeIdx === idx;
            const dim = activeIdx !== null && !isActive;
            const isDuplicate = i >= TESTIMONIALS.length;
            return (
              <span
                key={`a-${i}`}
                aria-hidden={isDuplicate || undefined}
                className={`inline-flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] transition-all duration-500 ${
                  isActive
                    ? 'text-[color:var(--color-signal-bright)] scale-[1.02]'
                    : dim
                      ? 'opacity-40 blur-[1px] text-[color:var(--color-neutral-400)]'
                      : 'text-[color:var(--color-signal)]'
                }`}
              >
                <span className="text-[color:var(--color-neutral-600)]">—</span>
                {t.author}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
