import { Skeleton, SkeletonText } from '@/components/primitives/skeleton';

/**
 * Route-level loading UI (Next.js App Router Suspense fallback). A layout-
 * echoing skeleton — eyebrow, headline, lede, then a card grid — reduces
 * perceived wait far better than a bare spinner. The container is marked
 * `aria-busy` with a visually-hidden "Loading" announcement; the placeholder
 * blocks themselves are decorative (`aria-hidden`, via <Skeleton>).
 */
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>

      <Skeleton rounded="sm" className="mb-6 h-3 w-40" />
      <Skeleton rounded="lg" className="mb-4 h-14 w-3/4 max-w-3xl" />
      <Skeleton rounded="lg" className="mb-10 h-14 w-1/2 max-w-xl" />
      <SkeletonText lines={2} className="mb-16 max-w-xl" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[18px] border border-[color:var(--color-neutral-700)]"
          >
            <Skeleton rounded="none" className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-5">
              <Skeleton rounded="sm" className="h-5 w-3/4" />
              <SkeletonText lines={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
