'use server';

import { z } from 'zod';
import { storeLead } from '@/lib/kv';
import { localizeFormErrors, formMessage } from '@/lib/form-errors';
import { sendMail, LEADS_INBOX } from '@/lib/mail';
import ContactAck from '@/emails/contact-ack';
import NewLeadInternal from '@/emails/new-lead-internal';

// Internship application schema — captures everything the recruiting
// team needs to prioritise a CV review without a follow-up email.
const FIELDS = [
  'mechanical',
  'electrical',
  'controls',
  'software',
  'industrial-design',
  'service',
  'other',
] as const;

export const InternshipSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional(),
  university: z.string().min(2).max(200),
  field: z.enum(FIELDS),
  semester: z.string().min(1).max(50),
  startDate: z.string().min(1).max(40), // freeform — "January 2027", "ASAP", etc.
  durationMonths: z.coerce.number().int().min(1).max(24).optional(),
  cvUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  motivation: z.string().min(20).max(2000),
  locale: z.enum(['en', 'ms', 'zh']).default('en'),
});

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInternship(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // FormData → object, dropping empties so optional URL fields don't
  // trip the schema's url() validator.
  const raw: Record<string, FormDataEntryValue> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === 'string' && v.trim() === '') continue;
    raw[k] = v;
  }
  const parsed = InternshipSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      ...(await localizeFormErrors(
        raw.locale,
        parsed.error.flatten().fieldErrors,
      )),
    };
  }

  // Persist best-effort — a KV outage must not block the emails.
  let leadId = 'unstored';
  try {
    const lead = await storeLead({
      kind: 'internship',
      locale: parsed.data.locale,
      data: parsed.data,
    });
    leadId = lead.id;
  } catch {
    // continue to email
  }

  try {
    await sendMail({
      to: [LEADS_INBOX],
      replyTo: parsed.data.email,
      subject: `[INTERN] ${parsed.data.name} · ${parsed.data.university} · ${parsed.data.field}`,
      react: NewLeadInternal({
        kind: 'internship',
        data: parsed.data,
        leadId,
      }),
    });
  } catch {
    return { ok: false, error: await formMessage(parsed.data.locale, 'sendFailed') };
  }

  // Application is with the team — a failed acknowledgement must not
  // prompt a duplicate submission.
  try {
    await sendMail({
      to: [parsed.data.email],
      subject: 'Thanks — we received your internship application',
      react: ContactAck({ name: parsed.data.name }),
    });
  } catch {
    // logged in sendMail
  }
  return { ok: true };
}
