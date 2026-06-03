import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';
import { SortTabs } from '@/components/sections/sort-tabs';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import {
  MACHINES,
  categoryLabel,
  categoryCounts,
  machineTags,
  type Category,
  type Machine,
} from '@/lib/catalog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Machines — Auraplex',
    description:
      'Browse the full Auraplex catalogue of labelling, packaging and custom automation machines — built in Selangor.',
    path: `/${locale}/products`,
  });
}

type SortKey = 'featured' | 'photographed' | 'az';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'photographed', label: 'Photographed' },
  { key: 'az', label: 'A — Z' },
];

function sortMachines(machines: Machine[], sort: SortKey): Machine[] {
  const arr = [...machines];
  if (sort === 'az') {
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === 'photographed') {
    return arr.sort((a, b) => {
      if (!!a.image !== !!b.image) return a.image ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
  // Featured default — featured first, then photographed, then name
  return arr.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (!!a.image !== !!b.image) return a.image ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: Category; sort?: SortKey }>;
}) {
  const { locale } = await params;
  const { category, sort = 'featured' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('products');

  const counts = categoryCounts();
  const filtered = category
    ? MACHINES.filter((m) => m.category === category)
    : MACHINES;
  const machines = sortMachines(filtered, sort);
  const photographedCount = machines.filter((m) => m.image !== null).length;

  const categories: { key?: Category; label: string; count: number }[] = [
    { key: undefined, label: 'All', count: counts.all },
    { key: 'labelling', label: 'Labelling', count: counts.labelling },
    { key: 'packaging', label: 'Packaging', count: counts.packaging },
    { key: 'automation', label: 'Automation', count: counts.automation },
  ];

  const buildHref = (cat?: Category, srt: SortKey = sort) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (srt !== 'featured') params.set('sort', srt);
    const q = params.toString();
    return q ? `/products?${q}` : '/products';
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: `https://auraplex.my/${locale}` },
              {
                name: 'Products',
                url: `https://auraplex.my/${locale}/products`,
              },
            ]),
          ),
        }}
      />

      {/* ────── COMPACT HEADER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-32 pb-12">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — Catalogue / 2026 · {counts.all} machines
          </div>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.95]">
              {t('title')}
            </h1>
            <p className="max-w-md text-[color:var(--color-steel-soft)] text-base lg:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ────── CONTROLS BAR ────── */}
      <section className="sticky top-[72px] z-30 bg-[color:var(--color-ink)]/85 backdrop-blur-xl border-y border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-4 flex items-center justify-between gap-6 flex-wrap">
          {/* Category filter chips with counts */}
          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.15em]">
            {categories.map((c) => {
              const active = category === c.key || (!category && !c.key);
              return (
                <Link
                  key={c.label}
                  href={buildHref(c.key)}
                  className={
                    active
                      ? 'px-3 py-1.5 border border-[color:var(--color-signal)] text-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10 flex items-center gap-2'
                      : 'px-3 py-1.5 border border-[color:var(--color-neutral-700)] hover:border-[color:var(--color-neutral-400)] text-[color:var(--color-steel-soft)] hover:text-[color:var(--color-paper)] transition flex items-center gap-2'
                  }
                >
                  <span>{c.label}</span>
                  <span
                    className={
                      active
                        ? 'text-[color:var(--color-signal-bright)] text-[10px]'
                        : 'text-[color:var(--color-neutral-500)] text-[10px]'
                    }
                  >
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Sort — sliding pill indicator. Hrefs are precomputed here in the
              server component so we never hand a function to the client. */}
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em]">
            <span className="text-[color:var(--color-neutral-500)]">Sort</span>
            <SortTabs
              items={SORTS.map((s) => ({
                key: s.key,
                label: s.label,
                href: buildHref(category, s.key),
              }))}
              activeKey={sort}
            />
          </div>
        </div>
      </section>

      {/* ────── RESULT COUNTER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-8 pb-4 flex items-end justify-between flex-wrap gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          Showing {machines.length}
          {category && ` of ${counts.all}`}
          {category && (
            <>
              {' '}
              · <span className="text-[color:var(--color-signal)]">{categoryLabel(category)}</span>
            </>
          )}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
          {photographedCount} photographed ·{' '}
          {machines.length - photographedCount} pending
        </div>
      </section>

      {/* ────── DENSE GRID ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {machines.map((p, i) => {
            const tags = machineTags(p);
            return (
              <Reveal
                key={p.id}
                variant="up"
                delay={Math.min(i * 40, 320)}
                className="group"
              >
                <TiltCard intensity={4}>
                <Link
                  href={`/products/${p.slug}`}
                  data-cursor="caliper"
                  className="block relative overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-all duration-500 hover:border-[color:var(--color-signal)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_color-mix(in_oklab,var(--color-signal)_30%,transparent)]"
                >
                  {/* Image area — tighter padding so the product fills the frame */}
                  <div className="relative aspect-[4/3] bg-[color:var(--color-neutral-800)] overflow-hidden">
                    {/* Inky veil — slides UP off the image on hover, revealing the product */}
                    <div className="absolute inset-0 z-[5] bg-gradient-to-t from-[color:var(--color-ink)]/70 via-[color:var(--color-ink)]/15 to-transparent pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full" />

                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-4 transition-all duration-700 group-hover:scale-[1.08] [filter:brightness(0.85)] group-hover:[filter:brightness(1)]"
                        style={
                          {
                            viewTransitionName: `product-${p.id}`,
                          } as React.CSSProperties
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] text-center leading-relaxed">
                          Photography
                          <br />
                          pending
                        </div>
                      </div>
                    )}

                    {/* Top meta row — category morphs to filled signal on hover */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 text-[color:var(--color-signal)] group-hover:text-[color:var(--color-ink)] group-hover:bg-[color:var(--color-signal)] transition-colors duration-500">
                        {categoryLabel(p.category)}
                      </div>
                      {p.featured && (
                        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-ink)] bg-[color:var(--color-signal)] px-2 py-1 animate-pulse">
                          ★ Featured
                        </div>
                      )}
                    </div>

                    {/* Bottom-right gallery indicator (fades out on hover so the overlay can take over) */}
                    {p.image && p.gallery.length > 1 && (
                      <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-steel-soft)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 z-10 transition-opacity duration-300 group-hover:opacity-0">
                        ◇ {p.gallery.length} shots
                      </div>
                    )}

                    {/* "View machine →" overlay — slides up from bottom edge on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/90 to-transparent pt-16 pb-5 px-5 z-10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-signal)]">
                          View machine
                        </span>
                        <span className="font-mono text-sm text-[color:var(--color-signal)] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 delay-150">
                          ⟶
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info pane — name + tags + meta */}
                  <div className="p-5 border-t border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
                    <h3 className="font-display text-xl tracking-[-0.01em] leading-[1.15] mb-3 min-h-[3.5rem]">
                      {p.name}
                    </h3>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] border border-[color:var(--color-neutral-700)] px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-end justify-between gap-2 pt-3 border-t border-[color:var(--color-neutral-700)]">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-500)] leading-relaxed">
                        {p.monthlyPrice != null ? (
                          <>
                            From
                            <br />
                            <span className="text-[color:var(--color-signal)] text-sm tracking-normal normal-case">
                              RM {p.monthlyPrice.toLocaleString()}/mo
                            </span>
                          </>
                        ) : (
                          <>
                            Price
                            <br />
                            <span className="text-[color:var(--color-paper)] text-sm tracking-normal normal-case">
                              On request
                            </span>
                          </>
                        )}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] group-hover:translate-x-1 transition-all duration-300">
                        View →
                      </div>
                    </div>
                  </div>
                </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Empty state — shouldn't trigger with current data, defensive */}
        {machines.length === 0 && (
          <div className="text-center py-32">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-4">
              — No machines match this filter
            </div>
            <Link
              href="/products"
              className="font-mono text-sm uppercase tracking-wider text-[color:var(--color-signal)] hover:text-[color:var(--color-signal-bright)] transition"
            >
              See all machines →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
