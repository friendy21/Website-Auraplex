'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy boundary for the YouTube hero background.
 *
 * The IFrame Player API is ~100KB of third-party JS from youtube.com. Loading
 * it eagerly would put a cross-origin script on the critical path of the site's
 * LCP surface — exactly what the motion migration spent its effort removing.
 * `ssr: false` + no loading fallback means:
 *   · it is NOT in the initial bundle and does not execute during first paint,
 *   · the hero's own background (HeroTunnel) paints immediately underneath, and
 *   · the video fades in over it once the player actually reaches PLAYING.
 * If the embed is blocked (bot wall, region lock, embed disabled) the component
 * fades itself to 0 and the tunnel simply carries the hero — no broken frame.
 */
const Impl = dynamic(
  () => import('./youtube-hero-bg').then((m) => m.YoutubeHeroBg),
  { ssr: false },
);

export function YoutubeHeroBgLazy(props: { id: string; title?: string }) {
  return <Impl {...props} />;
}
