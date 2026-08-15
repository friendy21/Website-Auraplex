'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/lib/navigation';

/**
 * PageHud — the shared "you're inside the Auraplex system" corner readout.
 *
 * A fixed, non-interactive console overlay that appears on secondary pages so
 * they speak the same visual language as the homepage hero + closer HUDs:
 * a SECTOR label (the page), a live SCROLL depth percentage, mono coordinates
 * and corner brackets. It fades in shortly after mount and never blocks input.
 *
 * Rendered once per page (drop it at the top of a page's JSX). Skips itself on
 * touch/coarse-small screens where it would crowd the layout, and is inert
 * under reduced-motion (static, no scroll listener churn beyond a cheap rAF).
 */
export function PageHud({ sector }: { sector: string }) {
  const pathname = usePathname();
  const [depth, setDepth] = useState(0);
  const [shown, setShown] = useState(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const show = setTimeout(() => setShown(true), 400);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf.current = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setDepth(Math.round(p * 9999));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(show);
      cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Stable per-path node id so it rhymes with the flythrough's ID-XX cards.
  const nodeId = pathname
    ? String(pathname.length * 7).padStart(3, '0').slice(-3)
    : '000';

  return (
    <div
      className="pointer-events-none fixed inset-6 z-30 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] transition-opacity duration-700 lg:block"
      style={{ opacity: shown ? 0.85 : 0 }}
      aria-hidden="true"
    >
      <div className="absolute top-1/2 right-0 -translate-y-1/2 text-right leading-relaxed">
        <div className="text-[color:var(--color-signal)]">SECTOR / {sector}</div>
        <div>
          DEPTH <span className="tabular-nums">{String(depth).padStart(4, '0')}</span>
        </div>
        <div className="text-[color:var(--color-neutral-500)]">NODE ID-{nodeId}</div>
      </div>
      <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-[color:var(--color-paper)]/20" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[color:var(--color-paper)]/20" />
    </div>
  );
}
