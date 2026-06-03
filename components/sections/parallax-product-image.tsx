'use client';

import Image from 'next/image';
import { useState, useRef, type CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  /** viewTransitionName for shared-element morph to the detail page. */
  productId: string;
  /** sizes hint passed to next/image. */
  sizes?: string;
};

/**
 * Product card image with cursor-tracking object-position parallax.
 *
 * On desktop (fine pointer), the image's focal point follows the cursor's
 * position within the card bounds — within a small ±4% range so it reads as
 * subtle parallax, not a swing. Combined with the existing scale-on-hover
 * the image feels alive without being theatrical.
 *
 * On touch devices (pointerType === 'touch'), the handler returns early so
 * we never bind handlers that would just fight with scroll.
 */
export function ParallaxProductImage({
  src,
  alt,
  productId,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    // Map cursor to 46–54% range — keeps the parallax restrained.
    const x = 50 + (((e.clientX - r.left) / r.width - 0.5) * 8);
    const y = 50 + (((e.clientY - r.top) / r.height - 0.5) * 8);
    setPos({ x, y });
  }

  function onPointerLeave() {
    setPos({ x: 50, y: 50 });
  }

  const style: CSSProperties = {
    viewTransitionName: `product-${productId}`,
    objectPosition: `${pos.x}% ${pos.y}%`,
    transition: 'object-position 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="absolute inset-0"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain p-4 transition-all duration-700 group-hover:scale-[1.08] [filter:brightness(0.85)] group-hover:[filter:brightness(1)]"
        style={style}
      />
    </div>
  );
}
