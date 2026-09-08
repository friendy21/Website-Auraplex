'use server';

import { MACHINES, machineTags, type Machine } from '@/lib/catalog';
import { storeLead } from '@/lib/kv';

/**
 * Machine Finder — self-hosted rewrite.
 *
 * Previously used Anthropic Claude via streamText. Now calls the self-hosted
 * qwen3 recommender at ${CHAT_API_URL}/recommend. Single-shot (not streaming):
 * send full conversation history + catalog + locale, receive { reply,
 * recommendation }.
 *
 * URL note: this is a Server Action, so the fetch happens INSIDE the Nomad
 * container, not from the browser. That's why CHAT_API_URL is NOT prefixed
 * with NEXT_PUBLIC_ — no need to inline at build time, and the default
 * `http://127.0.0.1:8091` reaches the sibling chat container directly via
 * host networking. Set CHAT_API_URL to the public HTTPS URL only if the
 * website is deployed somewhere that can't reach the chat service on loopback.
 */

const CHAT_API_URL =
  process.env.CHAT_API_URL ?? 'http://127.0.0.1:8091';

type Role = 'user' | 'assistant';

export type MachineFinderResult =
  | {
      ok: true;
      reply: string;
      recommendation: {
        recommendedSlug: string;
        confidence?: 'high' | 'medium' | 'low';
        reasons: string[];
      } | null;
    }
  | { ok: false; error: string };

/**
 * Build the trimmed catalog payload sent to the backend. The backend cares
 * about slug/name/category/tags/summary — not images, generated fields or
 * per-locale copy. Keeping this small keeps the prompt fast.
 *
 * IMPORTANT: `machineTags(m)` reads `m.nameEn ?? m.name` internally, so we
 * MUST pass the un-localized Machine object here (which is what MACHINES holds).
 * The `name` we send to the backend uses the same fallback so the recommender
 * sees a stable English name regardless of the caller's locale.
 */
function buildCatalogPayload(machines: readonly Machine[]) {
  return machines.map((m) => {
    const tags = machineTags(m);
    return {
      slug: m.slug,
      name: m.nameEn ?? m.name,
      category: m.category,
      tags: tags.length ? tags : undefined,
      summary: m.summary || undefined,
    };
  });
}

export async function machineFinderRecommend(
  history: { role: Role; content: string }[],
  locale: 'en' | 'ms' | 'zh' = 'en',
): Promise<MachineFinderResult> {
  if (history.length === 0) {
    return { ok: false, error: 'History cannot be empty' };
  }

  try {
    const res = await fetch(`${CHAT_API_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        catalog: buildCatalogPayload(MACHINES),
        locale,
      }),
      // Recommender: ~15-30s cold, 3-10s warm. Guard against proxy trims.
      signal: AbortSignal.timeout(90_000),
    });

    if (res.status === 429) {
      const j = (await res.json().catch(() => ({}))) as { detail?: string };
      return { ok: false, error: j.detail ?? 'Rate limit exceeded' };
    }

    if (!res.ok) {
      return { ok: false, error: `Backend error (${res.status})` };
    }

    const data = (await res.json()) as {
      reply: string;
      recommendation:
        | {
            recommendedSlug: string;
            confidence?: 'high' | 'medium' | 'low';
            reasons: string[];
          }
        | null;
    };

    return {
      ok: true,
      reply: data.reply ?? '',
      recommendation: data.recommendation ?? null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Persist a completed machine-finder session as a lead once a recommendation
 * has been produced. Best-effort: `lib/kv` is a stub that discards the lead
 * (see the README §Runtime data). Wire this to Resend in a follow-up commit
 * if these leads become commercially important.
 */
export async function recordMachineFinderLead(input: {
  recommendedSlug: string;
  locale: string;
  transcript: { role: Role; content: string }[];
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
