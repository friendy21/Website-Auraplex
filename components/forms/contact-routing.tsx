'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { ContactForm } from '@/components/forms/contact-form';
import { Reveal } from '@/components/motion/reveal';

const DEPARTMENT_KEYS = ['sales', 'service', 'tour', 'engineering'] as const;
type DepartmentKey = (typeof DEPARTMENT_KEYS)[number];

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function readDepartment(): DepartmentKey | undefined {
  const dept = new URLSearchParams(window.location.search).get('dept');
  // Normalize ?dept= input against the allowlist — never trust the client.
  return dept && (DEPARTMENT_KEYS as readonly string[]).includes(dept)
    ? (dept as DepartmentKey)
    : undefined;
}

/**
 * Contact form plus the optional "routing to <team>" banner driven by ?dept=.
 *
 * The department is read from the URL on the client, after hydration, rather
 * than from the page's `searchParams`. Awaiting `searchParams` on the server
 * turned /contact into a PPR route with a request-time hole, and Next 16.2's
 * resume of that hole reused Suspense segment ids already emitted by the
 * static shell (two `<div hidden id="S:2">`). The streamed form was then
 * swapped into the wrong placeholder and hydration failed with React #418.
 * Keeping the page request-independent lets it prerender fully.
 */
export function ContactRouting({ locale }: { locale: string }) {
  const t = useTranslations('pages.contact');
  // Server snapshot is "no department", so hydration matches the static HTML;
  // the client snapshot then re-renders with the real ?dept= value.
  const department = useSyncExternalStore(subscribe, readDepartment, () => undefined);

  return (
    <>
      {department && (
        <Reveal variant="fade">
          <div className="mb-6 border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/5 px-5 py-4 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
              {t('routing', { team: t(`departments.${department}`) })}
            </span>
          </div>
        </Reveal>
      )}
      <ContactForm locale={locale} department={department} />
    </>
  );
}
