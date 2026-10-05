import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const config: NextConfig = {
  reactStrictMode: true,
  // Emits .next/standalone with a self-contained server.js + a minimal
  // node_modules subset, so the site runs as a plain Node container under
  // Nomad instead of on Vercel's build output.
  output: 'standalone',
  // Next 16.2.7: cacheComponents promoted out of experimental.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // One canonical host: the bare domain served a full duplicate of the site.
  // A 308 consolidates ranking signals on www (the canonical in lib/seo.ts).
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'auraplex.info' }],
        destination: 'https://www.auraplex.info/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default withNextIntl(config);
