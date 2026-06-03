export const easing = {
  out:    [0.4, 0, 0.2, 1] as const,
  in:     [0.4, 0, 1, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  linear: [0, 0, 1, 1] as const,
};

export const duration = {
  micro:  0.15,
  ui:     0.3,
  reveal: 0.6,
  hero:   1.2,
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.reveal, ease: easing.out },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: duration.ui, ease: easing.out },
};

export const stagger = (delay = 0.08) => ({
  animate: { transition: { staggerChildren: delay } },
});
