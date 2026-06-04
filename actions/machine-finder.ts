'use server';

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createStreamableValue } from 'ai/rsc';
import { sanityFetch, queries } from '@/lib/sanity';

const SYSTEM_PROMPT = `You are the Auraplex Machine Finder — a senior application engineer helping ASEAN manufacturers choose the right labelling or packaging machine.

Your job: ask 3–5 sharp diagnostic questions, then recommend ONE primary machine. Be concrete: cite throughput, label type, container shape, and the customer's stated production line constraints. Speak plainly, no marketing fluff. Do not quote prices — pricing is handled by the sales team via direct quote.

You answer in the user's language (English / Bahasa Malaysia / Mandarin). Default to English.

When you have enough info, end your final response with a JSON block:
\`\`\`json
{ "recommendedSlug": "...", "confidence": "high|medium|low", "reasons": ["..."] }
\`\`\`

Catalog (use these slugs):`;

export async function machineFinderStream(history: { role: 'user' | 'assistant'; content: string }[]) {
  const products = await sanityFetch<{ slug: { current: string }; name: string; summary: string; speed: number }[]>(
    { query: queries.allProducts, tags: ['products'] },
  );

  const catalog = products
    .map((p) => `- ${p.slug.current}: ${p.name} — ${p.summary}${p.speed ? ` (${p.speed} units/min)` : ''}`)
    .join('\n');

  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: anthropic('claude-opus-4-7'),
      system: `${SYSTEM_PROMPT}\n${catalog}`,
      messages: history,
      temperature: 0.4,
    });
    for await (const chunk of textStream) stream.update(chunk);
    stream.done();
  })();

  return { output: stream.value };
}
