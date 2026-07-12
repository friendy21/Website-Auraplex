import { Link } from '@/lib/navigation';
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

      {/* Featured billboard — machine tiles auto-scroll continuously (pause on
          hover); the list is duplicated so the loop is seamless. */}
      <div className="pt-14 pb-16">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-8">
            — {featuredLabel}
          </div>
        </div>

        <div className="ax-billboard-mask overflow-hidden">
          <div className="ax-billboard-track flex w-max gap-6 px-6 lg:px-12">
            {[0, 1].map((dup) =>
              machines.map((m, i) => {
                const tags = machineTags(m);
                return (
                  <Link
                    key={`${dup}-${m.id}`}
                    href={`/products/${m.slug}`}
                    data-cursor="caliper"
                    aria-hidden={dup === 1 ? true : undefined}
                    tabIndex={dup === 1 ? -1 : undefined}
                    className="group/card relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-colors duration-300 hover:border-[color:var(--color-signal)]"
                  >
                    <div
                      className="relative aspect-[4/3]"
                      style={{
                        background:
                          'radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--color-signal) 12%, transparent), transparent 60%)',
                      }}
                    >
                      {m.image && (
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          sizes="280px"
                          className="object-contain p-6 transition-transform duration-500 ease-out group-hover/card:scale-[1.06]"
                        />
                      )}
                      <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-steel)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col border-t border-[color:var(--color-neutral-700)] p-5">
                      <h3 className="font-display text-xl tracking-[-0.01em] leading-tight line-clamp-2">
                        {m.name}
                      </h3>
                      {tags.length > 0 && (
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] line-clamp-1">
                          {tags.join(' · ')}
                        </p>
                      )}
                      <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover/card:text-[color:var(--color-signal)] group-hover/card:translate-x-1 transition-all duration-300">
                        {viewLabel} →
                      </span>
                    </div>

                    {/* Accent bar */}
                    <span
                      className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/card:w-full transition-[width] duration-500 ease-out"
                      style={{ background: ACCENTS[i % ACCENTS.length] }}
                    />
                  </Link>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
