import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const ROUNDING = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
} as const;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: keyof typeof ROUNDING;
}

/**
 * Skeleton — a single shimmer placeholder block. Size it with utility classes
 * (`h-*`, `w-*`, `aspect-*`). The shimmer (`.ax-skeleton`, see globals.css)
 * animates a compositor-only transform and is disabled under
 * prefers-reduced-motion, degrading to a static muted block.
 *
 * A11y: purely decorative — `aria-hidden`. Mark the CONTAINER that is loading
 * with `aria-busy="true"` (AsyncBoundary does this for you) so assistive tech
 * knows content is pending rather than announcing empty boxes.
 */
export function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('ax-skeleton bg-[color:var(--color-neutral-800)]', ROUNDING[rounded], className)}
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

/**
 * SkeletonText — a stack of line placeholders; the last line is shortened so
 * it reads like a paragraph rather than a block.
 */
export function SkeletonText({ lines = 3, className, lineClassName }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          rounded="sm"
          className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full', lineClassName)}
        />
      ))}
    </div>
  );
}
