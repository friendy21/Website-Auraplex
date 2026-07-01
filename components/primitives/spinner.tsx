import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-current border-t-transparent align-[-0.125em]',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-9 w-9 border-[3px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  /** Accessible label announced to screen readers. */
  label?: string;
}

/**
 * Spinner — an indeterminate loading indicator.
 *
 * A11y: wrapped in a `role="status"` live region with a visually-hidden label
 * so screen readers announce the loading state; the spinning ring itself is
 * decorative. Rotation is *essential* motion (it communicates progress) so it
 * is intentionally NOT disabled under reduced-motion, per WCAG 2.2.2's
 * exception for essential animation.
 */
export function Spinner({ size, className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <span
        className={cn(spinnerVariants({ size }), 'text-[color:var(--color-signal)]', className)}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
