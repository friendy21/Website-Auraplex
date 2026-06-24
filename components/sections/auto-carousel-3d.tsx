'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDragRotate } from '@/components/motion/use-drag-rotate';

type Item = { image: string; slug: string; name: string };
type Props = { items: Item[] };

/**
 * AutoCarousel3D — a 3D carousel of machine cards on a cylinder (rotateY +
 * translateZ, radius via CSS tan()). Faithful to thebabydino/dPXVyqN's
 * geometry, but made interactive: grab and spin it (useDragRotate), it idles
 * with a slow auto-rotation and throws with momentum. Every card links to its
 * machine; drags don't misfire a navigation.
 */
export function AutoCarousel3D({ items }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const n = items.length;

  const moved = useDragRotate(stage, ring, {
    allowVertical: false,
    dragRatio: 0.25,
    idleSpeed: 360 / 44000,
  });

  if (!n) return null;

  return (
    <div
      ref={stage}
      className="acx-scene h-[58vh] min-h-[400px] w-full select-none"
      style={{ cursor: 'grab', touchAction: 'pan-y' }}
      role="list"
      aria-label="Auraplex machines — drag to spin"
      onClickCapture={(e) => {
        if (moved.current > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div
        ref={ring}
        className="grid place-self-center"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform', '--n': n } as React.CSSProperties}
      >
        {items.map((m, i) => (
          <Link
            key={m.slug + i}
            href={`/products/${m.slug}`}
            data-cursor="caliper"
            role="listitem"
            aria-label={m.name}
            draggable={false}
            className="acx-card group block border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-[border-color] duration-300 hover:border-[color:var(--color-signal)]"
            style={{ '--i': i } as React.CSSProperties}
          >
            <Image
              src={m.image}
              alt={m.name}
              fill
              sizes="280px"
              draggable={false}
              className="object-cover [filter:brightness(0.85)] transition-[filter] duration-300 group-hover:brightness-100"
            />
            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[color:var(--color-ink)]/85 to-transparent px-3 pt-8 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-paper)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {m.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
