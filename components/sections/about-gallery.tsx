import Image from 'next/image';
import { Reveal } from '@/components/motion/reveal';

type Item = { src: string; alt: string };
type Props = {
  items: Item[];
  eyebrow: string;
  heading: string;
  sub?: string;
};

/**
 * AboutGallery — a spacious editorial grid of machine photography that reveals
 * with a staggered scroll-in (Motion useInView via <Reveal>, which is the
 * codebase's reliable scroll-reveal primitive). Replaces the fan-out card
 * cluster, which overlapped at rest ("cramped") and depended on a finicky
 * scroll-scrub. Proper spacing, no overlap, object-contain so machines are
 * never cropped.
 */
export function AboutGallery({ items, eyebrow, heading, sub }: Props) {
  if (!items.length) return null;

  return (
    <section className="border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-5">
            — {eyebrow}
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
            {heading}
          </h2>
          {sub && (
            <p className="mt-6 max-w-xl prose-editorial text-[color:var(--color-steel-soft)]">
              {sub}
            </p>
          )}
        </Reveal>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((it, i) => (
            <Reveal key={i} variant="up" delay={(i % 3) * 90}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]">
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <figcaption className="absolute bottom-3 left-3 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-steel-soft)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {it.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
