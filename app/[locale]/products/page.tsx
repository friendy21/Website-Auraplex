import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { ProductsGrid } from '@/components/sections/products-grid';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { MACHINES, categoryCounts, type Category } from '@/lib/catalog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Machines — Auraplex',
    description:
      'Browse the full Auraplex catalogue of labelling, packaging and custom automation machines — built in Selangor.',
    path: `/${locale}/products`,
  });
}

type SortKey = 'featured' | 'photographed' | 'az';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: Category; sort?: SortKey }>;
}) {
  const { locale } = await params;
  const { category, sort = 'featured' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('products');

  const counts = categoryCounts();
  const photographed = MACHINES.filter((m) => m.image !== null).length;
  const _pending = MACHINES.length - photographed;

  const categories = [
    { key: undefined as Category | undefined, label: t('categories.all'), count: counts.all },
    { key: 'labelling' as Category, label: t('categories.labelling'), count: counts.labelling },
    { key: 'packaging' as Category, label: t('categories.packaging'), count: counts.packaging },
    { key: 'automation' as Category, label: t('categories.automation'), count: counts.automation },
  ];

  const sortItems: { key: SortKey; label: string }[] = [
    { key: 'featured', label: t('sort.featured') },
    { key: 'photographed', label: t('sort.photographed') },
    { key: 'az', label: t('sort.az') },
  ];

  // Build a flat translation dictionary for the client component
  const tDict: Record<string, string> = {
    sortLabel: t('sortLabel'),
    showing: t('showing'),
    ofTotal: t('ofTotal'),
    photographedSummary: t('photographedSummary'),
    photographyPending: t('photographyPending'),
    viewMachineLong: t('viewMachineLong'),
    featuredBadge: t('featuredBadge'),
    shotsLabel: t('shotsLabel'),
    from: t('from'),
    perMonth: t('perMonth'),
    priceOnRequest: t('priceOnRequest'),
    viewMachine: t('viewMachine'),
    noMatch: t('noMatch'),
    seeAll: t('seeAll'),
    cat_labelling: t('categories.labelling'),
    cat_packaging: t('categories.packaging'),
    cat_automation: t('categories.automation'),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: `https://auraplex.my/${locale}` },
              {
                name: 'Products',
                url: `https://auraplex.my/${locale}/products`,
              },
            ]),
          ),
        }}
      />

      {/* ────── COMPACT HEADER ────── */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-32 pb-12">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — {t('catalogueLine', { count: counts.all })}
          </div>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.95]">
              {t('title')}
            </h1>
            <p className="max-w-md text-[color:var(--color-steel-soft)] text-base lg:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ────── ANIMATED GRID ────── */}
      <ProductsGrid
        machines={MACHINES}
        categories={categories}
        sortItems={sortItems}
        initialCategory={category}
        initialSort={sort}
        _locale={locale}
        t={tDict}
      />
    </>
  );
}
