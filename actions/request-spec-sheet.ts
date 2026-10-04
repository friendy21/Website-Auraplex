'use server';

import { z } from 'zod';
import { storeLead } from '@/lib/kv';
import { getMachine } from '@/lib/catalog';
import { SITE } from '@/lib/seo';
import { formMessage } from '@/lib/form-errors';
import { sendMail, LEADS_INBOX } from '@/lib/mail';
import SpecSheet from '@/emails/spec-sheet';
import NewLeadInternal from '@/emails/new-lead-internal';

export const SpecSheetSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  productSlug: z.string(),
  locale: z.enum(['en', 'ms', 'zh']).default('en'),
});

export type ActionState = { ok: boolean; error?: string };

export async function requestSpecSheet(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = SpecSheetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, error: await formMessage(formData.get('locale'), 'summary') };

  // Resolve from the committed catalog (the runtime source of truth) rather
  // than Sanity, which throws when unconfigured and previously made this flow
  // fail for every machine.
  const product = getMachine(parsed.data.productSlug);
  if (!product)
    return { ok: false, error: await formMessage(parsed.data.locale, 'generic') };

  // Persist the lead, but don't let a KV outage block the acknowledgement
  // email — store and send are independent concerns.
  let leadId = 'unstored';
  try {
    const lead = await storeLead({ kind: 'spec-sheet', locale: parsed.data.locale, data: parsed.data });
    leadId = lead.id;
  } catch {
    // KV unconfigured / unreachable — non-fatal; continue to email.
  }

  try {
    // KV is a stub, so this notification is the only record of the lead.
    await sendMail({
      to: [LEADS_INBOX],
      replyTo: parsed.data.email,
      subject: `[Spec sheet] ${parsed.data.company} — ${product.name}`,
      react: NewLeadInternal({ kind: 'spec-sheet', data: parsed.data, leadId }),
    });
    await sendMail({
      to: [parsed.data.email],
      subject: `${product.name} — spec sheet`,
      react: SpecSheet({
        name: parsed.data.name,
        productName: product.name,
        // Real spec-sheet PDFs aren't published yet — link to the live
        // product page (gallery + details) rather than a dead placeholder.
        pdfUrl: `${SITE}/${parsed.data.locale}/products/${product.slug}`,
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: await formMessage(parsed.data.locale, 'sendFailed') };
  }

}
