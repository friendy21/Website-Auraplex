import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Auraplex',
    short_name: 'Auraplex',
    description: 'Precision labelling and packaging machines, engineered in Malaysia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#181b20',
    theme_color: '#181b20',
    // Icons array is intentionally empty until proper PWA icons (192/512) are
    // exported. Browsers fall back to the favicon, which Next ships by default.
    // Listing icons that don't exist would cause an install-time 404.
    icons: [],
  };
}
