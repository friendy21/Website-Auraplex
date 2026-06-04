'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  /** Extra scroll distance multiplier. Default 1.2 (20% overscroll). */
  overscroll?: number;
  className?: string;
}

/**
 * HorizontalScrollSection — pinned, scrub-driven horizontal scroll.
 *
 * The container pins at `top top`. As the user scrolls vertically, the
 * inner track translates horizontally. Each direct child becomes a panel
 * that occupies the full viewport width.
 *
 * Mobile (< 768px) and reduced-motion fall back to a normal vertical stack.
 */
export function HorizontalScrollSection({
  children,
  overscroll = 1.2,
  className,
}: Props) {
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current || !track.current) return;

      const isMobile =
        typeof window !== 'undefined' && window.innerWidth < 768;
      const prefersReduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReduce) {
        gsap.set(track.current, { x: 0 });
        return;
      }

      const trackEl = track.current;
      const totalScroll = trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: -totalScroll * overscroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: () => `+=${totalScroll * overscroll}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className={`relative overflow-hidden bg-[color:var(--color-ink)] ${className ?? ''}`}
    >
      <div
        ref={track}
        className="flex h-[100dvh] will-change-transform"
        style={{ width: 'max-content' }}
      >
        {children}
      </div>
    </section>
  );
}
