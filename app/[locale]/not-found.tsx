import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/primitives/button';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">— 404</div>
      <h1 className="font-display text-[clamp(3rem,10vw,8rem)] tracking-[-0.03em] leading-[0.92]">{t('heading')}</h1>
      <p className="mt-6 max-w-md prose-editorial text-[color:var(--color-steel-soft)]">
        {t('body')}
      </p>
      <Button asChild className="mt-10"><Link href="/">{t('cta')} →</Link></Button>
    </section>
  );
}
