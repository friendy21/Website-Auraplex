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
    '/financing',
    '/case-studies',
    '/news',
    '/careers',
    '/2026',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${SITE}/${locale}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE}/${l}${route}`]),
          ),
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
