import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Optional glyph/icon node, rendered in a bordered token chip. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Primary action(s) — e.g. a <Button> or reset link. */
  action?: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  /**
   * `status` (default) for benign zero-result / empty states so SR users hear
   * the message politely; `alert` for error states so it is announced
   * assertively.
   */
  tone?: 'status' | 'alert';
}

/**
 * EmptyState — the canonical "nothing to show" surface: zero search results,
 * an empty list, a cleared filter, or (with `tone="alert"`) a load error.
 * Centered, responsive, token-driven, and announced to assistive tech via the
 * appropriate ARIA live role.
 *
 * Deliberately presentational and dependency-free (no Button import) so it is
 * safe in both Server and Client Components; callers pass their own `action`.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  tone = 'status',
}: EmptyStateProps) {
  return (
    <div
      role={tone === 'alert' ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center justify-center text-center px-6',
        size === 'sm' ? 'py-12' : 'py-20 lg:py-28',
        className,
      )}
    >
      {icon != null && (
        <div
          aria-hidden="true"
          className={cn(
            'mb-5 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/60 text-[color:var(--color-steel)]',
            size === 'sm' ? 'h-11 w-11 text-lg' : 'h-16 w-16 text-2xl',
          )}
        >
          {icon}
        </div>
      )}
      <h3
        className={cn(
          'font-display tracking-[-0.01em] text-[color:var(--color-paper)]',
          size === 'sm' ? 'text-lg' : 'text-2xl',
        )}
      >
        {title}
      </h3>
      {description != null && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--color-steel-soft)]">
          {description}
        </p>
      )}
      {action != null && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
