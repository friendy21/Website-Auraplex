import type { Metadata } from 'next';

const SITE = 'https://auraplex.my';

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: string;
}): Metadata {
  const url = `${SITE}${opts.path ?? ''}`;
  return {
    metadataBase: new URL(SITE),
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: {
        'en-MY': `${SITE}/en${opts.path ?? ''}`,
        'ms-MY': `${SITE}/ms${opts.path ?? ''}`,
        'zh-MY': `${SITE}/zh${opts.path ?? ''}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: opts.title,
      description: opts.description,
      siteName: 'Auraplex',
      locale: opts.locale ?? 'en_MY',
      // Default OG image is dynamic — generated per request by /api/og with
      // the page title encoded as a query param. No static /og/default.png
      // dependency.
      images: [
        {
          url:
            opts.image ??
            `/api/og?title=${encodeURIComponent(opts.title)}&subtitle=${encodeURIComponent(opts.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [
        opts.image ??
          `/api/og?title=${encodeURIComponent(opts.title)}&subtitle=${encodeURIComponent(opts.description)}`,
      ],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Auraplex SDN BHD',
    url: SITE,
    logo: `${SITE}/logo.svg`,
    // Real profiles verified against the live autolabellermalaysia.com
    // footer (canonical URLs, tracking params stripped).
    sameAs: [
      'https://www.facebook.com/Auraplex-100352958924725/',
      'https://www.instagram.com/auraplex_/',
      'https://www.youtube.com/@auraplex5219',
      'https://www.tiktok.com/@auraplex_',
      'https://www.linkedin.com/company/auraplex/',
      'https://shopee.com.my/auraplex',
    ],
    // Full street address as published on the live autolabellermalaysia.com
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No 5, Jalan BS9/7B, Taman Bukit Serdang, Seksyen 9',
      postalCode: '43300',
      addressLocality: 'Seri Kembangan',
      addressRegion: 'Selangor',
      addressCountry: 'MY',
    },
    telephone: '+60389407709',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '1700-82-6502',
      areaServed: 'ASEAN',
      availableLanguage: ['English', 'Malay', 'Chinese'],
    },
  };
}

export function productSchema(p: {
  name: string;
  description: string;
  image: string;
  monthlyPrice: number;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.image,
    brand: { '@type': 'Brand', name: 'Auraplex' },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/products/${p.slug}`,
      priceCurrency: 'MYR',
      price: p.monthlyPrice,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.monthlyPrice,
        priceCurrency: 'MYR',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'MONTH' },
      },
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Auraplex SDN BHD' },
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
