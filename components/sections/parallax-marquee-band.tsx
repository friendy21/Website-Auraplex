import { Fragment } from 'react';

type Props = {
  image: string;
  text: string;
};

/**
 * How many times the phrase is repeated inside ONE copy of the marquee track.
 * The track renders the list twice and loops on translateX(-50%), so a single
 * copy only has to be at least as wide as the widest viewport for the seam to
 * stay off screen — 8 repeats of a display-size phrase clears 4K comfortably.
 */
const REPS = 8;

/**
 * ParallaxMarqueeBand — a full-bleed image that parallaxes on scroll with a
 * large marquee running across it. Faithful to the *visible* signature of
 * joebentaylor/emBEyNa (parallax hero + text marquee), minus its infinite-
 * scroll Lenis hijack.
 *
 * All motion is native CSS — see styles/motion/parallax-marquee.css, which the
 * global stylesheet imports. This component ships zero client JS: it holds no
 * state, no refs and no handlers, so it renders entirely on the server.
 *
 * NOTE the marquee was an arched SVG <textPath> whose `startOffset` was rewritten
 * every frame by gsap. The arch could not survive the move off JS; the CSS file
 * documents the trade in full.
 *
 * Reduced-motion: parallax + marquee freeze (handled in CSS, so it re-evaluates
 * live rather than only at hydration).
 */
export function ParallaxMarqueeBand({ image, text }: Props) {
  const phrase = Array.from({ length: REPS }, (_, i) => (
    <Fragment key={i}>
      <span>{text}</span>
      <span className="pmq__star">✦</span>
    </Fragment>
  ));

  return (
    <section
      className="pmq relative h-[60vh] min-h-[420px] overflow-hidden bg-[color:var(--color-ink)]"
      aria-label={text}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="pmq__img absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover [filter:brightness(0.45)_grayscale(0.2)]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-[color:var(--color-ink)]/70" />

      {/* Scrolling marquee. The section's aria-label already announces `text`,
          so the strip itself stays out of the accessibility tree — otherwise it
          would read the phrase sixteen times over. */}
      <div
        className="pmq__marquee absolute inset-0 flex items-center"
        aria-hidden="true"
      >
        <div className="pmq__track font-display">
          <div className="pmq__copy">{phrase}</div>
          <div className="pmq__copy">{phrase}</div>
        </div>
      </div>
    </section>
  );
}
