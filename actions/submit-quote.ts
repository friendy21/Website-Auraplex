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
export type ActionState = {
  ok: boolean;
  error?: string;
  leadId?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData);

  // The hidden `configuration` field is JSON — parse defensively so a
  // malformed value returns a clean error instead of throwing a raw 500.
  let configuration: unknown;
  if (raw.configuration) {
    try {
      configuration = JSON.parse(String(raw.configuration));
    } catch {
      return { ok: false, error: 'Invalid input' };
    }
  }

  const parsed = QuoteSchema.safeParse({ ...raw, configuration });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Persist best-effort — a KV outage must not block the emails.
  let leadId = 'unstored';
  try {
    const lead = await storeLead({
      kind: 'quote',
      locale: parsed.data.locale,
      data: parsed.data,
    });
    leadId = lead.id;
  } catch {
    // continue to email
  }

  try {
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: ['sales@auraplex.my'],
      replyTo: parsed.data.email,
      subject: `[Quote] ${parsed.data.company} — ${parsed.data.productSlug ?? 'general'}`,
      react: NewLeadInternal({ kind: 'quote', data: parsed.data, leadId }),
    });

    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: 'Thanks — we received your quote request',
      react: QuoteAck({ name: parsed.data.name, productName: parsed.data.productSlug }),
    });

    return { ok: true, leadId };
  } catch {
    return { ok: false, error: 'Could not send right now. Please try again or WhatsApp us.' };
  }
}
