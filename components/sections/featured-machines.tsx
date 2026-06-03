'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';
import { ImageReveal } from '@/components/motion/image-reveal';
import { getFeaturedMachines, categoryLabel } from '@/lib/catalog';

/**
 * Editorial "featured machines" spread for the homepage.
 *
 *   - Hero card uses ImageReveal for the photo wipe + LetterDrop for the
 *     machine name (each letter drops from above with 30ms stagger).
 *   - Supporting cards use TiltCard for 3D perspective hover.
 *   - All cards carry data-cursor="caliper" so the custom cursor switches.
 */
export function FeaturedMachines() {
  const featured = getFeaturedMachines().slice(0, 3);
  if (featured.length === 0) return null;

  const [hero, ...rest] = featured;

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 lg:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <Reveal variant="up" className="col-span-12 lg:col-span-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            Featured · Machines
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
            Hand-built in Selangor. Photographed on the floor.
          </h2>
        </Reveal>
        <Reveal
          variant="up"
          delay={100}
          className="col-span-12 lg:col-span-4 lg:pl-8 flex items-end"
        >
          <p className="prose-editorial text-[color:var(--color-steel-soft)] max-w-md">
            Every machine in the catalogue is engineered here in Malaysia,
            tested on real production lines, and supported by a local team in
            the language your floor speaks.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Hero card */}
        <ImageReveal
          direction="up"
          duration={1.2}
          className="col-span-12 lg:col-span-7"
        >
          <TiltCard intensity={3}>
            <Link
              href={`/products/${hero.slug}`}
              data-cursor="caliper"
              className="group block relative aspect-[4/5] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-colors duration-500 hover:border-[color:var(--color-signal)]"
            >
              {hero.image && (
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-16 transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}

              {/* Ink veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/30 to-transparent" />

              {/* Cerulean tint that washes in on hover — restrained */}
              <div className="absolute inset-0 bg-[color:var(--color-signal)]/0 group-hover:bg-[color:var(--color-signal)]/[0.08] transition-colors duration-700" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
                  {categoryLabel(hero.category)}
                </div>

                {/* Letter-drop name */}
                <LetterDrop
                  text={hero.name}
                  className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1] mb-5"
                />

                <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-paper)] group-hover:text-[color:var(--color-signal)] transition-colors flex items-center gap-2">
                  View machine
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                    ⟶
                  </span>
                </p>
              </div>
            </Link>
          </TiltCard>
        </ImageReveal>

        {/* Supporting cards */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
          {rest.map((m, i) => (
            <Reveal
              key={m.id}
              variant="scale"
              delay={150 + i * 120}
              className="group"
            >
              <TiltCard intensity={4}>
                <Link
                  href={`/products/${m.slug}`}
                  data-cursor="caliper"
                  className="block relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-colors duration-500 hover:border-[color:var(--color-signal)]"
                >
                  {m.image && (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/30 to-transparent" />
                  <div className="absolute inset-0 bg-[color:var(--color-signal)]/0 group-hover:bg-[color:var(--color-signal)]/[0.08] transition-colors duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-signal)] mb-2">
                      {categoryLabel(m.category)}
                    </div>
                    <h3 className="font-display text-2xl tracking-[-0.01em] leading-[1.05]">
                      {m.name}
                    </h3>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal
        variant="up"
        delay={400}
        className="mt-12 flex items-center justify-between border-t border-[color:var(--color-neutral-700)] pt-8 gap-6 flex-wrap"
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          30 machines in the catalogue
        </div>
        <Link
          href="/products"
          className="group/cta font-mono text-sm uppercase tracking-wider text-[color:var(--color-paper)] hover:text-[color:var(--color-signal)] transition flex items-center gap-2"
        >
          See the full catalogue
          <span className="inline-block transition-transform duration-500 group-hover/cta:translate-x-2">
            ⟶
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

/**
 * Letter-by-letter drop reveal. Each letter starts at y: -40 with rotateX
 * (gives a slight 3D fall-in feel), settles into place with stagger.
 * Spaces preserved as non-animating runs to keep word breaks intact.
 */
function LetterDrop({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const chars = Array.from(text);

  return (
    <h3 ref={ref} className={className} style={{ perspective: 600 }}>
      {chars.map((c, i) => {
        if (c === ' ') return <span key={i}>&nbsp;</span>;
        return (
          <motion.span
            key={i}
            initial={{ y: -40, opacity: 0, rotateX: -45 }}
            animate={
              inView
                ? { y: 0, opacity: 1, rotateX: 0 }
                : { y: -40, opacity: 0, rotateX: -45 }
            }
            transition={{
              duration: 0.6,
              delay: i * 0.03,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ display: 'inline-block', transformOrigin: 'center top' }}
          >
            {c}
          </motion.span>
        );
      })}
    </h3>
  );
}
