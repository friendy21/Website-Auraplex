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

export interface TickerStats {
  machines: number;
  labels: number;
  uptime: string;
  factories: number;
}

const DEFAULT_TICKER: TickerStats = {
  machines: 1247,
  labels: 8_200_000,
  uptime: '99.4%',
  factories: 340,
};

export async function getTickerStats(): Promise<TickerStats> {
  // The ?? must be applied to the resolved value, not the Promise.
  const [machines, labels, uptime, factories] = await Promise.all([
    kv.get<number>('ticker:machines'),
    kv.get<number>('ticker:labels-today'),
    kv.get<string>('ticker:uptime'),
    kv.get<number>('ticker:factories'),
  ]);
  return {
    machines: machines ?? DEFAULT_TICKER.machines,
    labels: labels ?? DEFAULT_TICKER.labels,
    uptime: uptime ?? DEFAULT_TICKER.uptime,
    factories: factories ?? DEFAULT_TICKER.factories,
  };
}
