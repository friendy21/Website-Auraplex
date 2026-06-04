import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/primitives/button';
import { QuoteForm } from '@/components/forms/quote-form';
import { SpecSheetGate } from '@/components/forms/spec-sheet-gate';
// RoiCalculator is intentionally unwired — the original implementation
// embedded fabricated assumptions that don't reflect Auraplex's real
// pricing model. When the sales team provides real per-machine numbers,
// reconnect a rewritten version here.
// import { RoiCalculator } from '@/components/sections/roi-calculator';
import { ProductHeroImage } from '@/components/sections/product-hero-image';
import {
  buildMetadata,
  productSchema,
  breadcrumbSchema,
} from '@/lib/seo';
import { formatRM, whatsappLink } from '@/lib/utils';
import { MACHINES, getMachine, categoryLabel } from '@/lib/catalog';

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

  const p = getMachine(slug);
  if (!p) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productSchema({
              name: p.name,
              description: p.summary,
              image: p.image ?? `https://auraplex.my/og/default.png`,
              monthlyPrice: p.monthlyPrice ?? 0,
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
              { name: 'Home', url: `https://auraplex.my/${locale}` },
              { name: 'Products', url: `https://auraplex.my/${locale}/products` },
              { name: p.name, url: `https://auraplex.my/${locale}/products/${slug}` },
            ]),
          ),
        }}
      />

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24 grid grid-cols-12 gap-8 items-start">
        {/* Image column is sticky on desktop so it stays anchored while the
            info column scrolls past it. lg:top accounts for the header. */}
        <div className="col-span-12 lg:col-span-7 lg:sticky lg:top-24 self-start">
          {p.image ? (
            <ProductHeroImage src={p.image} alt={p.name} productId={p.id} />
          ) : (
            <div
              className="relative aspect-[4/3] overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] flex items-center justify-center"
              data-cursor="caliper"
            >
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-neutral-500)]">
                Photography pending
              </div>
            </div>
          )}

          {p.gallery.length > 1 && (
            <div className="mt-3 space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
                Gallery · {p.gallery.length} shots
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {p.gallery.slice(1).map((src) => (
                  <div
                    key={src}
                    className="relative aspect-square border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] group cursor-pointer"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.05]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pl-4 flex flex-col">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
            — {categoryLabel(p.category)}
            {p.speed != null && <> · {p.speed} units/min</>}
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.02em] leading-[0.95]">
            {p.name}
          </h1>

          <p className="mt-6 prose-editorial text-[color:var(--color-steel-soft)]">
            {p.summary}
          </p>

          {p.specs.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-sm border-y border-[color:var(--color-neutral-700)] py-6">
              {p.specs.slice(0, 6).map((s, i) => (
                <div key={i}>
                  <dt className="text-[10px] uppercase tracking-widest text-[color:var(--color-steel)]">
                    {s.label}
                  </dt>
                  <dd className="text-[color:var(--color-paper)]">
                    {s.value}
                    {s.unit && ` ${s.unit}`}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">
              From
            </div>
            {p.monthlyPrice != null ? (
              <div className="font-display text-5xl text-[color:var(--color-signal)] split-flap">
                {formatRM(p.monthlyPrice)}
                <span className="text-base text-[color:var(--color-steel)]">/mo</span>
              </div>
            ) : (
              <div className="font-display text-3xl text-[color:var(--color-paper)] mt-1">
                Quote on request
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="#quote">Get a quote →</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/products/${slug}/configurator`}>3D configurator →</Link>
            </Button>
            <Button asChild variant="ghost">
              <a
                href={whatsappLink(`Interested in the ${p.name}`)}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp →
              </a>
            </Button>
            <SpecSheetGate productSlug={slug} locale={locale} />
          </div>
        </div>
      </section>

      {p.specs.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-t border-[color:var(--color-neutral-700)]">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — Specifications
          </div>
          <table className="w-full font-mono text-sm">
            <tbody>
              {p.specs.map((s, i) => (
                <tr key={i} className={i % 2 ? 'bg-[color:var(--color-neutral-800)]' : ''}>
                  <td className="py-3 px-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest w-1/3">
                    {s.label}
                  </td>
                  <td className="py-3 px-4">
                    {s.value}
                    {s.unit && ` ${s.unit}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 border-t border-[color:var(--color-neutral-700)]">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — Specifications
          </div>
          <p className="prose-editorial text-[color:var(--color-steel-soft)] max-w-2xl">
            Full specifications for this machine — throughput curves, container
            compatibility, dimensions, power and air requirements — are available
            on request. Download the spec sheet above or talk to an engineer for
            a tailored breakdown.
          </p>
        </section>
      )}

      <section
        id="quote"
        className="mx-auto max-w-3xl px-6 lg:px-12 py-32"
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4">
          — Talk to an engineer
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-12">
          Get a detailed quote.
        </h2>
        <QuoteForm productSlug={slug} locale={locale} />
      </section>
    </>
  );
}
