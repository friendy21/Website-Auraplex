'use client';

import { usePathname } from 'next/navigation';


/**
 * TransitionWipe — a 2px signal-cerulean line that sweeps across the
 * viewport on every route change. The "power-on" punctuation: a hard
 * mechanical left-to-right pass, no crossfade, no softness, so navigations
 * read as a machine state change rather than a fade.
 *
 * Hooks into Next's App Router via `usePathname()` — fires after the new
 * route mounts. `key={pathname}` is the whole mechanism: React tears down the
 * old node and mounts a fresh one on every navigation, and a freshly mounted
 * element runs its CSS animation from the top. No motion library, no state,
 * no effect, no cleanup to get wrong.
 *
 * The 500ms sweep and its `--ease-mech` curve live in
 * styles/motion/transition-wipe.css, which also documents why the bar can
 * never be left parked over the page.
 *
 * Reduced motion: handled globally in globals.css, which collapses the
 * animation to 0.01ms; `fill: both` lands it on its off-screen end state.
 */
export function TransitionWipe() {
  const pathname = usePathname();

  return <div key={pathname} aria-hidden className="transition-wipe" />;
}
