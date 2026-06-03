'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

/**
 * Accordion item with a signal-cerulean left border that draws top→bottom
 * when the item opens. Wraps Radix's data-state attribute.
 */
export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group/acc relative border-b border-[color:var(--color-neutral-700)] data-[state=open]:bg-[color:var(--color-signal)]/[0.04] transition-colors duration-300',
      className,
    )}
    {...props}
  >
    {/* Left border that "draws" downward on open */}
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-[color:var(--color-signal)] origin-top scale-y-0 group-data-[state=open]/acc:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
    />
    {props.children}
  </AccordionPrimitive.Item>
));
AccordionItem.displayName = 'AccordionItem';

/**
 * Trigger renders an SVG icon that morphs ↓ (chevron) → × (close) via
 * data-state-driven stroke transforms — no library, single SVG element.
 * Question text gains variable font weight on open (wght 400 → 600).
 */
export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group/trg flex flex-1 items-center justify-between gap-4 py-6 pl-6 pr-2 text-left font-display text-xl md:text-2xl transition-all duration-300 hover:text-[color:var(--color-signal)] data-[state=open]:[font-variation-settings:"wght"_600] data-[state=open]:text-[color:var(--color-paper)]',
        className,
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <span aria-hidden className="h-5 w-5 relative shrink-0">
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="absolute inset-0 transition-colors duration-300 group-data-[state=open]/trg:text-[color:var(--color-signal)]"
        >
          {/* Horizontal stroke — always visible */}
          <line
            x1="3"
            y1="10"
            x2="17"
            y2="10"
            className="transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
          {/* Vertical stroke — rotates 90° + scales to 0 on open (→ becomes an X-equivalent flat line) */}
          <line
            x1="10"
            y1="3"
            x2="10"
            y2="17"
            className="origin-center transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-data-[state=open]/trg:scale-y-0 group-data-[state=open]/trg:rotate-90"
          />
        </svg>
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * Content uses Radix's CSS variable `--radix-accordion-content-height` for
 * height transitions, layered with a clip-path mask reveal.
 */
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  >
    <div className="pb-6 pl-6 pr-8 text-[color:var(--color-steel-soft)] prose-editorial">
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
