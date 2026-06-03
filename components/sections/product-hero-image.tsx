'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';

type Props = {
  src: string;
  alt: string;
  productId: string;
};

/**
 * Product-detail hero image with cinematic focus-pull entrance.
 *
 * On mount:
 *   filter: blur(8px) → blur(0)
 *   scale:  1.05      → 1
 *   over 900ms ease-out — looks like a camera racking focus.
 *
 * The container is the parent's `data-cursor="caliper"` target, so the cursor
 * morphs to a crosshair. CursorSpotlight is scoped to this image for the
 * "alive panel" feel on the detail page.
 */
export function ProductHeroImage({ src, alt, productId }: Props) {
  return (
    <motion.div
      initial={{ filter: 'blur(8px)', scale: 1.05, opacity: 0 }}
      animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
      data-cursor="caliper"
    >
      <CursorSpotlight size={420} intensity={0.18} />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
        className="object-contain p-12"
        style={
          { viewTransitionName: `product-${productId}` } as React.CSSProperties
        }
      />
    </motion.div>
  );
}
