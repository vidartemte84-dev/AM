import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Must match the Bundle ID you register in Apple Developer Portal & App Store Connect
  appId:    'com.attachmatch.app',
  appName:  'AttachMatch',
  webDir:   'out', // Next.js static export directory
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#fdf2f8',
  },
  android: {
    backgroundColor: '#fdf2f8',
  },
};

export default config;
