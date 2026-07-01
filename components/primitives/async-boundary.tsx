'use client';

import type { ReactNode } from 'react';
import { Spinner } from './spinner';
import { EmptyState } from './empty-state';

export type AsyncStatus = 'loading' | 'error' | 'empty' | 'ready';

export interface AsyncBoundaryLabels {
  loading?: string;
  empty?: string;
  emptyDescription?: ReactNode;
  error?: string;
  errorDescription?: ReactNode;
  retry?: string;
}

export interface AsyncBoundaryProps<T> {
  /** The resolved data. `undefined`/`null` is treated as empty. */
  data?: T;
  isLoading?: boolean;
  error?: unknown;
  /** Force a specific state, bypassing derivation (rarely needed). */
  status?: AsyncStatus;
  /** Custom empties: e.g. an object that is "empty" when a field is blank. */
  isEmpty?: (data: T) => boolean;

  /** Slot overrides — fall back to sensible defaults when omitted. */
  loading?: ReactNode;
  errorFallback?: ReactNode;
  emptyFallback?: ReactNode;

  onRetry?: () => void;
  labels?: AsyncBoundaryLabels;
  className?: string;

  /** Render-prop for the happy path; `data` is guaranteed non-empty here. */
  children: (data: T) => ReactNode;
}

function computeEmpty<T>(data: T | undefined | null, isEmpty?: (d: T) => boolean): boolean {
  if (data == null) return true;
  if (isEmpty) return isEmpty(data);
  if (Array.isArray(data)) return data.length === 0;
  return false;
}

/**
 * AsyncBoundary — one declarative component for the entire async-UI state
 * matrix (loading → error → empty → ready). Instead of every list/query
 * re-writing the same `if (isLoading) … else if (error) … else if (!data.length)`
 * ladder (and inevitably forgetting one branch), pass the query state and a
 * render-prop; the boundary picks the right surface and composes Spinner /
 * EmptyState with accessible defaults you can fully override.
 *
 * State precedence: explicit `status` > `isLoading` > `error` > empty > ready.
 *
 * @example
 * <AsyncBoundary
 *   isLoading={q.isLoading}
 *   error={q.error}
 *   data={q.data}
 *   onRetry={q.refetch}
 *   labels={{ empty: 'No machines match', error: 'Could not load machines' }}
 * >
 *   {(machines) => <Grid machines={machines} />}
 * </AsyncBoundary>
 */
export function AsyncBoundary<T>({
  data,
  isLoading,
  error,
  status,
  isEmpty,
  loading,
  errorFallback,
  emptyFallback,
  onRetry,
  labels,
  className,
  children,
}: AsyncBoundaryProps<T>) {
  const resolved: AsyncStatus =
    status ??
    (isLoading
      ? 'loading'
      : error != null
        ? 'error'
        : computeEmpty(data, isEmpty)
          ? 'empty'
          : 'ready');

  if (resolved === 'loading') {
    return (
      loading ?? (
        <div
          className={className ?? 'flex items-center justify-center py-20'}
          aria-busy="true"
        >
          <Spinner size="lg" label={labels?.loading ?? 'Loading'} />
        </div>
      )
    );
  }

  if (resolved === 'error') {
    return (
      errorFallback ?? (
        <EmptyState
          tone="alert"
          icon="!"
          title={labels?.error ?? 'Something went wrong'}
          description={labels?.errorDescription ?? 'We could not load this right now.'}
          className={className}
          action={
            onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border border-[color:var(--color-neutral-700)] px-5 py-2.5 text-[color:var(--color-paper)] hover:border-[color:var(--color-signal)] hover:text-[color:var(--color-signal)] transition"
              >
                {labels?.retry ?? 'Try again'} ↻
              </button>
            ) : undefined
          }
        />
      )
    );
  }

  if (resolved === 'empty') {
    return (
      emptyFallback ?? (
        <EmptyState
          icon="◍"
          title={labels?.empty ?? 'Nothing here yet'}
          description={labels?.emptyDescription}
          className={className}
        />
      )
    );
  }

  // ready — data is non-empty
  return <>{children(data as T)}</>;
}
