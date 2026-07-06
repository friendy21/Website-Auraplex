import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Button } from '@/components/primitives/button';
import { QuoteForm } from '@/components/forms/quote-form';
import { SpecSheetGate } from '@/components/forms/spec-sheet-gate';
import { ProductGallery } from '@/components/sections/product-gallery';
import { SpecTable } from '@/components/sections/spec-table';
import { ProofRail } from '@/components/sections/proof-rail';
import { MachineQuickSpec } from '@/components/sections/machine-quick-spec';
import { RelatedMachines } from '@/components/sections/related-machines';
import {
  buildMetadata,
  productSchema,
  breadcrumbSchema,
  SITE,
} from '@/lib/seo';
import { formatRM, whatsappLink } from '@/lib/utils';
import {
  MACHINES,
  getMachine,
  getMachinesByCategory,
  categoryLabel,
  machineTags,
} from '@/lib/catalog';
import { hasMachineModel } from '@/lib/models';

export async function generateStaticParams() {
  return MACHINES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = getMachine(slug);
  if (!p) return {};
  return buildMetadata({
    title: `${p.name} — Auraplex`,
    description: p.summary,
    path: `/${locale}/products/${slug}`,
    image: p.image ?? undefined,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const td = await getTranslations('products.detail');

  const p = getMachine(slug);
  if (!p) notFound();

  // Siblings in the same family — photographed first — for the compare rail.
  const related = getMachinesByCategory(p.category)
    .filter((m) => m.slug !== p.slug)
    .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
    .slice(0, 4)
    .map((m) => ({ slug: m.slug, name: m.name, image: m.image }));

  // Honest, name-derived application facets (Top / Wrap-Around / Print & Apply
  // / Corner Press / Semi-Auto …). Answers "what is this for?" above the fold
  // even for the ~12 machines without bespoke MACHINE_DETAILS copy.
  const tags = machineTags(p);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productSchema({
              name: p.name,
              description: p.summary,
              image: p.image,
              monthlyPrice: p.monthlyPrice,
              slug,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: `${SITE}/${locale}` },
              { name: 'Products', url: `${SITE}/${locale}/products` },
              { name: p.name, url: `${SITE}/${locale}/products/${slug}` },
            ]),
          ),
        }}
      />

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24 grid grid-cols-12 gap-8 items-start">
        {/* Image column is sticky on desktop so it stays anchored while the
            info column scrolls past it. lg:top accounts for the header. */}
        <div className="col-span-12 lg:col-span-7 lg:sticky lg:top-24 self-start">
          {p.image ? (
            <ProductGallery images={p.gallery} alt={p.name} productId={p.id} />
          ) : (
            <div
              className="relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] flex flex-col items-center justify-center gap-5 text-center px-8"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--color-signal) 12%, transparent), transparent 60%), var(--color-neutral-800)',
              }}
              data-cursor="caliper"
            >
              <span className="font-display text-[clamp(3rem,9vw,7rem)] leading-none text-[color:var(--color-signal)]/25 select-none">
                ◍
              </span>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
                On the floor · photography pending
              </div>
              <p className="max-w-sm text-sm text-[color:var(--color-steel-soft)] leading-relaxed">
                This {categoryLabel(p.category).toLowerCase()} machine is built and
                serviced from our Seri Kembangan floor. Talk to an engineer below
                for photos, drawings and a tailored spec.
              </p>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pl-4 flex flex-col">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — {categoryLabel(p.category)}
            {p.speed != null && <> · {p.speed} {td('categoryEyebrowSpeedSuffix')}</>}
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
            {p.name}
          </h1>

          <p className="mt-6 prose-editorial text-[color:var(--color-steel-soft)]">
            {p.summary}
          </p>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] border border-[color:var(--color-neutral-700)] px-2.5 py-1 text-[color:var(--color-steel-soft)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {p.specs.length > 0 ? (
            <div className="mt-10 border-y border-[color:var(--color-neutral-700)] py-2">
              <SpecTable specs={p.specs.slice(0, 6)} />
            </div>
          ) : (
            <MachineQuickSpec
              family={categoryLabel(p.category)}
              photos={p.gallery.length}
              hasModel={hasMachineModel(slug)}
            />
          )}

          <div className="mt-8">
            {p.monthlyPrice != null ? (
              <>
                <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">
                  {td('fromLabel')}
                </div>
                <div className="font-display text-5xl text-[color:var(--color-signal)] split-flap">
                  {formatRM(p.monthlyPrice)}
                  <span className="text-base text-[color:var(--color-steel)]">/mo</span>
                </div>
              </>
            ) : (
              <>
                <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">
                  {td('pricingLabel')}
                </div>
                <div className="font-display text-3xl text-[color:var(--color-paper)] mt-1">
                  {td('pricingValue')}
                </div>
                <div className="font-mono text-xs text-[color:var(--color-steel)] mt-2">
                  {td('pricingNote')}
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="#quote">{td('getQuote')} →</Link>
            </Button>
            {hasMachineModel(slug) && (
              <Button asChild variant="ghost">
                <Link href={`/${locale}/products/${slug}/configurator`}>{td('openConfigurator')} →</Link>
              </Button>
            )}
            <Button asChild variant="ghost">
              <a
                href={whatsappLink(td('whatsappMsg', { name: p.name }))}
                target="_blank"
                rel="noreferrer"
              >
                {td('whatsapp')} →
              </a>
            </Button>
            <SpecSheetGate productSlug={slug} locale={locale} />
          </div>
        </div>
      </section>

      <ProofRail />

      {p.specs.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-t border-[color:var(--color-neutral-700)]">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — {td('summaryHeading')}
          </div>
          <SpecTable specs={p.specs} />
        </section>
      ) : (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-t border-[color:var(--color-neutral-700)]">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — {td('summaryHeading')}
          </div>
          <p className="prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl">
            {td('specsFallback')}
          </p>
        </section>
      )}

      <RelatedMachines
        family={categoryLabel(p.category)}
        familyKey={p.category}
        items={related}
      />

      <section
        id="quote"
        className="mx-auto max-w-3xl px-6 lg:px-12 py-32"
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — {td('talkToEngineerEyebrow')}
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-12">
          {td('getDetailedQuote')}
        </h2>
        <QuoteForm productSlug={slug} locale={locale} />
      </section>
    </>
  );
}
