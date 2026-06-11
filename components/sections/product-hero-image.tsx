'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { TiltCard } from '@/components/motion/tilt-card';

type Props = {
  src: string;
  alt: string;
  productId: string;
};

/**
 * Product-detail hero image with cinematic focus-pull entrance and an
 * X-RAY hover mode.
 *
 * On mount:
 *   filter: blur(8px) → blur(0)
 *   scale:  1.05      → 1
 *   over 900ms ease-out — looks like a camera racking focus.
 *
 * On hover (fine pointers): the photo inverts into a cerulean
 * blueprint/X-ray treatment — pure CSS filter transition (invert +
 * hue-rotate + grayscale), compositor-friendly, no extra asset. A mono
 * "X-RAY" chip appears in the corner so the mode reads as deliberate.
 *
 * The container is the parent's `data-cursor="caliper"` target, so the cursor
 * morphs to a crosshair. CursorSpotlight is scoped to this image for the
 * "alive panel" feel on the detail page.
 */
export function ProductHeroImage({ src, alt, productId }: Props) {
  return (
    <TiltCard intensity={3}>
      <motion.div
        initial={{ filter: 'blur(8px)', scale: 1.05, opacity: 0 }}
        animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
        data-cursor="caliper"
      >
        <CursorSpotlight size={420} intensity={0.18} />
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-contain p-12 transition-[filter] duration-500 ease-out group-hover:[filter:invert(0.92)_hue-rotate(180deg)_grayscale(0.25)_contrast(1.05)]"
          style={
            { viewTransitionName: `product-${productId}` } as React.CSSProperties
          }
        />
        {/* X-RAY chip — fades in with the blueprint mode */}
        <div
          className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] border border-[color:var(--color-signal)]/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        >
          ◉ X-Ray
        </div>
      </motion.div>
    </TiltCard>
  );
}
