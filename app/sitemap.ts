import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { MACHINES } from '@/lib/catalog';

const SITE = 'https://auraplex.my';

// Sitemap is built from the local catalog and known static routes. Case study
// detail pages are intentionally omitted while issue 01 is in production — the
// /case-studies index covers the section.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/products',
    '/services',
    '/machine-finder',
    '/case-studies',
    '/news',
    '/internship',
    '/2026',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // hreflang keys must match the region-qualified codes used in page
  // metadata (lib/seo.ts) — bare 'en'/'ms'/'zh' vs 'en-MY' mismatches
  // make Google treat them as separate alternate sets. x-default points
  // search engines at the English version for unmatched locales.
  const HREFLANG: Record<string, string> = {
    en: 'en-MY',
    ms: 'ms-MY',
    zh: 'zh-MY',
  };

  for (const locale of locales) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${SITE}/${locale}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [HREFLANG[l] ?? l, `${SITE}/${l}${route}`]),
            ),
            'x-default': `${SITE}/en${route}`,
          },
        },
      });
    }
    for (const p of MACHINES) {
      urls.push({
        url: `${SITE}/${locale}/products/${p.slug}`,
        lastModified: now,
        priority: 0.8,
      });
    }
  }

  return urls;
}
