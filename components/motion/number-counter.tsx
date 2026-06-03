'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';

type Props = {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

export function NumberCounter({ value, format = (n) => Math.round(n).toLocaleString(), duration = 1.4, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`split-flap ${className ?? ''}`}>
      {format(display)}
    </span>
  );
}

export function SplitFlapNumber({ value, className }: { value: number; className?: string }) {
  const prevRef = useRef(value);
  const [showFlip, setShowFlip] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setShowFlip(true);
      const t = setTimeout(() => setShowFlip(false), 600);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={showFlip ? { rotateX: -90, opacity: 0 } : false}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`split-flap inline-block ${className ?? ''}`}
      style={{ transformOrigin: 'center bottom', perspective: 400 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
