'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { storeLead } from '@/lib/kv';
import { sanityFetch, queries } from '@/lib/sanity';
import SpecSheet from '@/emails/spec-sheet';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    const product = await sanityFetch<any>({
      query: queries.productBySlug,
      params: { slug: parsed.data.productSlug },
    }).catch(() => null);

    if (!product) return { ok: false, error: 'Product not found' };

    await storeLead({ kind: 'spec-sheet', locale: parsed.data.locale, data: parsed.data });

    await resend.emails.send({
      from: 'Auraplex <hello@auraplex.my>',
      to: [parsed.data.email],
      subject: `${product.name} — spec sheet`,
      react: SpecSheet({
        name: parsed.data.name,
        productName: product.name,
        pdfUrl: product.specSheetPdf?.asset?.url ?? 'https://auraplex.my/specs/placeholder.pdf',
      }),
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown' };
  }
}
