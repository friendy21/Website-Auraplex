import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';

/**
 * Shared i18n routing config + locale-aware navigation APIs.
 *
 * Why this exists: the site previously used plain `next/link` with bare hrefs
 * ("/products") and switched locale by hand-swapping the path segment via
 * `next/navigation`. That meant every internal link dropped the active locale,
 * so the middleware re-detected it on navigation (falling back to
 * Accept-Language / the default) — the "language reverts when I change page"
 * bug. These APIs prefix the ACTIVE locale onto every href automatically and
 * switch locale via a real, cookie-persisting navigation.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
