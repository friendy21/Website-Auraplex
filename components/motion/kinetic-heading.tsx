'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
};

export function KineticHeading({ children, className, as: Tag = 'h1' }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const words = ref.current.querySelectorAll('.word');

      gsap.set(words, { opacity: 0, y: 40 });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.4,
      });

      gsap.to(ref.current, {
        '--font-weight': 600,
        duration: 1.2,
        delay: 0.4,
        ease: 'power2.out',
      } as any);
    },
    { scope: ref },
  );

  const tokens = children.split(' ');

  return (
    <Tag
      ref={ref as any}
      className={cn('font-display tracking-[-0.02em] leading-[0.95]', className)}
      style={{ fontVariationSettings: "'wght' var(--font-weight, 300)" } as React.CSSProperties}
    >
      {tokens.map((w, i) => (
        <span key={i} className="word inline-block whitespace-pre">
          {w}{i < tokens.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
