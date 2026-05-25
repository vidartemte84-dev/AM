// Writes public/manifest.webmanifest with basePath-aware URLs.
// Runs before `next build` so the static file lives at out/manifest.webmanifest.
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const P = process.env.GH_PAGES === 'true' ? '/AM' : '';

const manifest = {
  name:             'Trace — Your Personal Log',
  short_name:       'Trace',
  description:      'A calm, simple place to log writing, workouts, goals, and notes.',
  start_url:        `${P}/`,
  scope:            `${P}/`,
  id:               `${P}/`,
  display:          'standalone',
  background_color: '#f8fafc',
  theme_color:      '#4f46e5',
  orientation:      'portrait',
  lang:             'en',
  categories:       ['productivity', 'lifestyle'],
  icons: [
    { src: `${P}/icons/icon-72.png`,  sizes: '72x72',   type: 'image/png' },
    { src: `${P}/icons/icon-96.png`,  sizes: '96x96',   type: 'image/png' },
    { src: `${P}/icons/icon-128.png`, sizes: '128x128', type: 'image/png' },
    { src: `${P}/icons/icon-144.png`, sizes: '144x144', type: 'image/png' },
    { src: `${P}/icons/icon-152.png`, sizes: '152x152', type: 'image/png' },
    { src: `${P}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${P}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: `${P}/icons/icon-384.png`, sizes: '384x384', type: 'image/png' },
    { src: `${P}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `${P}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Log',   url: `${P}/log/`,   icons: [{ src: `${P}/icons/icon-96.png`, sizes: '96x96' }] },
    { name: 'Goals', url: `${P}/goals/`, icons: [{ src: `${P}/icons/icon-96.png`, sizes: '96x96' }] },
    { name: 'Notes', url: `${P}/notes/`, icons: [{ src: `${P}/icons/icon-96.png`, sizes: '96x96' }] },
  ],
};

const out = resolve(here, '..', 'public', 'manifest.webmanifest');
writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log(`✓ Wrote ${out} (basePath="${P || '/'}")`);
