/**
 * Lead storage — NO-OP STUB.
 *
 * This module used to wrap `@vercel/kv`. The site now runs as a plain Node
 * container under Nomad, where Vercel KV does not exist, so every function
 * below keeps its original signature and returns an empty/default value
 * instead of persisting anything.
 *
 * WHY THIS IS SAFE TODAY: lead capture never depended on KV as its delivery
 * mechanism. Every form action (submit-quote, submit-contact,
 * submit-internship, request-spec-sheet) already wraps `storeLead` in
 * try/catch — "Persist best-effort — a KV outage must not block the emails" —
 * and delivers the lead by Resend email, which is unaffected. `storeLead`
 * still returns a fully-formed Lead so callers that read `lead.id` keep
 * working.
 *
 * KNOWN GAP: `actions/machine-finder.ts` calls `storeLead` and does NOT send
 * an email, so machine-finder leads are not recorded anywhere while this stub
 * is in place. Accepted for launch — see the follow-up below.
 *
 * FOLLOW-UP (deliberately out of scope for the Nomad migration PR): swap this
 * for a standalone Redis client running under Nomad. The exported surface here
 * is exactly what that implementation needs to satisfy.
 */

export type LeadKind =
  | 'quote'
  | 'contact'
  | 'spec-sheet'
  | 'machine-finder'
  | 'tour'
  | 'internship';

export interface Lead {
  id: string;
  kind: LeadKind;
  createdAt: number;
  locale: string;
  data: Record<string, unknown>;
}

/** Builds and returns the Lead, but does not persist it. */
export async function storeLead(
  lead: Omit<Lead, 'id' | 'createdAt'>,
): Promise<Lead> {
  return { id: `lead_${crypto.randomUUID()}`, createdAt: Date.now(), ...lead };
}

/** Always null — nothing is stored to read back. */
export async function getLead(_id: string): Promise<Lead | null> {
  return null;
}

/** Always empty — nothing is stored to list. */
export async function listLeads(
  _kind: LeadKind | 'all' = 'all',
  _limit = 50,
): Promise<Lead[]> {
  return [];
}

/** Always 0 — counters are not tracked without a backing store. */
export async function incrCounter(_name: string, _by = 1): Promise<number> {
  return 0;
}
