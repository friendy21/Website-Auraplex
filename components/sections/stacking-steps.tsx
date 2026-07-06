type Step = { num: string; name: string; summary: string };

/**
 * ProcessSteps — the "how we build" journey as a clean numbered vertical rail.
 *
 * Replaces an earlier sticky-stacking-cards treatment: on short/laptop
 * viewports its 56vh cards stacked only ~22px apart with vertically-centered
 * content, so adjacent step titles overlapped illegibly, and its per-card
 * scroll-linked transforms were an INP/perf cost. This version is a plain
 * server component — no scroll JS, no overlap, works at every viewport height
 * and reads cleanly top-to-bottom.
 */
export function StackingSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative m-0 list-none border-l border-[color:var(--color-neutral-700)] p-0 pl-6 md:pl-10">
      {steps.map((step) => (
        <li key={step.num} className="relative pb-12 last:pb-0">
          {/* Node on the rail */}
          <span
            aria-hidden="true"
            className="absolute -left-[calc(1.5rem+7px)] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[color:var(--color-signal)] bg-[color:var(--color-ink)] md:-left-[calc(2.5rem+7px)]"
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_1fr] md:gap-10">
            {/* Ghost step number */}
            <div
              aria-hidden="true"
              className="font-display text-5xl leading-none text-[color:var(--color-signal)]/25 md:text-7xl"
            >
              {step.num}
            </div>
            <div className="max-w-2xl">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
                Step {step.num}
              </div>
              <h3 className="mb-4 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                {step.name}
              </h3>
              <p className="prose-editorial text-base leading-relaxed text-[color:var(--color-steel-soft)] md:text-lg">
                {step.summary}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
