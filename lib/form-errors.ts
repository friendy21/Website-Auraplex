import { getTranslations } from 'next-intl/server';

type ZodFieldErrors = Record<string, string[] | undefined>;

/**
 * Turn zod's English default field messages into localized, human-toned ones.
 *
 * The server actions run with the submitted `locale`, so validation feedback —
 * the moment of highest friction — can speak the user's language instead of
 * leaking raw zod strings ("String must contain at least 10 character(s)") in
 * English on every locale. One clear message per failed field, keyed by field
 * name under `forms.errors` (falls back to a generic message for unmapped
 * fields), plus a localized summary line.
 */
export async function localizeFormErrors(
  localeInput: unknown,
  zodFieldErrors: ZodFieldErrors,
): Promise<{ error: string; fieldErrors: Record<string, string[]> }> {
  const locale =
    localeInput === 'ms' || localeInput === 'zh' ? localeInput : 'en';
  const t = await getTranslations({ locale, namespace: 'forms.errors' });

  const fieldErrors: Record<string, string[]> = {};
  for (const key of Object.keys(zodFieldErrors)) {
    if (!zodFieldErrors[key]?.length) continue;
    fieldErrors[key] = [t.has(key) ? t(key) : t('generic')];
  }

  return { error: t('summary'), fieldErrors };
}

/** Single localized message under `forms.errors` (e.g. the send-failure line). */
export async function formMessage(localeInput: unknown, key: string): Promise<string> {
  const locale =
    localeInput === 'ms' || localeInput === 'zh' ? localeInput : 'en';
  const t = await getTranslations({ locale, namespace: 'forms.errors' });
  return t(key);
}
