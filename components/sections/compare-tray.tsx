'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { categoryLabel, machineTags, type Machine } from '@/lib/catalog';

type Props = {
  machines: Machine[];
  onRemove: (slug: string) => void;
  onClear: () => void;
  t: Record<string, string>;
};

/**
 * CompareTray — the catalogue's "decision mode" compare feature. A sticky bar
 * collects up to four selected machines; opening it slides up a side-by-side
 * drawer. Only honest, client-available facts are compared (family, photo
 * count, price/quote, highlight tags) — no invented spec numbers.
 *
 * Motion is transform/opacity only (compositor-friendly) and disabled-safe;
 * the drawer traps nothing destructive and every column links to its machine.
 */
export function CompareTray({ machines, onRemove, onClear, t }: Props) {
  const [open, setOpen] = useState(false);
  const has = machines.length > 0;

  return (
    <>
      {/* Sticky tray */}
      <AnimatePresence>
        {has && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-4 z-40 px-4 will-change-transform"
          >
            <div className="mx-auto max-w-3xl flex items-center gap-3 rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]/90 backdrop-blur-xl px-3 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="flex -space-x-2 pl-1">
                {machines.map((m) => (
                  <button
                    key={m.slug}
                    onClick={() => onRemove(m.slug)}
                    title={`${t.add}: ${m.name}`}
                    className="relative h-10 w-10 shrink-0 rounded-lg border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] overflow-hidden hover:border-[color:var(--color-signal)] transition-colors"
                  >
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill sizes="40px" className="object-contain p-1" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center font-mono text-[8px] text-[color:var(--color-steel)]">
                        ◍
                      </span>
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-[color:var(--color-ink)]/0 hover:bg-[color:var(--color-ink)]/70 text-[color:var(--color-paper)] opacity-0 hover:opacity-100 transition text-xs">
                      ✕
                    </span>
                  </button>
                ))}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] ml-1 hidden sm:block">
                {machines.length}/4 · {t.max}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={onClear}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] hover:text-[color:var(--color-paper)] px-3 py-2 transition"
                >
                  {t.clear}
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[color:var(--color-ink)] bg-[color:var(--color-signal)] rounded-full px-5 py-2.5 hover:-translate-y-px transition"
                >
                  {t.cta} →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              aria-label={t.clear}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[color:var(--color-ink)]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] will-change-transform"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 lg:px-12 py-5 bg-[color:var(--color-ink)] border-b border-[color:var(--color-neutral-700)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
                  — {t.title}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] hover:border-[color:var(--color-signal)] transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 lg:px-12 py-8 overflow-x-auto">
                <CompareTable machines={machines} t={t} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CompareTable({ machines, t }: { machines: Machine[]; t: Record<string, string> }) {
  const rows: { label: string; render: (m: Machine) => React.ReactNode }[] = [
    { label: t.rowFamily, render: (m) => categoryLabel(m.category) },
    {
      label: t.rowPhotos,
      render: (m) => (m.gallery.length > 0 ? String(m.gallery.length) : t.pending),
    },
    {
      label: t.rowPrice,
      render: (m) =>
        m.monthlyPrice != null ? `RM ${m.monthlyPrice.toLocaleString()}` : t.onRequest,
    },
    {
      label: t.rowTags,
      render: (m) => {
        const tags = machineTags(m);
        return tags.length ? (
          <span className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.12em] border border-[color:var(--color-neutral-700)] px-1.5 py-0.5 text-[color:var(--color-steel-soft)]"
              >
                {tag}
              </span>
            ))}
          </span>
        ) : (
          '—'
        );
      },
    },
  ];

  const colWidth = 'minmax(180px, 1fr)';
  const gridCols = `140px ${machines.map(() => colWidth).join(' ')}`;

  return (
    <div className="min-w-fit" style={{ display: 'grid', gridTemplateColumns: gridCols }}>
      {/* Header row: images + names */}
      <div className="border-b border-[color:var(--color-neutral-700)]" />
      {machines.map((m) => (
        <div key={m.slug} className="border-b border-[color:var(--color-neutral-700)] p-3">
          <div
            className="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden border border-[color:var(--color-neutral-700)]"
            style={{
              background:
                'radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--color-signal) 10%, transparent), transparent 60%)',
            }}
          >
            {m.image ? (
              <Image src={m.image} alt={m.name} fill sizes="220px" className="object-contain p-3" />
            ) : (
              <span className="absolute inset-0 grid place-items-center font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-400)]">
                {t.pending}
              </span>
            )}
          </div>
          <h3 className="font-display text-base leading-tight line-clamp-2">{m.name}</h3>
        </div>
      ))}

      {/* Attribute rows */}
      {rows.map((row) => (
        <Row key={row.label} label={row.label} machines={machines} render={row.render} />
      ))}

      {/* View links */}
      <div className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]" />
      {machines.map((m) => (
        <div key={m.slug} className="p-3">
          <Link
            href={`/products/${m.slug}`}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-signal)] hover:translate-x-1 inline-block transition-transform"
          >
            {t.view} →
          </Link>
        </div>
      ))}
    </div>
  );
}

function Row({
  label,
  machines,
  render,
}: {
  label: string;
  machines: Machine[];
  render: (m: Machine) => React.ReactNode;
}) {
  return (
    <>
      <div className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] border-b border-[color:var(--color-neutral-800)]">
        {label}
      </div>
      {machines.map((m) => (
        <div
          key={m.slug}
          className="p-3 text-sm text-[color:var(--color-paper)] border-b border-[color:var(--color-neutral-800)]"
        >
          {render(m)}
        </div>
      ))}
    </>
  );
}
