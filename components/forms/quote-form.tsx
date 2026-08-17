'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitQuote, type ActionState } from '@/actions/submit-quote';
import { Button } from '@/components/primitives/button';
import { Field } from '@/components/primitives/field';

const initial: ActionState = { ok: false };

export function QuoteForm({
  productSlug,
  configuration,
  locale,
}: {
  productSlug?: string;
  configuration?: Record<string, unknown>;
  locale: string;
}) {
  const t = useTranslations('forms');
  const [state, action, pending] = useActionState(submitQuote, initial);

  if (state.ok) {
    return (
      <div className="ap-form-success p-12 border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/5">
        <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-signal)] mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)] animate-pulse" />
          {t('received')}
        </div>
        <p className="font-display text-2xl">{t('thanks')}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="locale" value={locale} />
      {productSlug && (
        <input type="hidden" name="productSlug" value={productSlug} />
      )}
      {configuration && (
        <input
          type="hidden"
          name="configuration"
          value={JSON.stringify(configuration)}
        />
      )}

      <Field label={t('name')} name="name" required error={state.fieldErrors?.name?.[0]} />
      <Field label={t('company')} name="company" required error={state.fieldErrors?.company?.[0]} />
      <Field label={t('email')} name="email" type="email" required error={state.fieldErrors?.email?.[0]} />
      <Field label={t('phone')} name="phone" required error={state.fieldErrors?.phone?.[0]} />
      <Field label={t('message')} name="message" as="textarea" rows={4} error={state.fieldErrors?.message?.[0]} />

      {state.error && (
        <p className="ap-form-error text-[color:var(--color-alert)] font-mono text-sm pt-2">
          {state.error}
        </p>
      )}

      <div className="pt-6">
        <Button type="submit" disabled={pending} size="lg">
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-current animate-pulse" />
              {t('sending')}
            </span>
          ) : (
            <>{t('submit')} →</>
          )}
        </Button>
      </div>
    </form>
  );
}
