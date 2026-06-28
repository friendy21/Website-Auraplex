import Link from 'next/link';

type Props = { className?: string };

/**
 * ProofRail — the audit's keystone "proof mode" compound: a compact, reusable
 * strip of real trust signals that can sit on product pages, services, and the
 * homepage so buyers don't have to dig through editorial pages for proof.
 *
 * Every claim here is real and verifiable on the site: Auraplex designs/builds/
 * services from Seri Kembangan, Selangor; was recognised at MIMF 2024; offers
 * local install, parts and service. No invented metrics.
 */
const ITEMS: { k: string; v: string; href?: string }[] = [
  { k: 'Engineered in', v: 'Seri Kembangan, Selangor' },
  { k: 'Recognition', v: 'MIMF 2024', href: '/case-studies' },
  { k: 'Support', v: 'Local install, parts & service' },
  { k: 'Built', v: 'Designed, made & tested in-house' },
];

export function ProofRail({ className = '' }: Props) {
  return (
    <section
      className={`border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/40 ${className}`}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <ul className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[color:var(--color-neutral-700)]">
          {ITEMS.map((it, i) => {
            const inner = (
              <>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-steel)] mb-2">
                  {it.k}
                </div>
                <div className="font-display text-base md:text-lg tracking-tight text-[color:var(--color-paper)] leading-snug">
                  {it.v}
                </div>
              </>
            );
            return (
              <li
                key={i}
                className={`px-5 py-7 lg:px-8 ${i % 2 === 0 ? 'border-l-0 lg:border-l' : ''}`}
              >
                {it.href ? (
                  <Link
                    href={it.href}
                    className="block group hover:text-[color:var(--color-signal)] transition-colors"
                  >
                    {inner}
                    <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-signal)] opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
