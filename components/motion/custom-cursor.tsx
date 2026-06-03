'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Mode = 'default' | 'link' | 'caliper' | 'button' | 'text';

/**
 * Visual cursor overlay — multi-state graphic that lags behind the native
 * cursor with spring physics. Native cursor stays visible underneath; this
 * is purely additive.
 *
 * Hydration: renders nothing on the server and on the first client paint
 * (matches), then mounts the cursor only if the platform supports it
 * (non-touch, motion allowed). Uses `useSyncExternalStore` so React handles
 * the SSR/CSR snapshot reconciliation cleanly — no setState in effect, no
 * hydration warnings.
 *
 * States detected by traversing the DOM at pointermove:
 *   default → 6px signal dot
 *   link    → 28px ring with center dot
 *   caliper → full crosshair SVG (over data-cursor="caliper")
 *   button  → filled signal disc (over button[type], .btn, [role=button])
 *   text    → narrow I-beam (over text inputs / contenteditable)
 */
export function CustomCursor() {
  // All three flags read via useSyncExternalStore — SSR-safe, hydration-safe.
  const isClient = useIsClient();
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const supported = isClient && !prefersReduced && !isCoarse;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.5 });
  const [mode, setMode] = useState<Mode>('default');
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!supported) return;

    function classify(el: Element | null): Mode {
      if (!el) return 'default';
      if (el.closest('[data-cursor="caliper"]')) return 'caliper';
      const tag = el.tagName.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        (el as HTMLElement).isContentEditable
      )
        return 'text';
      const role = el.getAttribute('role');
      if (
        tag === 'button' ||
        role === 'button' ||
        el.closest('button, [role="button"]')
      )
        return 'button';
      if (el.closest('a, [data-cursor="link"]')) return 'link';
      return 'default';
    }

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setMode(classify(e.target as Element));
    }
    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [supported, x, y]);

  // Render nothing on the server AND on the first client paint — both are
  // false-side reads of the external stores. Once those resolve post-mount,
  // we either render the cursor (supported) or stay null (touch / reduce).
  if (!supported) return null;

  const cfg: Record<
    Mode,
    {
      size: number;
      content: React.ReactNode;
      mixBlend?: React.CSSProperties['mixBlendMode'];
    }
  > = {
    default: {
      size: 8,
      content: (
        <div className="h-full w-full rounded-full bg-[color:var(--color-signal)]" />
      ),
    },
    link: {
      size: 28,
      content: (
        <div className="h-full w-full rounded-full border border-[color:var(--color-signal)] flex items-center justify-center">
          <div className="h-1 w-1 rounded-full bg-[color:var(--color-signal)]" />
        </div>
      ),
    },
    button: {
      size: 36,
      content: (
        <div className="h-full w-full rounded-full bg-[color:var(--color-signal)] flex items-center justify-center">
          <span className="font-mono text-[8px] uppercase tracking-widest text-[color:var(--color-ink)]">
            ●
          </span>
        </div>
      ),
    },
    caliper: {
      size: 36,
      mixBlend: 'difference',
      content: (
        <svg
          viewBox="0 0 36 36"
          width="36"
          height="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="text-[color:var(--color-paper)]"
        >
          <circle cx="18" cy="18" r="16" />
          <path d="M18 2v10M18 24v10M2 18h10M24 18h10" />
          <circle cx="18" cy="18" r="1.25" fill="currentColor" />
        </svg>
      ),
    },
    text: {
      size: 24,
      content: (
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="w-px h-full bg-[color:var(--color-signal)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-px bg-[color:var(--color-signal)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-px bg-[color:var(--color-signal)]" />
        </div>
      ),
    },
  };

  const c = cfg[mode];
  const scale = pressed ? 0.78 : mode === 'button' ? 1.05 : 1;

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: c.mixBlend,
      }}
    >
      <motion.div
        animate={{ scale, width: c.size, height: c.size }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        style={{ width: c.size, height: c.size }}
      >
        {c.content}
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Hydration-safe client/media-query hooks via useSyncExternalStore
// ────────────────────────────────────────────────────────────────────────

/**
 * Returns false on the server and the first client paint, then true after
 * hydration completes. No setState-in-effect, no hydration warning.
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Subscribes to a CSS media query. SSR/CSR-initial both return false so the
 * tree is identical; after hydration the real value is read and React swaps
 * it in cleanly.
 */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function noopSubscribe(): () => void {
  return () => {};
}
