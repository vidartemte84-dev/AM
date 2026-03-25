const withPWA = require('@ducanh2912/next-pwa').default({
  dest:            'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline:  true,
  workboxOptions:  { disableDevLogs: true },
  disable:         process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = withPWA(nextConfig);
