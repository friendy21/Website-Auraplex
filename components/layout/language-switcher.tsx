'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LABEL: Record<Locale, string> = { en: 'EN', ms: 'BM', zh: '中' };
// Full language names for assistive tech — the visible 2-char labels are
// too terse for screen readers to announce meaningfully.
const FULL_NAME: Record<Locale, string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  zh: '中文',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  }

  return (
    <div
      className="flex gap-1 font-mono text-xs"
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          lang={l}
          aria-label={FULL_NAME[l]}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'px-2 py-1 uppercase tracking-wider transition-colors',
            l === locale ? 'text-[color:var(--color-signal)]' : 'text-[color:var(--color-steel)] hover:text-[color:var(--color-paper)]',
          )}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
