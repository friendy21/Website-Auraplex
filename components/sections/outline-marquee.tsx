/**
 * OutlineMarquee — the giant hollow wordmark band.
 *
 * A 10vw outlined "AURAPLEX" strip in continuous horizontal motion,
 * bridging the hero into the page body. Every fourth word renders
 * solid paper for rhythm. The whole band sits inside a .lean wrapper,
 * so it physically skews with scroll velocity and springs back level —
 * the page feels like it has mass.
 *
 * Server component, zero JS: the motion is one CSS keyframe
 * (scroll-x, transform-only, compositor), the lean is the global
 * --scroll-skew variable, and the text is aria-hidden brand linework
 * (a wordmark, not copy — same treatment in all locales, like a logo).
 */
const WORDS = Array.from({ length: 6 });

export function OutlineMarquee() {
  return (
    <div
      className="lean relative overflow-hidden border-y border-[color:var(--color-neutral-800)] bg-[color:var(--color-ink)] py-6 md:py-8"
      aria-hidden="true"
    >
      <div className="flex gap-16 whitespace-nowrap animate-[scroll-x_30s_linear_infinite] w-max">
        {/* Two identical halves → seamless -50% loop */}
        {[0, 1].map((half) => (
          <div key={half} className="flex gap-16 items-baseline">
            {WORDS.map((_, i) => (
              <span
                key={i}
                className={`font-display text-[clamp(4rem,10vw,9rem)] leading-none tracking-[-0.03em] ${
                  i % 3 === 2 ? 'outline-text-solid' : 'outline-text'
                }`}
              >
                AURAPLEX
                <span className="inline-block mx-8 h-[0.5em] w-[0.5em] translate-y-[0.06em] border border-[color:var(--color-signal)]/50 rotate-45" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
