'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/primitives/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');

  useEffect(() => {
    if (typeof window !== 'undefined') console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-alert)] mb-6">
        — {t('eyebrow')}
      </div>
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-[-0.02em] leading-[1]">
        {t('heading')}
      </h1>
      <p className="mt-6 max-w-md prose-editorial text-[color:var(--color-steel-soft)]">
        {t('body')}
      </p>
      {error.digest && (
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)]">
          {t('refLabel')} {error.digest}
        </div>
      )}
      <div className="mt-10 flex gap-3">
        <Button onClick={reset}>{t('tryAgain')} →</Button>
        <Button asChild variant="ghost"><Link href="/">{t('home')} →</Link></Button>
      </div>
    </section>
  );
}
