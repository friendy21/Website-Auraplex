'use client';

import { useActionState, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  submitInternship,
  type ActionState,
} from '@/actions/submit-internship';
import { Button } from '@/components/primitives/button';
import { Field } from '@/components/primitives/field';

const initial: ActionState = { ok: false };

type FieldKey =
  | 'mechanical'
  | 'electrical'
  | 'controls'
  | 'software'
  | 'industrial-design'
  | 'service'
  | 'other';

const FIELDS: FieldKey[] = [
  'mechanical',
  'electrical',
  'controls',
  'software',
  'industrial-design',
  'service',
  'other',
];

/**
 * Internship application form — replaces the previous mailto: link on
 * the careers page. Captures everything the recruiting team needs to
 * triage without a back-and-forth: field of study, university, current
 * semester, target start date, duration, optional CV + portfolio URLs,
 * and a free-text motivation paragraph.
 *
 * CV upload is intentionally a URL field (Drive / Dropbox / GitHub),
 * not a file input — file uploads require multipart handling on the
 * server action + binary storage. Asking for a hosted link skips that
 * cost and is industry-standard for software/eng applications.
 */
export function InternshipForm({ locale }: { locale: string }) {
  const t = useTranslations('forms.internship');
  const tCommon = useTranslations('forms');
  const [state, action, pending] = useActionState(submitInternship, initial);
  const [field, setField] = useState<FieldKey>('mechanical');

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
          {tCommon('received')}
        </div>
        <p className="font-display text-2xl">{t('thanks')}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="locale" value={locale} />

      {/* Field picker — same pill style as ContactForm's intent picker */}
      <fieldset className="pb-4">
        <legend className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
          {t('fieldLabel')}
        </legend>
        <input type="hidden" name="field" value={field} />
        <div className="flex flex-wrap gap-2">
          {FIELDS.map((key) => {
            const active = field === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setField(key)}
                aria-pressed={active}
                className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] border transition-colors ${
                  active
                    ? 'border-[color:var(--color-signal)] text-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10'
                    : 'border-[color:var(--color-neutral-700)] text-[color:var(--color-steel)] hover:border-[color:var(--color-signal)] hover:text-[color:var(--color-signal)]'
                }`}
              >
                {t(`fields.${key}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label={tCommon('name')} name="name" required />
        <Field label={tCommon('email')} name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label={tCommon('phone')} name="phone" />
        <Field label={t('university')} name="university" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field
          label={t('semester')}
          name="semester"
          helper={t('semesterHelper')}
          required
        />
        <Field
          label={t('startDate')}
          name="startDate"
          helper={t('startDateHelper')}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field
          label={t('durationMonths')}
          name="durationMonths"
          type="number"
        />
        <Field label={t('cvUrl')} name="cvUrl" type="url" helper={t('cvUrlHelper')} />
      </div>
      <Field
        label={t('portfolioUrl')}
        name="portfolioUrl"
        type="url"
        helper={t('portfolioUrlHelper')}
      />
      <Field
        label={t('motivation')}
        name="motivation"
        as="textarea"
        rows={6}
        helper={t('motivationHelper')}
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
              {tCommon('sending')}
            </span>
          ) : (
            <>{t('submit')} →</>
          )}
        </Button>
      </div>
    </form>
  );
}
