import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { getFeaturedMachines, categoryLabel } from '@/lib/catalog';

/**
 * Editorial "featured machines" spread for the homepage.
 *
 * Replaces the fabricated XYZ Foods case study card. Surfaces three real
 * machines from the catalog with real photography, lets the imagery do the
 * talking, and avoids inventing customer testimonials before real ones land.
 */
export function FeaturedMachines() {
  const featured = getFeaturedMachines().slice(0, 3);
  if (featured.length === 0) return null;

  const [hero, ...rest] = featured;

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 lg:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <Reveal variant="up" className="col-span-12 lg:col-span-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — Featured / Machines
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
            Every machine in the catalogue is engineered here in Malaysia, tested
            on real production lines, and supported by a local team in the
            language your floor speaks.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Reveal variant="scale" className="col-span-12 lg:col-span-7 group">
          <Link
            href={`/products/${hero.slug}`}
            className="block relative aspect-[4/5] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
            data-cursor="caliper"
          >
            {hero.image && (
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-16 transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-3">
                {categoryLabel(hero.category)}
              </div>
              <h3 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1] mb-4">
                {hero.name}
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-paper)] group-hover:text-[color:var(--color-signal)] transition-colors">
                View machine →
              </p>
            </div>
          </Link>
        </Reveal>

        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
          {rest.map((m, i) => (
            <Reveal
              key={m.id}
              variant="scale"
              delay={150 + i * 120}
              className="group"
            >
              <Link
                href={`/products/${m.slug}`}
                className="block relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
                data-cursor="caliper"
              >
                {m.image && (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-signal)] mb-2">
                    {categoryLabel(m.category)}
                  </div>
                  <h3 className="font-display text-2xl tracking-[-0.01em] leading-[1.05]">
                    {m.name}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal
        variant="up"
        delay={400}
        className="mt-12 flex items-center justify-between border-t border-[color:var(--color-neutral-700)] pt-8"
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          30 machines in the catalogue
        </div>
        <Link
          href="/products"
          className="font-mono text-sm uppercase tracking-wider text-[color:var(--color-paper)] hover:text-[color:var(--color-signal)] transition"
        >
          See the full catalogue →
        </Link>
      </Reveal>
    </section>
  );
}
