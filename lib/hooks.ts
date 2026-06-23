'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Shared, hydration-safe client hooks for motion gating.
 *
 * Centralises the `matchMedia` / capability probing that was previously
 * duplicated inline across custom-cursor, machine-carousel, atmosphere-
 * provider, etc. The goal is a single source of truth for "how much
 * animation can this device afford" so heavy effects degrade consistently
 * on low-end and mobile hardware.
 *
 * All hooks use `useSyncExternalStore` with a server snapshot of `false`
 * so they never cause hydration mismatches: the first client paint matches
 * SSR, then upgrades on the next tick.
 */

function noop(): () => void {
  return () => {};
}

/** True once running on the client (after hydration). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Reactive `matchMedia` — re-renders when the query result changes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Reactive `prefers-reduced-motion: reduce`. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export type PerfTier = 'full' | 'lite' | 'minimal';

/**
 * Synchronous capability read for use *inside* effects / event handlers
 * (e.g. a Canvas RAF loop) where calling a hook isn't possible.
 *
 *   'minimal' — user opted out of motion: render the cheapest possible thing.
 *   'lite'    — phone-class or low-power device: reduce particle counts,
 *               skip O(n²) work, drop secondary glow passes.
 *   'full'    — desktop-class: the full treatment.
 *
 * Detection blends an explicit reduced-motion signal, a coarse-pointer +
 * small-viewport check (phones/tablets), and static hardware hints
 * (CPU cores, device memory, Save-Data). Conservative by design: when a
 * signal is unavailable we assume the more capable tier rather than
 * degrading needlessly.
 */
export function getPerfTier(): PerfTier {
  if (typeof window === 'undefined') return 'full';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'minimal';
  }

  const coarseSmall = window.matchMedia(
    '(pointer: coarse) and (max-width: 768px)',
  ).matches;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;

  if (coarseSmall || cores <= 4 || memory <= 4 || saveData) return 'lite';
  return 'full';
}

/** Reactive perf tier for render-time decisions. Upgrades after hydration. */
export function usePerfTier(): PerfTier {
  const reduced = useReducedMotion();
  const coarseSmall = useMediaQuery('(pointer: coarse) and (max-width: 768px)');
  const isClient = useIsClient();

  if (!isClient) return 'full';
  if (reduced) return 'minimal';
  if (coarseSmall || lowPowerStatic()) return 'lite';
  return 'full';
}

function lowPowerStatic(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 || (nav.connection?.saveData ?? false);
}
