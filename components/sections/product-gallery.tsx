'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { TiltCard } from '@/components/motion/tilt-card';
import { useReducedMotion } from '@/lib/hooks';

type Props = {
  /** Gallery images — index 0 is the cover. */
  images: string[];
  alt: string;
  productId: string;
};

/**
 * ProductGallery — interactive, animated product-detail gallery.
 *
 * Replaces the previous static cover + non-clickable thumbnail strip.
 * Clicking (or keyboard-selecting) a thumbnail swaps the hero with a
 * focus-pull crossfade (blur + scale + opacity), the same camera-racking
 * aesthetic the single hero used on mount. The active thumbnail is tracked
 * with a shared-layout ring (`layoutId`) that glides between thumbnails.
 *
 * Performance / a11y:
 *   - Crossfade and entrance are reduced-motion aware (instant swap, no
 *     entrance offset) via `useReducedMotion`.
 *   - TiltCard and CursorSpotlight already self-disable on coarse pointers
 *     and reduced-motion, so the hero stays cheap on phones.
 *   - Only transform/opacity/filter animate — all compositor-friendly.
 *   - The cover keeps its `viewTransitionName` so the grid→detail morph
 *     still works; it's applied only while the cover is active so two
 *     elements never claim the same name.
 */
export function ProductGallery({ images, alt, productId }: Props) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const stripRef = useRef<HTMLDivElement>(null);
  const stripInView = useInView(stripRef, { once: true, margin: '0px 0px -10% 0px' });

  const hasThumbs = images.length > 1;
  const swap = reduced ? 0 : 0.5;

  function selectRelative(delta: number) {
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <TiltCard intensity={3}>
        <motion.div
          initial={{ filter: 'blur(8px)', scale: 1.05, opacity: 0 }}
          animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
          data-cursor="caliper"
        >
          <CursorSpotlight size={420} intensity={0.18} />

          {/* Crossfading hero — both images overlap briefly for a true
              dissolve rather than a flash of background. */}
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: reduced ? 1 : 1.04, filter: reduced ? 'blur(0px)' : 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: swap, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={active === 0 ? alt : `${alt} — view ${active + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={active === 0}
                className="object-contain p-12 transition-[filter] duration-500 ease-out group-hover:[filter:invert(0.92)_hue-rotate(180deg)_grayscale(0.25)_contrast(1.05)]"
                style={
                  active === 0
                    ? ({ viewTransitionName: `product-${productId}` } as React.CSSProperties)
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>

          {/* X-RAY chip */}
          <div
            className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] border border-[color:var(--color-signal)]/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            aria-hidden="true"
          >
            ◉ X-Ray
          </div>

          {/* Shot counter */}
          {hasThumbs && (
            <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-steel-soft)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1 z-10 pointer-events-none">
              {active + 1} / {images.length}
            </div>
          )}
        </motion.div>
      </TiltCard>

      {/* Thumbnail strip */}
      {hasThumbs && (
        <div className="mt-3 space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
            Gallery · {images.length} shots
          </div>
          <div
            ref={stripRef}
            role="listbox"
            aria-label={`${alt} gallery`}
            className="grid grid-cols-4 md:grid-cols-6 gap-3"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                selectRelative(1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                selectRelative(-1);
              }
            }}
          >
            {images.map((src, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={src}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={`Show view ${i + 1}`}
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  animate={
                    stripInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: reduced ? 0 : 14 }
                  }
                  transition={{
                    duration: reduced ? 0 : 0.45,
                    delay: reduced ? 0 : Math.min(i * 0.05, 0.5),
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="relative aspect-square border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] cursor-pointer overflow-hidden transition-colors duration-300 hover:border-[color:var(--color-signal)]/60 focus-visible:outline-2 focus-visible:outline-[color:var(--color-signal)] focus-visible:outline-offset-2"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 25vw, 12vw"
                    className={`object-contain p-2 transition-[transform,opacity] duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-[1.05]'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId={`gallery-active-${productId}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 border-2 border-[color:var(--color-signal)] pointer-events-none"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
