'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { storeLead } from '@/lib/kv';
import ContactAck from '@/emails/contact-ack';
import NewLeadInternal from '@/emails/new-lead-internal';

const resend = new Resend(process.env.RESEND_API_KEY);

// Intent values map to internal routing — the inbox the email is
// dispatched to changes based on what the visitor said they need.
// 'other' falls through to the general inbox.
const INTENT_VALUES = [
  'quote',
  'service',
  'tour',
  'engineering',
  'internship',
  'other',
] as const;

export const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(200).optional(),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional(),
  message: z.string().min(10).max(2000),
  intent: z.enum(INTENT_VALUES).default('other'),
  department: z.string().max(50).optional(),
  locale: z.enum(['en', 'ms', 'zh']).default('en'),
});

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// Inbox routing — each intent has its own subject prefix so the team
// can filter/route in Resend. The `to:` stays the same (single inbox)
// for now; swap to per-intent addresses once the team scales.
const INTENT_SUBJECT: Record<(typeof INTENT_VALUES)[number], string> = {
  quote: '[QUOTE]',
  service: '[SERVICE]',
  tour: '[TOUR]',
  engineering: '[ENG]',
  internship: '[INTERN]',
  other: '[Contact]',
};

export async function submitContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please check the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Persist the lead best-effort — a KV outage must not block the emails.
  let leadId = 'unstored';
  try {
    const lead = await storeLead({
      kind: 'contact',
      locale: parsed.data.locale,
      data: parsed.data,
    });
    leadId = lead.id;
  } catch {
    // KV unconfigured / unreachable — continue to email.
  }

  try {
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: ['hello@auraplex.my'],
      replyTo: parsed.data.email,
      subject: `${INTENT_SUBJECT[parsed.data.intent]} ${parsed.data.name}${parsed.data.company ? ` · ${parsed.data.company}` : ''}`,
      react: NewLeadInternal({
        kind: 'contact',
        data: parsed.data,
        leadId,
      }),
    });
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: 'Thanks — we received your message',
      react: ContactAck({ name: parsed.data.name }),
    });
    return { ok: true };
  } catch {
    // Don't leak provider internals to the client.
    return { ok: false, error: 'Could not send right now. Please try again or WhatsApp us.' };
  }
}
