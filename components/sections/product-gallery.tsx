'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { TiltCard } from '@/components/motion/tilt-card';

type Props = {
  /** Gallery images — index 0 is the cover. */
  images: string[];
  alt: string;
  productId: string;
};

/**
 * ProductGallery — the product-detail hero gallery.
 *
 * MECHANISM: this was an <AnimatePresence> crossfade — one absolutely
 * positioned <motion.div> per `active` index, swapped on every thumbnail
 * click — plus a `useInView` gate on the thumbnail strip and a `layoutId`
 * ring that glided between thumbnails. All of it lived on motion/react, on
 * the LCP surface of every /products/[slug] page.
 *
 * It is now a NATIVE SCROLL-SNAP CARRIAGE (styles/motion/products.css). Every
 * view is a slide in a `scroll-snap-type: x mandatory` track; the thumbnails
 * scroll it, the scroll position feeds `active` back. That is a strict upgrade
 * on the buyer-facing surface:
 *   - touch users can now SWIPE the gallery, which was impossible before;
 *   - the snap, momentum and rubber-band are compositor-driven, so paging
 *     through six machine shots costs the main thread nothing;
 *   - only the cover is `priority`; the remaining slides sit outside the
 *     viewport horizontally, so the browser's own lazy-loading defers them
 *     (a stacked crossfade would have had to download every full-size shot).
 *
 * Two framer behaviours were deliberately dropped rather than kept alive:
 *   1. The dissolve between shots. It is now a horizontal slide — which is
 *      what scroll-snap gives for free, and what a swipe gesture implies.
 *   2. The gliding active-thumbnail ring (`layoutId`). That is a true FLIP
 *      between two different boxes; CSS can only express it by animating
 *      layout properties. The ring now springs open in place on the selected
 *      thumbnail. See the note in styles/motion/products.css.
 *
 * Preserved exactly: the `role="listbox"` / `role="option"` strip with its
 * `aria-selected` and per-thumbnail `aria-label`s, the ArrowLeft/ArrowRight
 * handler and its wrap-around, the shot counter, the X-Ray chip, the
 * `priority` on the cover, and the `viewTransitionName` on the cover while it
 * is the active view (so the grid→detail morph still works and no two elements
 * ever claim the same name).
 *
 * Reduced motion needs no JS branch any more: the smooth scroll comes from the
 * CSS `scroll-behavior` on the track, and the global block in globals.css
 * already forces `scroll-behavior: auto !important`.
 */
export function ProductGallery({ images, alt, productId }: Props) {
  const t = useTranslations('products.detail');
  const [active, setActive] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const hasThumbs = images.length > 1;
  const count = images.length;

  /**
   * Scroll position → active index. rAF-coalesced so a flick doesn't queue a
   * setState per scroll event, and it bails out when the index is unchanged,
   * so a whole swipe costs at most one render.
   */
  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = trackRef.current;
      if (!el || el.clientWidth === 0) return;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      const next = Math.min(Math.max(i, 0), count - 1);
      setActive((prev) => (prev === next ? prev : next));
    });
  }, [count]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  /** Scroll the track to a slide. `scroll-behavior: smooth` lives in CSS so
   *  reduced-motion users get an instant jump via the global override. */
  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActive(next);
      const el = trackRef.current;
      if (el) el.scrollTo({ left: next * el.clientWidth });
    },
    [count],
  );

  return (
    <div>
      <TiltCard intensity={3}>
        <div
          className="pgal-frame group relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
          data-cursor="caliper"
        >
          <CursorSpotlight size={420} intensity={0.18} />

          {/* Snap track — one slide per view. */}
          <div ref={trackRef} onScroll={onScroll} className="pgal-track absolute inset-0 flex">
            {images.map((src, i) => (
              <div key={src} className="pgal-slide relative h-full w-full shrink-0">
                <Image
                  src={src}
                  alt={i === 0 ? alt : `${alt} — ${t('gallery.viewSuffix', { n: i + 1 })}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={i === 0}
                  className="object-contain p-12 transition-[filter] duration-500 ease-out group-hover:[filter:invert(0.92)_hue-rotate(180deg)_grayscale(0.25)_contrast(1.05)]"
                  style={
                    i === 0 && active === 0
                      ? ({ viewTransitionName: `product-${productId}` } as CSSProperties)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

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
        </div>
      </TiltCard>

      {/* Thumbnail strip */}
      {hasThumbs && (
        <div className="mt-3 space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
            {t('galleryLabel', { count: images.length })}
          </div>
          <div
            role="listbox"
            aria-label={t('gallery.aria', { name: alt })}
            className="grid grid-cols-4 md:grid-cols-6 gap-3"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(active + 1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(active - 1);
              }
            }}
          >
            {images.map((src, i) => {
              const isActive = i === active;
              return (
                <button
                  key={src}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={t('gallery.showView', { n: i + 1 })}
                  onClick={() => goTo(i)}
                  /* `--i` drives the entrance stagger in products.css. Capped
                     at 10 to reproduce framer's Math.min(i * 0.05, 0.5). */
                  style={{ '--i': Math.min(i, 10) } as CSSProperties}
                  className="pgal-thumb relative aspect-square border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] cursor-pointer overflow-hidden transition-colors duration-300 hover:border-[color:var(--color-signal)]/60 focus-visible:outline-2 focus-visible:outline-[color:var(--color-signal)] focus-visible:outline-offset-2"
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
                  <span
                    aria-hidden="true"
                    className="pgal-thumb__ring absolute inset-0 border-2 border-[color:var(--color-signal)] pointer-events-none"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
