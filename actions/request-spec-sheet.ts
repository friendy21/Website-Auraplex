'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { storeLead } from '@/lib/kv';
import { getMachine } from '@/lib/catalog';
import SpecSheet from '@/emails/spec-sheet';

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = 'https://auraplex.my';

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
  if (!parsed.success) return { ok: false, error: 'Invalid input' };

  // Resolve from the committed catalog (the runtime source of truth) rather
  // than Sanity, which throws when unconfigured and previously made this flow
  // fail for every machine.
  const product = getMachine(parsed.data.productSlug);
  if (!product) return { ok: false, error: 'Product not found' };

  // Persist the lead, but don't let a KV outage block the acknowledgement
  // email — store and send are independent concerns.
  try {
    await storeLead({ kind: 'spec-sheet', locale: parsed.data.locale, data: parsed.data });
  } catch {
    // KV unconfigured / unreachable — non-fatal; continue to email.
  }

  try {
    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: `${product.name} — spec sheet`,
      react: SpecSheet({
        name: parsed.data.name,
        productName: product.name,
        // Real spec-sheet PDFs aren't published yet — link to the live
        // product page (gallery + details) rather than a dead placeholder.
        pdfUrl: `${SITE_URL}/${parsed.data.locale}/products/${product.slug}`,
      }),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not send the email. Please try again or WhatsApp us.' };
  }
}
