import Image from 'next/image';
import { Link } from '@/lib/navigation';

export type Family = {
  key: string;
  label: string;
  count: number;
  summary: string;
  image: string | null;
};

type Props = {
  families: Family[];
  viewLabel: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
};

/**
 * Per-family accent — one restrained tint each, matching the accordion's
 * family palette so the trio reads as the page's colour moment WITHOUT
 * importing the six foreign neon hues (and sub-AA dark-blue-on-glass text)
 * of the previous CodePen treatment. Cards now sit on the site's dark panel
 * language; the accent is rationed to a top rail, the index chip and the
 * arrow — everything else is the system's paper/steel text (AA on ink).
 */
// a11y: used as TEXT on an accent-tinted panel, so each must clear 4.5:1 there.
// Originals measured 3.95 (cerulean) / 3.24 (violet) and failed WCAG AA.
const ACCENT: Record<string, string> = {
  labelling: '#5AB5E4',
  packaging: '#E0A23F',
  automation: '#A89EF4',
};
const accentOf = (k: string) => ACCENT[k] ?? ACCENT.labelling;

/**
 * WhatWeMake — the three engineering families (labelling / packaging /
 * automation) as in-system dark cards that link into the filtered catalogue.
 * Server component, zero JS; the lift + accent glow are pure CSS hover.
 */
export function WhatWeMake({ families, viewLabel, eyebrow, headingLine1, headingLine2 }: Props) {
  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5 flex items-center gap-3">
          <span className="h-px w-12 bg-[color:var(--color-signal)]" />
          {eyebrow}
        </div>
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
          {headingLine1}
          <br />
          <span className="text-[color:var(--color-neutral-400)]">{headingLine2}</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {families.map((f, i) => {
            const accent = accentOf(f.key);
            return (
              <Link
                key={f.key}
                href={`/products?category=${f.key}`}
                data-cursor="caliper"
                className="group relative flex flex-col overflow-hidden rounded-lg border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-transform duration-500 hover:-translate-y-1.5"
                style={{ ['--accent' as string]: accent }}
              >
                {/* Family accent top rail */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: accent }}
                />

                <div className="flex h-full flex-col p-7">
                  {/* Tag */}
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-neutral-400)]">
                    <span
                      className="font-bold px-1.5 py-0.5 rounded"
                      style={{ color: accent, background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
                    >
                      0{i + 1} · Family
                    </span>
                    <span>{f.count} machines</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-3xl tracking-[-0.02em] mt-4 text-[color:var(--color-paper)]">
                    {f.label}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-steel-soft)]">
                    {f.summary}
                  </p>

                  {/* Machine image — inset tray on a faint accent wash */}
                  <div
                    className="relative mt-6 aspect-[5/3] overflow-hidden rounded-md border border-[color:var(--color-neutral-700)]"
                    style={{
                      background:
                        'radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 62%), var(--color-ink)',
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
                        <span className="font-display text-6xl text-[color:var(--color-neutral-600)]">
                          ◍
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-6 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-steel-soft)]">
                    <span>{viewLabel.replace('{n}', String(f.count))}</span>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--color-ink)] transition-transform duration-300 group-hover:translate-x-1"
                      style={{ background: accent }}
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
