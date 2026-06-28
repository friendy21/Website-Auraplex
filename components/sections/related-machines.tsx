import Link from 'next/link';
import Image from 'next/image';

type RelatedItem = { slug: string; name: string; image: string | null };
type Props = {
  family: string;
  familyKey: string;
  items: RelatedItem[];
};

/**
 * RelatedMachines — a "more in this family" rail on the product-detail page.
 * The audit flagged a weak compare flow and no easy way to move laterally
 * between siblings; this gives buyers a direct path across the family without
 * bouncing back to the catalogue, and a "compare all" link into the filtered
 * index. Photographed machines surface first.
 */
export function RelatedMachines({ family, familyKey, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-t border-[color:var(--color-neutral-700)]">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
            — More in {family}
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-[-0.02em]">
            Compare across the family.
          </h2>
        </div>
        <Link
          href={`/products?category=${familyKey}`}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] hover:text-[color:var(--color-signal)] transition"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((m) => (
          <Link
            key={m.slug}
            href={`/products/${m.slug}`}
            data-cursor="caliper"
            className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-colors hover:border-[color:var(--color-signal)]"
          >
            <div
              className="relative aspect-square"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--color-signal) 10%, transparent), transparent 60%)',
              }}
            >
              {m.image ? (
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-400)]">
                  Photography pending
                </div>
              )}
            </div>
            <div className="border-t border-[color:var(--color-neutral-700)] p-4">
              <h3 className="font-display text-sm leading-tight line-clamp-2">{m.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
