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
 * Per-family card theming — adapted from Kan3an/YPpyVWd ("Neon glass · 3D
 * cards"): a vivid gradient frame wrapping a frosted-glass body. Recoloured
 * from the pen's neon to the Auraplex families, one accent each:
 *   labelling  → cerulean/blue (the brand signal)
 *   packaging  → amber/orange
 *   automation → violet
 * `frame` is the gradient border, `text` the deep-tinted ink used on the
 * light glass so copy stays legible.
 */
const THEME: Record<string, { frame: string; text: string; soft: string }> = {
  labelling: {
    frame: 'linear-gradient(145deg, #22d3ee, #2563eb)',
    text: '#0c4a6e',
    soft: 'rgba(12, 74, 110, 0.82)',
  },
  packaging: {
    frame: 'linear-gradient(145deg, #fbbf24, #f97316)',
    text: '#7c2d12',
    soft: 'rgba(124, 45, 18, 0.82)',
  },
  automation: {
    frame: 'linear-gradient(145deg, #c084fc, #7c3aed)',
    text: '#3b0764',
    soft: 'rgba(59, 7, 100, 0.82)',
  },
};
const themeOf = (k: string) => THEME[k] ?? THEME.labelling;

/**
 * WhatWeMake — the three engineering families (labelling / packaging /
 * automation) as gradient-framed glass cards that link into the filtered
 * catalogue. Server component, zero JS; the lift + frame glow are pure CSS
 * hover. Dark-industrial page, bright glass cards as the focal trio.
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

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {families.map((f, i) => {
            const th = themeOf(f.key);
            return (
              <Link
                key={f.key}
                href={`/products?category=${f.key}`}
                data-cursor="caliper"
                className="group relative block rounded-[22px] p-[3px] transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: th.frame,
                  boxShadow:
                    '0 22px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset',
                }}
              >
                {/* Frosted glass body */}
                <div
                  className="relative flex h-full flex-col rounded-[19px] p-7 backdrop-blur-md"
                  style={{
                    background:
                      'linear-gradient(168deg, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.12) 100%)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderBottomColor: 'rgba(255,255,255,0.22)',
                  }}
                >
                  {/* Tag */}
                  <div
                    className="flex items-center justify-between font-mono text-[10px] font-extrabold uppercase tracking-[0.22em]"
                    style={{ color: th.text }}
                  >
                    <span>0{i + 1} · Family</span>
                    <span className="opacity-70">{f.count} machines</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-3xl tracking-[-0.02em] mt-3"
                    style={{ color: th.text }}
                  >
                    {f.label}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-sm font-medium leading-relaxed" style={{ color: th.soft }}>
                    {f.summary}
                  </p>

                  {/* Machine image — inset glass tray */}
                  <div
                    className="relative mt-6 aspect-[5/3] overflow-hidden rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(160deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))',
                      border: '1px solid rgba(255,255,255,0.45)',
                    }}
                  >
                    {f.image ? (
                      <Image
                        src={f.image}
                        alt={f.label}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="font-display text-6xl" style={{ color: th.soft }}>
                          ◍
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="mt-6 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: th.text }}
                  >
                    <span>{viewLabel.replace('{n}', String(f.count))}</span>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                      style={{ background: th.frame, color: '#fff' }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
