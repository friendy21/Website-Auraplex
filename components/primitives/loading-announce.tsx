'use client';

import { useTranslations } from 'next-intl';

/**
 * Visually-hidden, localized "Loading" announcement for route-level Suspense
 * fallbacks. Isolated into its own client component so the surrounding
 * loading skeleton (loading.tsx) can stay a server component — only this
 * one-line announcement needs the client-side translation context.
 */
export function LoadingAnnounce() {
  const t = useTranslations('common');
  return <span className="sr-only">{t('loading')}</span>;
}
