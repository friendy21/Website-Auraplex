'use client';

import { useActionState, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { submitContact, type ActionState } from '@/actions/submit-contact';
import { Button } from '@/components/primitives/button';
import { Field } from '@/components/primitives/field';

const initial: ActionState = { ok: false };

type Intent = 'quote' | 'service' | 'tour' | 'engineering' | 'internship' | 'other';

const INTENTS: Intent[] = [
  'quote',
  'service',
  'tour',
  'engineering',
  'internship',
  'other',
];

export function ContactForm({
  locale,
  department,
  defaultIntent = 'quote',
}: {
  locale: string;
  /** Pre-filled department routing — passed via ?dept= URL param on /contact. */
  department?: string;
  /** Pre-select an intent (e.g. when the form is embedded under a service). */
  defaultIntent?: Intent;
}) {
  const t = useTranslations('forms');
  const [state, action, pending] = useActionState(submitContact, initial);
  const [intent, setIntent] = useState<Intent>(defaultIntent);

  if (state.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="p-12 border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/5"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-signal)] mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)] animate-pulse" />
          {t('received')}
        </div>
        <p className="font-display text-2xl">{t('thanks')}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="locale" value={locale} />
      {department && (
        <input type="hidden" name="department" value={department} />
      )}

      {/* Intent picker — six tappable pills above the form. Replaces a
          native <select> for better mobile touch + visual consistency
          with the rest of the design system. */}
      <fieldset className="pb-4">
        <legend className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
          {t('intent.label')}
        </legend>
        <input type="hidden" name="intent" value={intent} />
        <div className="flex flex-wrap gap-2">
          {INTENTS.map((key) => {
            const active = intent === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setIntent(key)}
                aria-pressed={active}
                className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] border transition-colors ${
                  active
                    ? 'border-[color:var(--color-signal)] text-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10'
                    : 'border-[color:var(--color-neutral-700)] text-[color:var(--color-steel)] hover:border-[color:var(--color-signal)] hover:text-[color:var(--color-signal)]'
                }`}
              >
                {t(`intent.options.${key}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label={t('name')} name="name" required />
        <Field label={t('company')} name="company" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label={t('email')} name="email" type="email" required />
        <Field label={t('phone')} name="phone" />
      </div>
      <Field
        label={t('message')}
        name="message"
        as="textarea"
        rows={6}
        required
      />

      {state.error && (
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: [0, -4, 4, -4, 4, 0] }}
          transition={{ x: { duration: 0.4 } }}
          className="text-[color:var(--color-alert)] font-mono text-sm pt-2"
        >
          {state.error}
        </motion.p>
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
