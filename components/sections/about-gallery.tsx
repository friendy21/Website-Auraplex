'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { usePerfTier } from '@/lib/hooks';

type Item = { src: string; alt: string; caption?: string };

/**
 * AboutGallery — an editorial parallax image montage. As the section scrolls
 * through the viewport the three frames drift at different rates and each
 * image clip-reveals + settles from a slight scale on enter.
 *
 * Swap the images freely — the layout takes any 3 (cover-cropped).
 * Perf/a11y: desktop parallax only meaningfully moves; frozen on the
 * 'minimal' tier (reduced motion); transform/opacity/clip only.
 */
export function AboutGallery({ items }: { items: Item[] }) {
  const ref = useRef<HTMLElement>(null);
  const tier = usePerfTier();
  const still = tier === 'minimal';
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 90]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -130]);

  const a = items[0];
  const b = items[1];
  const c = items[2];

  return (
    <section
      ref={ref}
      className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 grid grid-cols-12 gap-6 items-start"
    >
      {a && (
        <Frame item={a} y={y1} still={still} className="col-span-12 lg:col-span-7 aspect-[4/3]" />
      )}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:pt-16">
        {b && <Frame item={b} y={y2} still={still} className="aspect-[5/4]" />}
        {c && <Frame item={c} y={y3} still={still} className="aspect-[16/10]" />}
      </div>
    </section>
  );
}

function Frame({
  item,
  y,
  still,
  className,
}: {
  item: Item;
  y: MotionValue<number>;
  still: boolean;
  className: string;
}) {
  return (
    <motion.figure style={{ y }} className={`group relative ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(14% 0% 14% 0%)', scale: still ? 1 : 1.12, opacity: 0.5 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full w-full overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)]/60 via-transparent to-transparent" />
        {item.caption && (
          <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--color-paper)] bg-[color:var(--color-ink)]/70 backdrop-blur-sm px-2 py-1">
            {item.caption}
          </figcaption>
        )}
      </motion.div>
    </motion.figure>
  );
}
