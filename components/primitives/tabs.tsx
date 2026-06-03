'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<HTMLDivElement, TabsPrimitive.TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex gap-1 border-b border-[color:var(--color-steel)]/30', className)}
      {...props}
    />
  ),
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsPrimitive.TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'px-4 py-3 font-mono text-sm uppercase tracking-wider text-[color:var(--color-steel-soft)] border-b-2 border-transparent transition-colors data-[state=active]:border-[color:var(--color-signal)] data-[state=active]:text-[color:var(--color-paper)]',
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<HTMLDivElement, TabsPrimitive.TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={cn('pt-8', className)} {...props} />
  ),
);
TabsContent.displayName = 'TabsContent';
