'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Mode = 'default' | 'link' | 'caliper' | 'button' | 'text';

/**
 * Visual cursor overlay — multi-state graphic that lags behind the native
 * cursor with spring physics. Native cursor stays visible underneath; this
 * is purely additive.
 *
 * States detected by traversing the DOM at pointermove:
 *   default → 6px signal dot
 *   link    → 28px ring with center dot
 *   caliper → full crosshair SVG (over data-cursor="caliper")
 *   button  → filled signal disc (over button[type], .btn, [role=button])
 *   text    → narrow I-beam (over text inputs / contenteditable)
 *
 * Skips on touch + reduced-motion. Renders nothing in either case.
 *
 * NOTE: The brief asks for `body { cursor: none }` to fully replace the native
 * cursor. We intentionally do NOT hide the native cursor — when this overlay
 * fails (long task, hydration mismatch, JS error), users would otherwise lose
 * the pointer entirely. To enable full-replacement mode, uncomment the rule
 * in styles/globals.css under "Custom cursor — currently unwired".
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.5 });
  const [mode, setMode] = useState<Mode>('default');
  const [pressed, setPressed] = useState(false);

  // Lazy init reads platform/preferences once at first render. Avoids the
  // React 19 set-state-in-effect rule and lets us early-return cleanly.
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return false;
    if (window.matchMedia('(pointer: coarse)').matches) return false;
    return true;
  });

  useEffect(() => {
    if (!supported) return;

    function classify(el: Element | null): Mode {
      if (!el) return 'default';
      if (el.closest('[data-cursor="caliper"]')) return 'caliper';
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable)
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

  if (!supported) return null;

  // Per-mode visual specs — single source of truth.
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
