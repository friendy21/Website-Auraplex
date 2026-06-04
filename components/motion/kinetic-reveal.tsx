'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

/**
 * KineticReveal — scroll-triggered word-by-word headline animation.
 *
 * Splits children text into words. Each word animates with:
 *   - clip-path wipe: inset(0 100% 0 0) → inset(0 0% 0 0)
 *   - variable font weight sweep: 200 → 700
 *   - 40ms stagger per word
 *
 * Triggers once when the element enters the viewport (10% margin).
 * Respects prefers-reduced-motion automatically via Motion.
 */
export function KineticReveal({
  children,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  // Accept either a string or React children that render to a string. If a
  // caller passes mixed JSX we render the children unanimated rather than
  // silently dropping them.
  const text = typeof children === 'string' ? children : null;
  const words = text ? text.split(/(\s+)/) : [];

  if (!text) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        return (
          <motion.span
            key={i}
            initial={{
              opacity: 0,
              clipPath: 'inset(0 100% 0 0)',
              fontVariationSettings: '"wght" 200',
            }}
            animate={
              inView
                ? {
                    opacity: 1,
                    clipPath: 'inset(0 0% 0 0)',
                    fontVariationSettings: '"wght" 700',
                  }
                : {
                    opacity: 0,
                    clipPath: 'inset(0 100% 0 0)',
                    fontVariationSettings: '"wght" 200',
                  }
            }
            transition={{
              duration: 0.8,
              delay: delay + i * 0.04,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        );
      })}
    </Tag>
  );
}
