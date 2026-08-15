import '@/styles/motion/scroll-progress.css';

/**
 * 2px progress bar at the top of the viewport, tracking total document
 * scroll. Sits above the header and below the page loader.
 *
 * Server Component — no 'use client', no hooks, no JS shipped. The bar is
 * driven entirely by `animation-timeline: scroll(root block)`; see
 * styles/motion/scroll-progress.css for the mechanism and its fallbacks.
 */
export function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}
