// When deploying to GitHub Pages the site lives at /<repo>/ so we need a basePath.
// Set GH_PAGES=true in the build env (the Pages workflow does this).
const basePath = process.env.GH_PAGES === 'true' ? '/AM' : '';

// Make basePath visible to server-side metadata + manifest evaluation.
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const withPWA = require('@ducanh2912/next-pwa').default({
  dest:                         'public',
  cacheOnFrontEndNav:           true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline:               true,
  workboxOptions:               { disableDevLogs: true },
  disable:                      process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — required for Capacitor (iOS/Android) bundling
  output:       'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = withPWA(nextConfig);
