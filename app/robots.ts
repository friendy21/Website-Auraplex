import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://auraplex.my/sitemap.xml',
    host: 'https://auraplex.my',
  };
}
