import type { Metadata, Viewport } from 'next';
import './globals.css';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title:        'AttachMatch — Find Your Secure Connection',
  description:  'A dating app built around attachment theory. Discover your attachment style and match with compatible partners.',
  appleWebApp: {
    capable:         true,
    statusBarStyle:  'default',
    title:           'AttachMatch',
  },
  formatDetection: { telephone: false },
  manifest: '/manifest.webmanifest',
  icons: {
    icon:      [
      { url: '/icons/icon-32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple:     '/apple-touch-icon.png',
    shortcut:  '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor:   '#be185d',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* iOS PWA splash / status bar */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-brand-50 text-gray-900 antialiased">
        <div className="app-container shadow-2xl">
          {children}
        </div>
        <InstallPrompt />
      </body>
    </html>
  );
}
