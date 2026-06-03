import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';

export function ValuePropGrid() {
  const t = useTranslations('home.valueProps');
  const items = t.raw('items') as { num: string; title: string; body: string }[];

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48">
      <Reveal variant="up">
        <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
          {t('title')}
        </h2>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16">
        {items.map((item, i) => (
          <Reveal
            key={item.num}
            variant="up"
            delay={i * 100}
            className={
              i === 0
                ? 'md:col-span-7'
                : i === 1
                ? 'md:col-span-5 md:mt-24'
                : 'md:col-span-6 md:col-start-4'
            }
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
              — {item.num}
            </div>
            <h3 className="font-display text-3xl md:text-5xl tracking-[-0.01em] leading-tight">
              {item.title}
            </h3>
            <p className="mt-6 max-w-md prose-editorial text-[color:var(--color-steel-soft)]">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
