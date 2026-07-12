'use client';

import dynamic from 'next/dynamic';

type Machine = { image: string; slug: string; name: string };

/**
 * Lazy boundary for MachineHyperscroll — the single heaviest below-the-fold
 * client section (a 3D scroll flythrough that pulls in the animation runtime).
 * Code-split with `ssr: false` so its JS is NOT in the initial bundle and does
 * not run during first load — the main lever for the homepage's LCP/TBT
 * (Lighthouse showed ~4.5s of vendor JS blocking the main thread on throttled
 * mobile). No SEO cost: these featured machines also render in the SSR'd
 * MachineAccordion immediately below and in the /products catalogue.
 *
 * The placeholder reserves a screen of height so the swap-in (far below the
 * fold, on scroll approach) does not shift above-the-fold content — CLS stays
 * at 0.
 */
const MachineHyperscrollImpl = dynamic(
  () => import('./machine-hyperscroll').then((m) => m.MachineHyperscroll),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[color:var(--color-ink)]" aria-hidden="true" />
    ),
  },
);

export function MachineHyperscrollLazy({ machines }: { machines: Machine[] }) {
  return <MachineHyperscrollImpl machines={machines} />;
}
