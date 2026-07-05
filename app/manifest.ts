import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Auraplex',
    short_name: 'Auraplex',
    description: 'Precision labelling and packaging machines, engineered in Malaysia.',
    // Locale middleware redirects '/' → '/en'; point install directly there.
    start_url: '/en',
    display: 'standalone',
    background_color: '#181b20',
    theme_color: '#181b20',
    // Served by app/icon.png (Next also emits the <link rel="icon"> favicon
    // from it). 'any' avoids install-time 404s while a dedicated square
    // 192/512 export is pending.
    icons: [
      { src: '/icon.png', sizes: 'any', type: 'image/png' },
    ],
  };
}
