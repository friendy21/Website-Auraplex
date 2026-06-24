import { kv } from '@vercel/kv';

export type LeadKind = 'quote' | 'contact' | 'spec-sheet' | 'machine-finder' | 'tour' | 'internship';

export interface Lead {
  id: string;
  kind: LeadKind;
  createdAt: number;
  locale: string;
  data: Record<string, unknown>;
}

export async function storeLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
  const id = `lead_${crypto.randomUUID()}`;
  const full: Lead = { id, createdAt: Date.now(), ...lead };
  await kv.set(`leads:${id}`, full);
  await kv.lpush(`leads:index:${lead.kind}`, id);
  await kv.lpush('leads:index:all', id);
  return full;
}

export async function getLead(id: string): Promise<Lead | null> {
  return kv.get<Lead>(`leads:${id}`);
}

export async function listLeads(kind: LeadKind | 'all' = 'all', limit = 50): Promise<Lead[]> {
  const ids = await kv.lrange<string>(`leads:index:${kind}`, 0, limit - 1);
  if (!ids.length) return [];
  const pipeline = kv.pipeline();
  ids.forEach((id) => pipeline.get(`leads:${id}`));
  return (await pipeline.exec<Lead[]>()).filter(Boolean);
}

export async function incrCounter(name: string, by = 1): Promise<number> {
  return kv.incrby(`counter:${name}`, by);
}
