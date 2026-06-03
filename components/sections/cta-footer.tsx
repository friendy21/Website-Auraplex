import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/primitives/button';
import { Reveal } from '@/components/motion/reveal';
import { whatsappLink } from '@/lib/utils';

export function CtaFooter() {
  const t = useTranslations('home.ctaFooter');
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 lg:py-48 border-t border-[color:var(--color-steel)]/20">
      <Reveal variant="up">
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] tracking-[-0.03em] leading-[0.95] max-w-4xl">
          {t('title')}
        </h2>
      </Reveal>
      <Reveal variant="up" delay={150} className="mt-12 flex flex-wrap gap-4">
        <Button asChild size="lg"><Link href="/contact">{t('quote')} →</Link></Button>
        <Button asChild variant="ghost" size="lg"><Link href="/about#tour">{t('tour')} →</Link></Button>
        <Button asChild variant="ghost" size="lg">
          <a href={whatsappLink('Hi Auraplex.')} target="_blank" rel="noreferrer">{t('whatsapp')} →</a>
        </Button>
      </Reveal>
    </section>
  );
}
