'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

type SortItem = {
  key: string;
  label: string;
  /** Precomputed href — built on the server so we never pass a function across
   *  the server→client boundary (RSC can't serialize functions). */
  href: string;
};

type Props = {
  items: SortItem[];
  activeKey: string;
};

/**
 * Sliding pill indicator for sort options. Uses Motion's `layoutId` shared
 * element animation so the cerulean pill morphs between the active labels
 * instead of snapping.
 */
export function SortTabs({ items, activeKey }: Props) {
  return (
    <div className="relative flex items-center gap-px bg-[color:var(--color-neutral-700)]/40 p-[2px] rounded-sm">
      {items.map((s) => {
        const active = s.key === activeKey;
        return (
          <Link
            key={s.key}
            href={s.href}
            className={`relative px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
              active
                ? 'text-[color:var(--color-ink)]'
                : 'text-[color:var(--color-steel-soft)] hover:text-[color:var(--color-paper)]'
            }`}
          >
            {active && (
              <motion.span
                layoutId="sort-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-[color:var(--color-signal)] rounded-sm -z-0"
              />
            )}
            <span className="relative z-10">{s.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
