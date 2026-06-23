'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties } from 'react';

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
 * subtle parallax, not a swing.
 *
 * Perf: the focal point is written directly to the DOM node inside a single
 * rAF per frame (no React state → no re-render per pointer move), and the
 * write is coalesced so rapid pointer events don't queue redundant frames.
 * On touch devices the handler returns early so we never fight with scroll.
 */
export function ParallaxProductImage({
  src,
  alt,
  productId,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    // Map cursor to 46–54% range — keeps the parallax restrained.
    const x = 50 + (((e.clientX - r.left) / r.width - 0.5) * 8);
    const y = 50 + (((e.clientY - r.top) / r.height - 0.5) * 8);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (imgRef.current) imgRef.current.style.objectPosition = `${x}% ${y}%`;
    });
  }

  function onPointerLeave() {
    cancelAnimationFrame(rafRef.current);
    if (imgRef.current) imgRef.current.style.objectPosition = '50% 50%';
  }

  const style: CSSProperties = {
    viewTransitionName: `product-${productId}`,
    objectPosition: '50% 50%',
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
        ref={imgRef}
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
