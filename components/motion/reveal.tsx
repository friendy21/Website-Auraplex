import { cn } from '@/lib/utils';
import { createElement, type ElementType, type ReactNode } from 'react';

type Props = {
  as?: ElementType;
  children: ReactNode;
  variant?: 'fade' | 'up' | 'scale';
  className?: string;
  delay?: number;
};

const variantClass = {
  fade: 'reveal',
  up: 'reveal-up',
  scale: 'reveal-scale',
} as const;

export function Reveal({
  as = 'div',
  children,
  variant = 'up',
  className,
  delay = 0,
}: Props) {
  // createElement sidesteps the JSX intrinsic-vs-component narrowing trap that
  // happens when `Tag` is typed as the broad ElementType.
  return createElement(
    as,
    {
      className: cn(variantClass[variant], className),
      style: delay ? { animationDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
