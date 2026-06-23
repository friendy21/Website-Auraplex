'use server';

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createStreamableValue } from 'ai/rsc';
import { MACHINES, machineTags } from '@/lib/catalog';
import { storeLead } from '@/lib/kv';

const SYSTEM_PROMPT = `You are the Auraplex Machine Finder — a senior application engineer helping ASEAN manufacturers choose the right labelling or packaging machine.

Your job: ask 3–5 sharp diagnostic questions, then recommend ONE primary machine. Be concrete: cite label type, container shape, surface, and the customer's stated production line constraints. Speak plainly, no marketing fluff. Do not quote prices — pricing is handled by the sales team via direct quote.

You answer in the user's language (English / Bahasa Malaysia / Mandarin). Default to English.

When you have enough info, end your final response with a JSON block:
\`\`\`json
{ "recommendedSlug": "...", "confidence": "high|medium|low", "reasons": ["..."] }
\`\`\`
The recommendedSlug MUST be one of the slugs listed below.

Catalog (use these slugs):`;

/**
 * Build the catalog context from the committed source of truth
 * (`lib/catalog.ts`) rather than Sanity. The previous implementation called
 * `sanityFetch`, which *throws* when Sanity isn't configured — taking the
 * whole finder down in the default/pre-launch state. Names + auto-derived
 * tags give the model enough to differentiate machines (per-machine specs
 * aren't published yet).
 */
function catalogContext(): string {
  return MACHINES.map((m) => {
    const tags = machineTags(m);
    const tagStr = tags.length ? ` [${tags.join(', ')}]` : '';
    return `- ${m.slug}: ${m.name}${tagStr} (${m.category})`;
  }).join('\n');
}

export async function machineFinderStream(
  history: { role: 'user' | 'assistant'; content: string }[],
) {
  const stream = createStreamableValue('');

  // Guard the key up front so a missing/unconfigured key surfaces as a clean
  // client-side error (the chat's catch shows the i18n error) instead of an
  // unhandled rejection inside a detached async task.
  if (!process.env.ANTHROPIC_API_KEY) {
    stream.error(new Error('Machine Finder is not configured'));
    return { output: stream.value };
  }

  const system = `${SYSTEM_PROMPT}\n${catalogContext()}`;

  (async () => {
    try {
      const { textStream } = await streamText({
        model: anthropic('claude-opus-4-8'),
        system,
        messages: history,
        temperature: 0.4,
      });
      for await (const chunk of textStream) stream.update(chunk);
      stream.done();
    } catch (err) {
      // Surface to the client's `for await` loop so its catch fires and the
      // stream is properly terminated (never left hanging).
      stream.error(err instanceof Error ? err : new Error('AI request failed'));
    }
  })();

  return { output: stream.value };
}

/**
 * Persist a completed machine-finder session as a lead once the model has
 * produced a recommendation. Best-effort: if KV isn't configured this
 * no-ops so the recommendation UX still works in dev/pre-launch.
 */
export async function recordMachineFinderLead(input: {
  recommendedSlug: string;
  locale: string;
  transcript: { role: 'user' | 'assistant'; content: string }[];
}): Promise<void> {
  try {
    await storeLead({
      kind: 'machine-finder',
      locale: input.locale,
      data: {
        recommendedSlug: input.recommendedSlug,
        transcript: input.transcript,
      },
    });
  } catch {
    // KV unconfigured / unreachable — non-fatal.
  }
}
