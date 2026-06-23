'use client';

import { useReducedMotion } from '@/lib/hooks';

/**
 * Global atmospheric layers — vignette + signal fog.
 *
 * v2 of this provider has lost the SVG fractalNoise grain and the
 * background-shorthand-interpolated "breathing" vignette. Both were
 * profiled as serious perf offenders:
 *
 *   - feTurbulence on a fixed full-viewport overlay with mix-blend-mode:
 *     overlay forced the browser to re-rasterize a per-pixel turbulence
 *     filter every paint. Removed entirely; the 3.5% opacity grain was
 *     barely visible anyway.
 *
 *   - The vignette keyframes interpolated the `background` shorthand
 *     (radial-gradient), which can't be GPU-accelerated and forced full
 *     repaints on a fixed full-viewport layer every frame for 8 seconds
 *     forever. Now the vignette is static (no animation) — visually
 *     identical because the breath was only a ±0.05 ellipse variation.
 *
 * Disabled entirely for users with prefers-reduced-motion (no point
 * rendering atmospheric overlays they explicitly opted out of).
 */
export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  // Reactive: toggling the OS "reduce motion" setting now adds/removes the
  // atmosphere layers at runtime (previously read once via a no-op subscribe).
  const reduced = useReducedMotion();
  const active = !reduced;

  return (
    <>
      {children}
      {active && (
        <>
          {/* Static vignette — no animation, no expensive interpolation */}
          <div className="atmosphere-vignette" aria-hidden="true" />

          {/* Signal-deep fog at the bottom edge */}
          <div className="atmosphere-fog" aria-hidden="true" />
        </>
      )}
    </>
  );
}
