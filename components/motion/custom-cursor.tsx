'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useIsClient, useMediaQuery } from '@/lib/hooks';

type Mode = 'default' | 'link' | 'caliper' | 'button' | 'text';

/**
 * Visual cursor overlay — multi-state graphic that lags behind the native
 * cursor with spring physics. Native cursor stays visible underneath; this
 * is purely additive.
 *
 * v3 visual language:
 *   - default: 12px cerulean ring (precision feel, not a dot)
 *   - link:    48px ring filled at 10% with a 6px centre dot
 *   - caliper: 56px crosshair SVG with tick marks (mix-blend difference
 *     so it reads on any image)
 *   - button:  44px filled signal disc with an inner plus glyph
 *   - text:    20px I-beam (thin vertical bar with serifs)
 *
 * Cursor trail (adelt.io / flightstory feel): four ghost dots follow the
 * main cursor with progressively softer springs. Opacity decays from 0.30
 * to 0.05. Disabled in caliper/button modes to keep the cursor clean when
 * over interactive elements.
 *
 * Hydration: renders nothing on the server and on the first client paint
 * (matches), then mounts the cursor only if the platform supports it
 * (non-touch, motion allowed). Uses `useSyncExternalStore` so React handles
 * the SSR/CSR snapshot reconciliation cleanly.
 */
export function CustomCursor() {
  const isClient = useIsClient();
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const supported = isClient && !prefersReduced && !isCoarse;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.5 });

  // Trail dots — trimmed from four to two for perf. Each trail dot is
  // an additional pair of springs driven by Motion's RAF tick; four
  // dots meant 10 concurrent springs writing transforms every frame.
  // Two is enough to read as a comet tail without the throughput cost.
  const tx1 = useSpring(x, { stiffness: 400, damping: 40 });
  const ty1 = useSpring(y, { stiffness: 400, damping: 40 });
  const tx2 = useSpring(x, { stiffness: 150, damping: 28 });
  const ty2 = useSpring(y, { stiffness: 150, damping: 28 });

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

    // Pointermove fires at ~120Hz on modern trackpads. The cursor
    // position has to track every event for smoothness, but classify()
    // walks the DOM tree with .closest() up to four times — far too
    // expensive to run on every move. Throttle the classify call to
    // ~30Hz (every 33ms) which is well below the threshold at which a
    // cursor state change would be perceptible.
    let lastClassifyAt = 0;
    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      if (now - lastClassifyAt > 33) {
        lastClassifyAt = now;
        setMode(classify(e.target as Element));
      }
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

  useEffect(() => {
    if (!supported) return;
    document.documentElement.classList.add('cursor-custom');
    return () => document.documentElement.classList.remove('cursor-custom');
  }, [supported]);

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
      size: 12,
      content: (
        <div className="h-full w-full rounded-full border border-[color:var(--color-signal)] opacity-80" />
      ),
    },
    link: {
      size: 48,
      content: (
        <div className="h-full w-full rounded-full border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]" />
        </div>
      ),
    },
    caliper: {
      size: 56,
      mixBlend: 'difference',
      content: (
        <svg
          viewBox="0 0 56 56"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white"
        >
          <circle cx="28" cy="28" r="26" strokeOpacity="0.6" />
          <line x1="28" y1="2" x2="28" y2="14" />
          <line x1="28" y1="42" x2="28" y2="54" />
          <line x1="2" y1="28" x2="14" y2="28" />
          <line x1="42" y1="28" x2="54" y2="28" />
          <circle cx="28" cy="28" r="1.5" fill="currentColor" stroke="none" />
          <line x1="28" y1="16" x2="28" y2="20" strokeOpacity="0.4" />
          <line x1="28" y1="36" x2="28" y2="40" strokeOpacity="0.4" />
          <line x1="16" y1="28" x2="20" y2="28" strokeOpacity="0.4" />
          <line x1="36" y1="28" x2="40" y2="28" strokeOpacity="0.4" />
        </svg>
      ),
    },
    button: {
      size: 44,
      content: (
        <div className="h-full w-full rounded-full bg-[color:var(--color-signal)] flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </div>
      ),
    },
    text: {
      size: 20,
      content: (
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="w-px h-full bg-[color:var(--color-signal)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-px bg-[color:var(--color-signal)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-px bg-[color:var(--color-signal)]" />
        </div>
      ),
    },
  };

  const c = cfg[mode];
  const scale = pressed ? 0.78 : mode === 'button' ? 1.05 : 1;

  // Trail is only visible in default + link + text modes — when the cursor
  // is small or precision-oriented. Over buttons or caliper-tagged images
  // a comet tail would be visually noisy.
  const showTrail = mode === 'default' || mode === 'text';

  const trail = [
    { x: tx1, y: ty1, size: 6, opacity: 0.28 },
    { x: tx2, y: ty2, size: 4, opacity: 0.14 },
  ];

  return (
    <>
      {showTrail &&
        trail.map((t, i) => (
          <motion.div
            key={i}
            aria-hidden
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              x: t.x,
              y: t.y,
              translateX: '-50%',
              translateY: '-50%',
              width: t.size,
              height: t.size,
              borderRadius: '50%',
              backgroundColor: 'var(--color-signal)',
              opacity: t.opacity,
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />
        ))}
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
    </>
  );
}
