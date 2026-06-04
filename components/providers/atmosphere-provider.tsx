'use client';

import { useSyncExternalStore } from 'react';

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function noop() {
  return () => {};
}

/**
 * Global atmospheric layers — noise grain, breathing vignette, and signal fog.
 * These are fixed overlays (pointer-events:none) that give the ink background
 * atmospheric depth so the site never feels like a flat webpage.
 *
 * - Grain: SVG fractalNoise at very low opacity, mix-blend overlay.
 * - Vignette: Radial gradient that slowly breathes (8s cycle).
 * - Fog: Subtle signal-colored haze that pools at the bottom edge.
 *
 * All layers are disabled for users with prefers-reduced-motion via
 * useSyncExternalStore (hydration-safe, no setState-in-effect).
 */
export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(
    noop,
    getReducedMotion,
    () => false,
  );
  const active = !reduced;

  return (
    <>
      {children}
      {active && (
        <>
          {/* Noise grain — fractalNoise SVG overlay */}
          <div className="atmosphere-grain" aria-hidden="true">
            <svg width="100%" height="100%">
              <filter id="global-grain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#global-grain)" />
            </svg>
          </div>

          {/* Breathing vignette */}
          <div className="atmosphere-vignette" aria-hidden="true" />

          {/* Signal fog */}
          <div className="atmosphere-fog" aria-hidden="true" />
        </>
      )}
    </>
  );
}
