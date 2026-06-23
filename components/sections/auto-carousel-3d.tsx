import Image from 'next/image';

type Props = { images: string[] };

/**
 * AutoCarousel3D — a pure-CSS 3D carousel: cards sit on a cylinder
 * (rotateY + translateZ, radius derived with CSS tan()) inside a perspective
 * scene that rotates forever. Faithful adaptation of thebabydino/dPXVyqN
 * ("Pure CSS 3D animated carousel"). Zero JS, GPU-composited; the global
 * reduced-motion rule freezes the spin. Decorative (aria-hidden).
 */
export function AutoCarousel3D({ images }: Props) {
  const n = images.length;
  if (!n) return null;

  return (
    <div
      className="acx-scene h-[58vh] min-h-[400px] w-full"
      aria-hidden="true"
    >
      <div className="acx-3d" style={{ '--n': n } as React.CSSProperties}>
        {images.map((src, i) => (
          <div
            key={i}
            className="acx-card border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
            style={{ '--i': i } as React.CSSProperties}
          >
            <Image src={src} alt="" fill sizes="280px" className="object-cover [filter:brightness(0.92)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
