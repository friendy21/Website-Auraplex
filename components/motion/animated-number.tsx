'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

type Props = {
  /** Target numeric value to count to. */
  value: number;
  /** Optional prefix (e.g. "RM "). */
  prefix?: string;
  /** Optional suffix (e.g. "%", "+", "mo"). */
  suffix?: string;
  /** Locale for number formatting. Defaults to en-MY. */
  locale?: string;
  /** Animation duration in ms. */
  duration?: number;
  /** className applied to the wrapping span. */
  className?: string;
};

/**
 * Number that counts up to `value` when it enters the viewport.
 *
 * ── WHAT CHANGED ──────────────────────────────────────────────────────────
 * This used to run a framer `useSpring` and call `setDisplay()` on every
 * spring frame — roughly 90 React renders per number. The count is now a
 * registered CSS custom property (`--anum-n`) interpolated by the style
 * engine and painted with `counter()`; see styles/motion/numbers.css. No JS
 * runs per frame and React renders exactly once.
 *
 * ── THE SERVER HTML IS NOW CORRECT ────────────────────────────────────────
 * The old component rendered a literal "0" on the server and only reached the
 * real number after hydration, so crawlers, no-JS clients and anyone whose JS
 * failed saw a placeholder. The `Intl`-formatted value is now a real text node
 * from the first byte (`.anum-static`); the counting glyphs are a decorative,
 * `aria-hidden` overlay that only exists while the animation is running.
 *
 * ── WHY IT ONLY ARMS WHILE OFFSCREEN ──────────────────────────────────────
 * Those two facts pull against each other: if the correct value is painted
 * immediately, resetting it to 0 to count up is a visible backwards jump. So
 * the count is armed at mount ONLY if the element is entirely outside the
 * viewport — the swap to "0" then happens where nobody can see it, and the
 * IntersectionObserver starts the run on the same `-10%` margin framer's
 * `useInView` used. An instance that is already on screen at hydration keeps
 * its correct value and simply does not animate, which also means this
 * component can never put a zero-opacity/clipped element on the LCP path.
 * Every current call site (the /2026 stat grid, the value-prop lead time)
 * sits well below the fold, so the count-up is unchanged in practice.
 *
 * Locale note: `counter()` renders bare digits, so a value large enough to
 * carry a group separator ("1,240") counts up without it. The resting value —
 * before the animation, and again the moment it ends — is always the full
 * `Intl` formatting, and every value in the codebase today is < 1000.
 */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  locale = 'en-MY',
  duration = 1500,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  // Integers only, as before — the count preserves the "30 / 142 / 340" feel.
  const target = Math.round(value);
  const formatted = formatNumber(value, locale);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // `CSS.registerProperty` exists exactly where `@property` does; without it
    // `--anum-n` cannot interpolate and the counter would jump discretely.
    if (
      typeof CSS === 'undefined' ||
      typeof CSS.registerProperty !== 'function' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Arm only where the reset-to-zero cannot be seen. See the block comment.
    const rect = el.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    if (onScreen) return;

    el.classList.add('anum--live');

    let timer = 0;
    // animationend bubbles up from .anum-tick; the name guard keeps us from
    // reacting to any other animation an ancestor utility might introduce.
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === 'anum-count') restore();
    };
    const restore = () => {
      window.clearTimeout(timer);
      el.classList.remove('anum--live', 'anum--run');
      el.removeEventListener('animationend', onEnd);
    };
    el.addEventListener('animationend', onEnd);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.classList.add('anum--run');
        // Safety net: if animationend is ever missed (tab backgrounded, the
        // animation cancelled), the real value still comes back.
        timer = window.setTimeout(restore, duration + 400);
      },
      // Was framer's useInView({ once: true, margin: '0px 0px -10% 0px' }).
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      restore();
    };
  }, [duration]);

  return (
    <span className={className}>
      {prefix}
      <span
        ref={ref}
        className="anum"
        style={
          {
            '--anum-to': String(target),
            '--anum-dur': `${duration}ms`,
          } as CSSProperties
        }
      >
        {/* The real value: server-rendered, indexable, screen-reader visible. */}
        <span className="anum-static">{formatted}</span>
        {/* Decorative counter overlay — empty until CSS gives it content. */}
        <span className="anum-tick" aria-hidden="true" />
      </span>
      {suffix}
    </span>
  );
}

function formatNumber(n: number, locale: string): string {
  // Integers only for the count-up; preserves the "30 / 142 / 340" feel.
  return new Intl.NumberFormat(locale).format(Math.round(n));
}
