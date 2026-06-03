'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { storeLead } from '@/lib/kv';
import QuoteAck from '@/emails/quote-ack';
import NewLeadInternal from '@/emails/new-lead-internal';

const resend = new Resend(process.env.RESEND_API_KEY);

export const QuoteSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  productSlug: z.string().optional(),
  configuration: z.record(z.string(), z.any()).optional(),
  message: z.string().max(2000).optional(),
  locale: z.enum(['en', 'ms', 'zh']).default('en'),
});

export type QuoteInput = z.infer<typeof QuoteSchema>;
export type ActionState = { ok: boolean; error?: string; leadId?: string };

export async function submitQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = QuoteSchema.safeParse({
    ...raw,
    configuration: raw.configuration ? JSON.parse(String(raw.configuration)) : undefined,
  });
  if (!parsed.success) return { ok: false, error: 'Invalid input' };

  try {
    const lead = await storeLead({
      kind: 'quote',
      locale: parsed.data.locale,
      data: parsed.data,
    });

    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: ['sales@auraplex.my'],
      replyTo: parsed.data.email,
      subject: `[Quote] ${parsed.data.company} — ${parsed.data.productSlug ?? 'general'}`,
      react: NewLeadInternal({ kind: 'quote', data: parsed.data, leadId: lead.id }),
    });

    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: 'Thanks — we received your quote request',
      react: QuoteAck({ name: parsed.data.name, productName: parsed.data.productSlug }),
    });

    return { ok: true, leadId: lead.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
