import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'Trace — Your Personal Log',
    short_name:       'Trace',
    description:      'A calm, simple place to log writing, workouts, goals, and notes.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#f8fafc',
    theme_color:      '#4f46e5',
    orientation:      'portrait',
    scope:            '/',
    lang:             'en',
    categories:       ['productivity', 'lifestyle'],
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
      { name: 'Log',   url: '/log/',   icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
      { name: 'Goals', url: '/goals/', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
      { name: 'Notes', url: '/notes/', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
    ],
  };
}
