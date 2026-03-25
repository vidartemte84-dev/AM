import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'AttachMatch — Find Your Secure Connection',
    short_name:       'AttachMatch',
    description:      'A dating app built around attachment theory. Discover your attachment style and match with compatible partners.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#fdf2f8',
    theme_color:      '#be185d',
    orientation:      'portrait',
    scope:            '/',
    lang:             'en',
    categories:       ['lifestyle', 'social'],
    icons: [
      { src: '/icons/icon-72.png',  sizes: '72x72',   type: 'image/png' },
      { src: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png' },
      { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
      { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name:      'Discover',
        url:       '/discover',
        icons:     [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
      {
        name:      'My Matches',
        url:       '/matches',
        icons:     [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
    ],
  };
}
