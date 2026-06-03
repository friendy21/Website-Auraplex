// next-intl v4: callback receives { requestLocale } (awaitable), not { locale }.
// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export const locales = ['en', 'ms', 'zh'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Kuala_Lumpur',
  };
});
