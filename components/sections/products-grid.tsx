'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { TiltCard } from '@/components/motion/tilt-card';
import { ParallaxProductImage } from '@/components/sections/parallax-product-image';
import { machineTags, type Category, type Machine } from '@/lib/catalog';

type SortKey = 'featured' | 'photographed' | 'az';

interface Props {
  machines: Machine[];
  categories: { key?: Category; label: string; count: number }[];
  sortItems: { key: SortKey; label: string }[];
  initialCategory?: Category;
  initialSort?: SortKey;
  _locale: string;
  t: Record<string, string>;
}

/**
 * ProductsGrid — client-side animated product grid with AnimatePresence.
 *
 * Filtering and sorting happen locally (no full page reload). The URL is
 * silently updated via history.pushState so shareable links still work.
 *
 * Animations:
 *   - Category tabs: a sliding signal pill follows the active tab (layoutId).
 *   - Grid items: exit (scale 0.9, opacity 0, y 20), enter (scale 0.9,
 *     opacity 0, y -20), stagger 30ms capped at 400ms total.
 *   - Reordering: motion's layout prop smooths the shuffle.
 */
export function ProductsGrid({
  machines,
  categories,
  sortItems,
  initialCategory,
  initialSort = 'featured',
  _locale,
  t,
}: Props) {
  const [category, setCategory] = useState<Category | undefined>(initialCategory);
  const [sort, setSort] = useState<SortKey>(initialSort);

  // Silently update URL when filters change (no full reload)
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort !== 'featured') params.set('sort', sort);
    const q = params.toString();
    const path = q ? `/products?${q}` : '/products';
    window.history.replaceState({}, '', path);
  }, [category, sort]);

  const filtered = category
    ? machines.filter((m) => m.category === category)
    : machines;

  const sorted = sortMachines(filtered, sort);
  const photographedCount = sorted.filter((m) => m.image !== null).length;
  const pendingCount = sorted.length - photographedCount;

  const _activeCatIndex = categories.findIndex(
    (c) => c.key === category || (!category && !c.key),
  );

  return (
    <>
      {/* ── CONTROLS BAR ── */}
      <section className="sticky top-14 z-30 bg-[color:var(--color-ink)]/90 backdrop-blur-xl border-b border-[color:var(--color-neutral-700)]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-4 flex items-center justify-between gap-6 flex-wrap">
          {/* Category tabs with sliding signal pill */}
          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.15em]">
            {categories.map((c) => {
              const active = category === c.key || (!category && !c.key);
              return (
                <button
                  key={c.label}
                  onClick={() => setCategory(c.key)}
                  className="relative px-3 py-1.5 flex items-center gap-2 transition-colors duration-300"
                >
                  {active && (
                    <motion.div
                      layoutId="active-cat-pill"
                      className="absolute inset-0 border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-[color:var(--color-paper)]">
                    {c.label}
                  </span>
                  <span
                    className={`relative z-10 text-[10px] ${
                      active
                        ? 'text-[color:var(--color-signal-bright)]'
                        : 'text-[color:var(--color-neutral-500)]'
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em]">
            <span className="text-[color:var(--color-neutral-500)]">{t.sortLabel}</span>
            <div className="flex gap-1">
              {sortItems.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-2.5 py-1 transition-colors duration-300 ${
                    sort === s.key
                      ? 'text-[color:var(--color-signal)]'
                      : 'text-[color:var(--color-steel-soft)] hover:text-[color:var(--color-paper)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULT COUNTER ── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-8 pb-4 flex items-end justify-between flex-wrap gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          {t.showing?.replace('{n}', String(sorted.length))}
          {category && t.ofTotal?.replace('{total}', String(machines.length))}
          {category && (
            <>
              {' '}
              · <span className="text-[color:var(--color-signal)]">{t[`cat_${category}`]}</span>
            </>
          )}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
          {t.photographedSummary
            ?.replace('{photo}', String(photographedCount))
            ?.replace('{pending}', String(pendingCount))}
        </div>
      </section>

      {/* ── ANIMATED GRID ── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pb-32">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" layout>
          <AnimatePresence mode="popLayout">
            {sorted.map((p, i) => {
              const tags = machineTags(p);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(i * 0.03, 0.4),
                    ease: [0.4, 0, 0.2, 1],
                    layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  }}
                  className="group"
                >
                  <TiltCard intensity={4}>
                    <Link
                      href={`/products/${p.slug}`}
                      data-cursor="caliper"
                      className="block relative overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-all duration-500 hover:border-[color:var(--color-signal)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_color-mix(in_oklab,var(--color-signal)_30%,transparent)]"
                    >
                      {/* Image area */}
                      <div className="relative aspect-[4/3] bg-[color:var(--color-neutral-800)] overflow-hidden">
                        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-[color:var(--color-ink)]/70 via-[color:var(--color-ink)]/15 to-transparent pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full" />

                        {p.image ? (
                          <ParallaxProductImage
                            src={p.image}
                            alt={p.name}
                            productId={p.id}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)] text-center leading-relaxed">
                              {t.photographyPending}
                            </div>
                          </div>
                        )}

                        {/* Top meta row */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                          <div className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 text-[color:var(--color-signal)] group-hover:text-[color:var(--color-ink)] group-hover:bg-[color:var(--color-signal)] transition-colors duration-500">
                            {t[`cat_${p.category}`]}
                          </div>
                          {p.featured && (
                            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-ink)] bg-[color:var(--color-signal)] px-2 py-1 animate-pulse">
                              {t.featuredBadge}
                            </div>
                          )}
                        </div>

                        {/* Gallery indicator */}
                        {p.image && p.gallery.length > 1 && (
                          <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-steel-soft)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 z-10 transition-opacity duration-300 group-hover:opacity-0">
                            ◇ {t.shotsLabel?.replace('{n}', String(p.gallery.length))}
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/90 to-transparent pt-16 pb-5 px-5 z-10">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-signal)]">
                              {t.viewMachineLong}
                            </span>
                            <span className="font-mono text-sm text-[color:var(--color-signal)] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 delay-150">
                              ⟶
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info pane */}
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
                                {t.from}
                                <br />
                                <span className="text-[color:var(--color-signal)] text-sm tracking-normal normal-case">
                                  RM {p.monthlyPrice.toLocaleString()}
                                  {t.perMonth}
                                </span>
                              </>
                            ) : (
                              <span className="text-[color:var(--color-paper)] text-sm tracking-normal normal-case">
                                {t.priceOnRequest}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] group-hover:translate-x-1 transition-all duration-300">
                            {t.viewMachine} →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="text-center py-32">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-4">
              — {t.noMatch}
            </div>
            <Link
              href="/products"
              className="font-mono text-sm uppercase tracking-wider text-[color:var(--color-signal)] hover:text-[color:var(--color-signal-bright)] transition"
            >
              {t.seeAll} →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

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
  return arr.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (!!a.image !== !!b.image) return a.image ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
