import Link from 'next/link';
import Image from 'next/image';

type Item = { image: string; slug: string; name: string };

type Props = { items: Item[] };

/**
 * AutoCarousel3D — a pure-CSS 3D carousel: cards sit on a cylinder
 * (rotateY + translateZ, radius via CSS tan()) inside a perspective scene
 * that rotates forever. Faithful to thebabydino/dPXVyqN. Zero JS.
 *
 * Interactive: hovering the scene pauses the spin (CSS animation-play-state)
 * and every card is a real link to its machine. The global reduced-motion
 * rule freezes the spin.
 */
export function AutoCarousel3D({ items }: Props) {
  const n = items.length;
  if (!n) return null;

  return (
    <div
      className="acx-scene h-[58vh] min-h-[400px] w-full"
      role="list"
      aria-label="Auraplex machines"
    >
      <div className="acx-3d" style={{ '--n': n } as React.CSSProperties}>
        {items.map((m, i) => (
          <Link
            key={m.slug + i}
            href={`/products/${m.slug}`}
            data-cursor="caliper"
            role="listitem"
            aria-label={m.name}
            className="acx-card group block border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] transition-[border-color] duration-300 hover:border-[color:var(--color-signal)]"
            style={{ '--i': i } as React.CSSProperties}
          >
            <Image
              src={m.image}
              alt={m.name}
              fill
              sizes="280px"
              className="object-cover [filter:brightness(0.85)] transition-[filter] duration-300 group-hover:brightness-100"
            />
            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[color:var(--color-ink)]/85 to-transparent px-3 pt-8 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-paper)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {m.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
