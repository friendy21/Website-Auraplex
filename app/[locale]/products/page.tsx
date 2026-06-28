import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ProductsGrid } from '@/components/sections/products-grid';
import { ProductsHero } from '@/components/sections/products-hero';
import { ParallaxMarqueeBand } from '@/components/sections/parallax-marquee-band';
import { FeaturedHighlights } from '@/components/sections/featured-highlights';
import { ApplicationBrowse } from '@/components/sections/application-browse';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import {
  MACHINES,
  categoryCounts,
  getFeaturedMachines,
  type Category,
} from '@/lib/catalog';

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

  // Hero machine for the floating visual — first featured machine with a cover.
  const heroMachine = getFeaturedMachines()[0] ?? null;

  // Catalogue structured data — an ItemList of every machine, so search
  // engines can surface the full range from this single page.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Auraplex machine catalogue',
    numberOfItems: MACHINES.length,
    itemListElement: MACHINES.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      url: `https://auraplex.my/${locale}/products/${m.slug}`,
    })),
  };

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

  // Build a flat translation dictionary for the client component.
  // Strings carrying ICU placeholders ({n}/{total}/{photo}/{pending}) use
  // t.raw() — the client interpolates them via String.replace at runtime, so
  // formatting them here (without the vars) would throw a FORMATTING_ERROR.
  const tDict: Record<string, string> = {
    sortLabel: t('sortLabel'),
    showing: t.raw('showing'),
    ofTotal: t.raw('ofTotal'),
    photographedSummary: t.raw('photographedSummary'),
    photographyPending: t('photographyPending'),
    viewMachineLong: t('viewMachineLong'),
    featuredBadge: t('featuredBadge'),
    shotsLabel: t.raw('shotsLabel'),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* ────── FLOATING-MACHINE HERO ────── */}
      {heroMachine?.image ? (
        <ProductsHero
          eyebrow={t('catalogueLine', { count: counts.all })}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc={heroMachine.image}
          imageAlt={heroMachine.name}
        />
      ) : (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-32 pb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — {t('catalogueLine', { count: counts.all })}
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[0.95]">
            {t('title')}
          </h1>
        </section>
      )}

      {/* ────── FEATURED HIGHLIGHTS (ticker + ingredient cards) ────── */}
      <FeaturedHighlights
        machines={getFeaturedMachines()}
        featuredLabel={t('featuredBadge')}
        viewLabel={t('viewMachine')}
        tickerWords={[
          'Labelling',
          'Packaging',
          'Automation',
          'Wrap-Around',
          'Print & Apply',
          'Built in Selangor',
          '30 Machines',
          'ASEAN-ready',
        ]}
      />

      {/* ────── APPLICATION-FIRST BROWSE ────── */}
      <ApplicationBrowse
        title={t('applications.title')}
        subtitle={t('applications.subtitle')}
        items={t.raw('applications.items') as { title: string; body: string; category: string }[]}
        cta={t('applications.cta')}
      />

      {/* ────── ANIMATED GRID ────── */}
      <ProductsGrid
        machines={MACHINES}
        categories={categories}
        sortItems={sortItems}
        initialCategory={category}
        initialSort={sort}
        _locale={locale}
        t={tDict}
        compareT={t.raw('compare') as Record<string, string>}
      />

      {/* ────── PARALLAX MARQUEE CLOSER BAND ────── */}
      <ParallaxMarqueeBand
        image="/floor/workers.jpg"
        text="PRECISION · ENGINEERED · IN SELANGOR"
      />
    </>
  );
}
