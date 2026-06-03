import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';

type Props = {
  slug: string;
  title: string;
  customer: string;
  summary: string;
  pullQuote: string;
  attribution: string;
  image: string;
  outcomes: { metric: string; value: string }[];
};

export function CaseStudyFeature({ slug, title, customer, summary, pullQuote, attribution, image, outcomes }: Props) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 lg:py-40">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
        — Featured / Case study
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <Reveal variant="scale" className="col-span-12 lg:col-span-7 relative aspect-[4/5]">
          <Image src={image} alt={customer} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
        </Reveal>

        <div className="col-span-12 lg:col-span-5 lg:pl-8 space-y-8">
          <Reveal variant="up">
            <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">{customer}</div>
            <h3 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mt-4">{title}</h3>
          </Reveal>

          <Reveal variant="up" delay={100} className="prose-editorial text-[color:var(--color-steel-soft)]">
            <p>{summary}</p>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <blockquote className="font-display text-3xl md:text-4xl leading-[1.15] tracking-[-0.01em] text-[color:var(--color-paper)] border-l-2 border-[color:var(--color-signal)] pl-6">
              {pullQuote}
            </blockquote>
            <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mt-4 pl-6">
              — {attribution}
            </div>
          </Reveal>

          <Reveal variant="up" delay={300} className="grid grid-cols-2 gap-6 pt-4 border-t border-[color:var(--color-steel)]/30">
            {outcomes.map((o, i) => (
              <div key={i}>
                <div className="font-display text-3xl text-[color:var(--color-signal)]">{o.value}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mt-1">{o.metric}</div>
              </div>
            ))}
          </Reveal>

          <Reveal variant="up" delay={400}>
            <Link
              href={`/case-studies/${slug}`}
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[color:var(--color-paper)] hover:text-[color:var(--color-signal)] transition"
            >
              Read full case study →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
