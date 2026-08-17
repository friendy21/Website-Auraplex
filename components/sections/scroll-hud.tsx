type Props = { label: string };

/**
 * ScrollHud — a fixed cinematic HUD overlay: corner telemetry readouts + a
 * live scroll-progress bar and percentage. Faithful to the *HUD* layer of
 * aleksa-rakocevic/pvbboZx ("Hyper Scroll"), minus its full-page 3D world
 * flythrough and the feTurbulence noise overlay (which this codebase removed
 * for performance — see atmosphere-provider). Desktop-only, pointer-events
 * none, reduced-motion safe.
 *
 * Both live readouts are scroll-driven CSS (styles/motion/data-viz.css): the
 * bar is a scaleX on `scroll(root block)`, and the percentage is a registered
 * <integer> custom property rendered through CSS counters. The previous
 * implementation ran a setState on every scroll frame, re-rendering a fixed
 * full-viewport overlay; this version holds no state and ships no JS, so it
 * renders on the server.
 */
export function ScrollHud({ label }: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
    >
      {/* Top scroll-progress line */}
      <div className="hud-progress absolute top-0 left-0 right-0 h-px bg-[color:var(--color-signal)]" />

      {/* Top-left identity */}
      <div className="absolute top-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/45">
        {label}
      </div>

      {/* Top-right REC + scroll %. The readout is wrapped in a single <span>
          so it stays ONE flex item — an inner element sitting directly in the
          `gap-2` flex row would have gaps injected around the digits. */}
      <div className="absolute top-5 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)] animate-pulse" />
        <span>REC · <span className="hud-pct" />%</span>
      </div>

      {/* Bottom telemetry (real Seri Kembangan coordinates) */}
      <div className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/40">
        LAT 3.02°N · LON 101.71°E
      </div>
      <div className="absolute bottom-5 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/40">
        Selangor · MY
      </div>

      {/* Corner brackets */}
      <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[color:var(--color-ink)]/25" />
      <span className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[color:var(--color-ink)]/25" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[color:var(--color-ink)]/25" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[color:var(--color-ink)]/25" />
    </div>
  );
}
