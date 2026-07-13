type Props = {
  /** Words shown in the infinite running ticker. */
  tickerWords: string[];
};

/**
 * FeaturedHighlights — a slim, infinitely-scrolling keyword ticker band
 * ("LABELLING · PACKAGING · AUTOMATION · …"). The words run continuously like
 * a billboard; the list is duplicated so the CSS -50% loop is seamless, and
 * the global reduced-motion rule freezes it. (The former featured machine-card
 * row was removed — the catalogue grid below covers the machines.)
 */
export function FeaturedHighlights({ tickerWords }: Props) {
  if (!tickerWords.length) return null;
  // Duplicate the word list so the -50% translate loops seamlessly.
  const words = [...tickerWords, ...tickerWords];

  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="ax-ticker-track py-3">
          {words.map((w, i) => (
            <span
              key={i}
              className="font-mono text-sm uppercase tracking-[0.18em] text-[color:var(--color-signal)] px-7"
            >
              {w}
              <span className="text-[color:var(--color-steel)] ml-7">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
