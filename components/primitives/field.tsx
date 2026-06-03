'use client';

import { useId, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

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
}: Props) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const sharedProps = {
    id,
    name,
    required,
    value,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'w-full bg-transparent outline-none font-body text-[color:var(--color-paper)] placeholder-transparent caret-[color:var(--color-signal)]',
  };

  return (
    <div className="relative pt-6 pb-3">
      <motion.label
        htmlFor={id}
        animate={{
          y: floated ? 0 : 28,
          fontSize: floated ? 10 : 16,
          letterSpacing: floated ? '0.15em' : '0',
          color: floated
            ? focused
              ? 'var(--color-signal)'
              : 'var(--color-steel)'
            : 'var(--color-steel-soft)',
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="absolute left-0 top-0 font-mono uppercase pointer-events-none origin-left"
      >
        {label}
        {required && (
          <span className="text-[color:var(--color-signal)] ml-1">*</span>
        )}
      </motion.label>

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

      {/* Static bottom border — always visible at low opacity */}
      <div className="absolute left-0 right-0 bottom-2 h-px bg-[color:var(--color-neutral-700)]" />

      {/* Active bottom border — draws in on focus */}
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        style={{ originX: 0 }}
        className="absolute left-0 right-0 bottom-2 h-px bg-[color:var(--color-signal)]"
      />

      {helper && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)]">
          {helper}
        </p>
      )}
    </div>
  );
}
