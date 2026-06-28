import Link from 'next/link';

type AppItem = { title: string; body: string; category: string };
type Props = {
  title: string;
  subtitle: string;
  items: AppItem[];
  cta: string;
};

/**
 * ApplicationBrowse — an "application-first" entry into the catalogue, per the
 * audit's finding that the products index only offered family-based browse.
 * Buyers usually start from the job ("label bottles", "seal pouches",
 * "prototype parts"), so each card frames the task and links into the
 * pre-filtered catalogue for that family.
 */
export function ApplicationBrowse({ title, subtitle, items, cta }: Props) {
  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] py-20 lg:py-24">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 flex items-center gap-3">
          <span className="h-px w-12 bg-[color:var(--color-signal)]" />
          {title}
        </div>
        <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] tracking-[-0.02em] leading-[1.05] max-w-2xl">
          {subtitle}
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
          {items.map((it, i) => (
            <Link
              key={it.category}
              href={`/products?category=${it.category}`}
              data-cursor="caliper"
              className="group bg-[color:var(--color-ink)] p-8 lg:p-10 flex flex-col transition-colors hover:bg-[color:var(--color-neutral-800)]/50"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-400)] mb-5">
                0{i + 1}
              </div>
              <h3 className="font-display text-2xl tracking-[-0.01em] mb-3">{it.title}</h3>
              <p className="text-sm text-[color:var(--color-steel-soft)] leading-relaxed flex-1">
                {it.body}
              </p>
              <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] group-hover:translate-x-1 transition-all duration-300">
                {cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
