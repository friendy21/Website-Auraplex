import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';
import { MACHINES, type Category } from '@/lib/catalog';

// Pick the first machine in each category that has a downloaded cover image.
// This way the homepage never shows a "photography pending" placeholder.
function pickCover(category: Category): { src: string; alt: string } | null {
  const m = MACHINES.find((x) => x.category === category && x.image !== null);
  return m && m.image ? { src: m.image, alt: m.name } : null;
}

export function ProductShowcase() {
  const t = useTranslations('home.categories');
  const ts = useTranslations('home.showcase');

  const labelling = pickCover('labelling');
  const packaging = pickCover('packaging');
  const automation = pickCover('automation');

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
      <div className="grid grid-cols-12 gap-6 mb-12">
        <Reveal variant="up" className="col-span-12 md:col-span-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — {ts('eyebrow')}
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1]">
            {ts('h2Line1')} {ts('h2Line2')}
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <CategoryCard
          href="/products?category=labelling"
          number={`01 / ${ts('familyLabel')}`}
          title={t('labelling')}
          cover={labelling}
          className="col-span-12 md:col-span-7"
          delay={0}
        />
        <CategoryCard
          href="/products?category=packaging"
          number={`02 / ${ts('familyLabel')}`}
          title={t('packaging')}
          cover={packaging}
          className="col-span-12 md:col-span-5"
          delay={150}
        />
        <CategoryCard
          href="/products?category=automation"
          number={`03 / ${ts('familyLabel')}`}
          title={t('automation')}
          cover={automation}
          aspect="aspect-[21/9]"
          className="col-span-12"
          delay={300}
          gradientDirection="r"
        />
      </div>
    </section>
  );
}

function CategoryCard({
  href,
  number,
  title,
  cover,
  className,
  aspect = 'aspect-[4/3]',
  delay = 0,
  gradientDirection = 't',
}: {
  href: string;
  number: string;
  title: string;
  cover: { src: string; alt: string } | null;
  className?: string;
  aspect?: string;
  delay?: number;
  gradientDirection?: 't' | 'r';
}) {
  return (
    <Reveal variant="scale" delay={delay} className={`group ${className ?? ''}`}>
      <Link
        href={href}
        className={`block relative ${aspect} overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]`}
        data-cursor="caliper"
      >
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        <div
          className={
            gradientDirection === 'r'
              ? 'absolute inset-0 bg-gradient-to-r from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-transparent'
              : 'absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/30 to-transparent'
          }
        />
        <div
          className={
            gradientDirection === 'r'
              ? 'absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl'
              : 'absolute bottom-0 left-0 right-0 p-8'
          }
        >
          <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-signal)] mb-2">
            {number}
          </div>
          <h3 className="font-display text-3xl md:text-5xl">{title}</h3>
        </div>
      </Link>
    </Reveal>
  );
}
