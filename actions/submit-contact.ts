'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { storeLead } from '@/lib/kv';
import ContactAck from '@/emails/contact-ack';
import NewLeadInternal from '@/emails/new-lead-internal';

const resend = new Resend(process.env.RESEND_API_KEY);

export const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(200).optional(),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional(),
  message: z.string().min(10).max(2000),
  locale: z.enum(['en', 'ms', 'zh']).default('en'),
});

export type ActionState = { ok: boolean; error?: string };

export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'Invalid input' };

  try {
    const lead = await storeLead({ kind: 'contact', locale: parsed.data.locale, data: parsed.data });
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: ['hello@auraplex.my'],
      replyTo: parsed.data.email,
      subject: `[Contact] ${parsed.data.name}`,
      react: NewLeadInternal({ kind: 'contact', data: parsed.data, leadId: lead.id }),
    });
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: 'Thanks — we received your message',
      react: ContactAck({ name: parsed.data.name }),
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown' };
  }
}
