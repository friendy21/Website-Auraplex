'use client';

import NextLink from 'next/link';
import { useRouter as useNextRouter } from 'next/navigation';
import { useRef, type ComponentProps, type FocusEvent, type MouseEvent, type TouchEvent } from 'react';
import { Link as IntlLink, useRouter as useIntlRouter } from './navigation-base';

/**
 * Intent-prefetching links.
 *
 * Next's default is to prefetch every <Link> the moment it scrolls into view.
 * In Next 16 that is several RSC requests per link (one per route segment),
 * each decoded on the main thread — scrolling /products once fired 171 of them
 * and the stream parsing landed as long frames mid-scroll. These links skip
 * viewport prefetch and prefetch on intent instead (hover, keyboard focus,
 * touchstart), which still lands well before the click on prerendered pages.
 *
 * Pass `prefetch` explicitly to opt a link back into Next's own behaviour.
 */

type Intent = {
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: (e: FocusEvent<HTMLAnchorElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLAnchorElement>) => void;
};

function useIntentHandlers(props: Intent, prefetch: () => void): Required<Intent> {
  const done = useRef(false);
  const fire = () => {
    if (done.current) return;
    done.current = true;
    prefetch();
  };
  return {
    onMouseEnter: (e) => {
      props.onMouseEnter?.(e);
      // Links sliding under a still cursor mid-scroll aren't intent; skip
      // them while smooth-scroll reports fast movement (smooth-scroll.tsx).
      if (!document.documentElement.hasAttribute('data-scrolling-fast')) fire();
    },
    onFocus: (e) => {
      props.onFocus?.(e);
      fire();
    },
    onTouchStart: (e) => {
      props.onTouchStart?.(e);
      fire();
    },
  };
}

/** Locale-aware link (next-intl) — the default `Link` from `@/lib/navigation`. */
export function Link(props: ComponentProps<typeof IntlLink>) {
  const router = useIntlRouter();
  const handlers = useIntentHandlers(props, () =>
    router.prefetch(props.href as Parameters<typeof router.prefetch>[0], props.locale ? { locale: props.locale } : undefined),
  );
  if (props.prefetch !== undefined) return <IntlLink {...props} />;
  return <IntlLink {...props} prefetch={false} {...handlers} />;
}

/** Plain next/link for hrefs that already carry the locale prefix. */
export function PlainLink(props: ComponentProps<typeof NextLink>) {
  const router = useNextRouter();
  const handlers = useIntentHandlers(props, () => {
    const path = typeof props.href === 'string' ? props.href : props.href.pathname;
    // In-page anchors (`#quote`) have nothing to fetch.
    if (path && !path.startsWith('#')) router.prefetch(path);
  });
  if (props.prefetch !== undefined) return <NextLink {...props} />;
  return <NextLink {...props} prefetch={false} {...handlers} />;
}
