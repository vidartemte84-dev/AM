import type { Metadata, Viewport } from 'next';
import './globals.css';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Navigation } from '@/components/Navigation';

const P = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title:       'Trace — Your Personal Log',
  description: 'A calm, simple place to log writing, workouts, goals, and notes.',
  appleWebApp: {
    capable:        true,
    statusBarStyle: 'default',
    title:          'Trace',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: `${P}/icons/icon-32.png`,  sizes: '32x32',   type: 'image/png' },
      { url: `${P}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
    ],
    apple:    `${P}/apple-touch-icon.png`,
    shortcut: `${P}/favicon.png`,
  },
};

export const viewport: Viewport = {
  themeColor:   '#4f46e5',
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
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href={`${P}/manifest.webmanifest`} />
      </head>
      <body className="antialiased">
        <div className="app-container">
          {children}
        </div>
        <Navigation />
        <InstallPrompt />
      </body>
    </html>
  );
}
