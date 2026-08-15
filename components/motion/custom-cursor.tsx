'use client';

import { useEffect, useRef, useState } from 'react';
import '@/styles/motion/caliper.css';

type Mode = 'default' | 'link' | 'caliper' | 'button' | 'text';

/**
 * CALIPER — the custom cursor overlay.
 *
 * This used to be ~6 framer springs writing transforms on Motion's RAF tick,
 * in the root layout, on every route. It is now one rAF loop that writes two
 * CSS custom properties; the entire picture lives in styles/motion/caliper.css.
 *
 *   default → 12px cerulean ring        link   → 48px ring + centre dot
 *   caliper → 56px measurement reticle  button → 44px signal disc + plus
 *   text    → 20px I-beam
 *
 * Nothing mounts and no listener is attached unless the device has a fine
 * pointer and the user allows motion, so touch devices pay zero runtime cost.
 */

/** Walks up from the event target to decide which glyph to show. */
function classify(el: Element | null): Mode {
  if (!el) return 'default';
  if (el.closest('[data-cursor="caliper"]')) return 'caliper';
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable) {
    return 'text';
  }
  if (
    tag === 'button' ||
    el.getAttribute('role') === 'button' ||
    el.closest('button, [role="button"]')
  ) {
    return 'button';
  }
  if (el.closest('a, [data-cursor="link"]')) return 'link';
  return 'default';
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Capability gate. Stays live so a plugged-in mouse or an OS motion-setting
  // change is picked up without a reload.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !calm.matches);
    sync();
    fine.addEventListener('change', sync);
    calm.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      calm.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root) return;

    // Hides the native cursor (rule lives in globals.css).
    const doc = document.documentElement;
    doc.classList.add('cursor-custom');

    // Target vs. rendered position. The lerp replaces the old spring: a fast
    // follow that settles hard, which is the "snap" the brand asks for.
    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;
    let frame = 0;
    let classifiedAt = 0;

    const draw = () => {
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      root.style.setProperty('--cursor-x', `${cx.toFixed(2)}px`);
      root.style.setProperty('--cursor-y', `${cy.toFixed(2)}px`);
      // Park the loop once we are inside a subpixel of the target — an idle
      // cursor must not hold a rAF open.
      frame = Math.abs(tx - cx) + Math.abs(ty - cy) < 0.1 ? 0 : requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // hybrid laptops: ignore taps
      tx = e.clientX;
      ty = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
      // classify() walks the tree with .closest() up to four times — far too
      // expensive at the ~120Hz a trackpad emits. ~30Hz is imperceptible.
      if (e.timeStamp - classifiedAt > 33) {
        classifiedAt = e.timeStamp;
        root.dataset.mode = classify(e.target as Element);
      }
    };
    const onPress = (e: PointerEvent) => {
      root.dataset.pressed = String(e.type === 'pointerdown');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onPress, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onPress);
      if (frame) cancelAnimationFrame(frame);
      doc.classList.remove('cursor-custom');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="caliper" aria-hidden data-mode="default" data-pressed="false">
      <span className="cal-dot" />
      <span className="cal-link" />
      <span className="cal-cross" />
      <span className="cal-btn" />
      <span className="cal-text" />
    </div>
  );
}
