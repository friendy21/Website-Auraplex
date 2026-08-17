'use client';

import { useId, useState, type ReactNode } from 'react';

type Props = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: 'input' | 'textarea';
  rows?: number;
  defaultValue?: string;
  /** Optional helper text under the field. */
  helper?: ReactNode;
  /** Server-side validation error for this field (from zod flatten). */
  error?: string;
};

/**
 * Animated form field with floating label and signal-cerulean focus underline.
 *
 * - Label sits inside the field when empty, rises to a mono micro-label when
 *   focused or filled.
 * - Bottom border draws in from left to right on focus.
 * - Subtle scale on the wrapping label for tactile feedback.
 *
 * Used by quote / contact / spec-sheet forms.
 *
 * MOTION: this component owns the state, `styles/motion/forms.css` owns the
 * movement. `floated` and `focused` are published as data attributes on the
 * wrapper and CSS transitions transform/colour off them — no framer-motion.
 * The float is a `scale()` about the label's top-left corner rather than an
 * animated `fontSize`/`top`, so focusing a field no longer triggers layout.
 */
export function Field({
  label,
  name,
  type = 'text',
  required,
  as = 'input',
  rows = 4,
  defaultValue = '',
  helper,
  error,
}: Props) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const errorId = error ? `${id}-error` : undefined;
  const helperId = helper ? `${id}-helper` : undefined;
  const describedBy = errorId ?? helperId;

  const sharedProps = {
    id,
    name,
    required,
    value,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'w-full bg-transparent outline-none font-body text-[color:var(--color-paper)] placeholder-transparent caret-[color:var(--color-signal)]',
  };

  return (
    <div
      className="ap-field relative pt-6 pb-3"
      data-floated={floated ? 'true' : 'false'}
      data-focused={focused ? 'true' : 'false'}
    >
      <label
        htmlFor={id}
        className="ap-field-label absolute left-0 top-0 font-mono uppercase pointer-events-none"
      >
        {label}
        {required && (
          <span className="text-[color:var(--color-signal)] ml-1">*</span>
        )}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...sharedProps}
          rows={rows}
          placeholder=" "
          className={`${sharedProps.className} resize-none py-1`}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          placeholder=" "
          className={`${sharedProps.className} py-1`}
        />
      )}

      {/* Static bottom border — always visible at low opacity. Turns alert
          when the field has a validation error. */}
      <div
        className={`absolute left-0 right-0 bottom-2 h-px ${
          error
            ? 'bg-[color:var(--color-alert)]'
            : 'bg-[color:var(--color-neutral-700)]'
        }`}
      />

      {/* Active bottom border — draws in on focus (scaleX, see forms.css) */}
      <div
        className={`ap-field-underline absolute left-0 right-0 bottom-2 h-px ${
          error ? 'bg-[color:var(--color-alert)]' : 'bg-[color:var(--color-signal)]'
        }`}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="ap-field-error mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-alert)]"
        >
          {error}
        </p>
      ) : (
        helper && (
          <p
            id={helperId}
            className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)]"
          >
            {helper}
          </p>
        )
      )}
    </div>
  );
}
