'use client';

import { motion } from 'motion/react';

const TESTIMONIALS = [
  { quote: 'Installation took two days. Production hit spec on day three.', author: 'Ops Director, KL beverage co.' },
  { quote: 'The financing made our CFO say yes. The reliability made us reorder.', author: 'GM, JB cosmetics manufacturer' },
  { quote: 'Local support means a part on the floor by next morning, not next month.', author: 'Plant Manager, Penang food line' },
  { quote: 'We retired three Chinese-import labellers for one Auraplex unit.', author: 'CEO, Sabah edible oils' },
  { quote: 'Throughput up 40%. Labour reallocated, not laid off. That mattered.', author: 'COO, Selangor pharma' },
];

export function TestimonialMarquee() {
  return (
    <section className="py-24 overflow-hidden border-y border-[color:var(--color-steel)]/20">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12 mx-auto max-w-[1600px] px-6 lg:px-12">
        — Voices from the floor
      </div>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="flex gap-16 whitespace-nowrap pointer-events-none hover:[animation-play-state:paused]"
      >
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} className="flex flex-col gap-3 max-w-md shrink-0">
            <p className="font-display text-2xl md:text-3xl leading-snug whitespace-normal">"{t.quote}"</p>
            <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">— {t.author}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
