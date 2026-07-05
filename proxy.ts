import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  // Exclude `studio` (Sanity Studio lives at /studio, outside the [locale]
  // tree) so next-intl doesn't redirect it to /en/studio → 404.
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};
