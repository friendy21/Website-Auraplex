import type { ReactElement } from 'react';
import { Resend } from 'resend';

/** Every form submission (contact, quote, internship, spec-sheet) lands here. */
export const LEADS_INBOX = 'sales.auraplex@gmail.com';

/**
 * Sender address. The domain must be verified in the Resend dashboard or
 * every send is rejected — update this when the sending domain moves to
 * auraplex.info.
 */
export const MAIL_FROM = 'Auraplex <hello@auraplex.com.my>';

// Constructed lazily: `new Resend()` throws when RESEND_API_KEY is unset, and
// doing that at module scope would crash the whole server action instead of
// letting it return a localized "send failed" message.
let client: Resend | null = null;

/**
 * Send one email and throw on failure. The Resend SDK reports API errors
 * (unverified domain, bad key, rate limit) in its return value rather than
 * throwing, so without this check a rejected send looks like a success and
 * the lead is silently lost.
 */
export async function sendMail(message: {
  to: string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}): Promise<void> {
  client ??= new Resend(process.env.RESEND_API_KEY);
  const { error } = await client.emails.send({ from: MAIL_FROM, ...message });
  if (error) {
    console.error(`[mail] send failed (${error.name}): ${error.message}`);
    throw new Error(error.message);
  }
}
