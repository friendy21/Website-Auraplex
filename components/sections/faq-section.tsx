'use client';

import { useTranslations } from 'next-intl';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/primitives/accordion';
import { Reveal } from '@/components/motion/reveal';
import { faqSchema } from '@/lib/seo';

export function FaqSection() {
  const t = useTranslations('home.faq');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 lg:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }} />
      <div className="grid grid-cols-12 gap-6">
        <Reveal variant="up" className="col-span-12 md:col-span-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — FAQ
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1]">
            {t('title')}
          </h2>
        </Reveal>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
