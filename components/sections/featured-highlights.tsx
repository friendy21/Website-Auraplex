import Link from 'next/link';
import Image from 'next/image';
import { machineTags, type Machine } from '@/lib/catalog';

type Props = {
  machines: Machine[];
  tickerWords: string[];
  /** localized "Featured" label + view label */
  featuredLabel: string;
  viewLabel: string;
};

// Per-card accent for the hover underline (Auraplex palette + a couple of
// tasteful tints — faithful to the Margarita pen's coloured ing-card edges).
const ACCENTS = [
  'var(--color-signal)',
  'var(--color-signal-bright)',
  '#7f9cec',
  '#5ad1c4',
  '#f2a65a',
  '#e06b8b',
];

/**
 * FeaturedHighlights — a scrolling keyword ticker + a row of "ingredient
 * cards" whose machine photo pops out of the top and whose accent underline
 * draws across on hover. Faithful adaptation of Margarita-the-solid/qEadERd
 * (ticker marquee + ing-card), rebranded to Auraplex. Pure CSS, zero JS
 * (marquee + hover are CSS; the global reduced-motion rule freezes the
 * ticker).
 */
export function FeaturedHighlights({
  machines,
  tickerWords,
  featuredLabel,
  viewLabel,
}: Props) {
  if (!machines.length) return null;
  // Duplicate the word list so the -50% translate loops seamlessly.
  const words = [...tickerWords, ...tickerWords];

  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
      {/* Ticker marquee */}
      <div className="overflow-hidden border-b border-[color:var(--color-neutral-700)] whitespace-nowrap">
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

      {/* Ingredient-card row */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-24 pb-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
          — {featuredLabel}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-24">
          {machines.map((m, i) => {
            const tags = machineTags(m);
            return (
              <Link
                key={m.id}
                href={`/products/${m.slug}`}
                data-cursor="caliper"
                className="ax-ing group relative block bg-[color:var(--color-neutral-800)] px-7 pt-20 pb-8 transition-colors duration-300 hover:bg-[color:var(--color-neutral-700)]/60"
              >
                {/* Photo popping out of the top */}
                <div className="pointer-events-none absolute -top-14 left-6 h-28 w-28">
                  {m.image && (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="112px"
                      className="object-contain [filter:drop-shadow(0_-4px_18px_rgba(0,0,0,0.55))] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.18] group-hover:-rotate-6"
                    />
                  )}
                </div>

                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)] mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-3xl tracking-[-0.01em] leading-none mb-3">
                  {m.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] mb-6">
                  {tags.join(' · ')}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] transition-colors">
                  {viewLabel} →
                </span>

                {/* Accent underline drawing across on hover */}
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-[width] duration-500 ease-out"
                  style={{ background: ACCENTS[i % ACCENTS.length] }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
