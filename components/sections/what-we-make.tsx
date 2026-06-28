import Image from 'next/image';
import Link from 'next/link';

export type Family = {
  key: string;
  label: string;
  count: number;
  summary: string;
  image: string | null;
};

type Props = { families: Family[]; viewLabel: string };

/**
 * WhatWeMake — the "what we make" anchor of the redesigned homepage: the three
 * engineering families (labelling / packaging / automation) as clean cards
 * that link straight into the filtered catalogue. Server component, zero JS;
 * dark-industrial, CSS hover only.
 */
export function WhatWeMake({ families, viewLabel }: Props) {
  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5 flex items-center gap-3">
          <span className="h-px w-12 bg-[color:var(--color-signal)]" />
          What we make
        </div>
        <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
          Three families,
          <br />
          <span className="text-[color:var(--color-neutral-400)]">one engineering floor.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {families.map((f) => (
            <Link
              key={f.key}
              href={`/products?category=${f.key}`}
              data-cursor="caliper"
              className="group relative flex flex-col overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-all duration-500 hover:border-[color:var(--color-signal)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--color-signal)_30%,transparent)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
                {f.image ? (
                  <Image
                    src={f.image}
                    alt={f.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(120% 90% at 70% 10%, color-mix(in oklab, var(--color-signal) 20%, transparent), transparent 60%)',
                    }}
                  >
                    <span className="font-display text-[clamp(3rem,7vw,6rem)] text-[color:var(--color-signal)]/40">
                      ◍
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 text-[color:var(--color-signal)]">
                  {f.count}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-2xl tracking-[-0.01em]">{f.label}</h3>
                <p className="mt-3 text-sm text-[color:var(--color-steel-soft)] leading-relaxed flex-1">
                  {f.summary}
                </p>
                <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] group-hover:translate-x-1 transition-all duration-300">
                  {viewLabel.replace('{n}', String(f.count))} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
