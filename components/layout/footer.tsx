import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-[color:var(--color-steel)]/20 mt-32 pb-8">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-[color:var(--color-signal)]" />
            <span className="font-mono uppercase tracking-[0.2em]">Auraplex</span>
          </div>
          <p className="mt-6 max-w-md text-[color:var(--color-steel-soft)] prose-editorial">
            {t('meta.tagline')}
          </p>
          <div className="mt-8 font-mono text-xs uppercase tracking-wider text-[color:var(--color-steel)] space-y-1">
            <div>Auraplex SDN BHD · Shah Alam · Selangor · Malaysia</div>
            <div>+60-3-0000-0000 · hello@auraplex.my</div>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mb-4">{t('nav.products')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?category=labelling" className="hover:text-[color:var(--color-signal)]">{t('home.categories.labelling')}</Link></li>
            <li><Link href="/products?category=packaging" className="hover:text-[color:var(--color-signal)]">{t('home.categories.packaging')}</Link></li>
            <li><Link href="/products?category=automation" className="hover:text-[color:var(--color-signal)]">{t('home.categories.automation')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-[color:var(--color-signal)]">{t('nav.about')}</Link></li>
            <li><Link href="/case-studies" className="hover:text-[color:var(--color-signal)]">{t('nav.caseStudies')}</Link></li>
            <li><Link href="/financing" className="hover:text-[color:var(--color-signal)]">{t('nav.financing')}</Link></li>
            <li><Link href="/contact" className="hover:text-[color:var(--color-signal)]">{t('nav.contact')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 flex justify-between font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">
        <span>{t('footer.rights')}</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[color:var(--color-signal)]" />
          {t('footer.made')}
        </span>
      </div>
    </footer>
  );
}
