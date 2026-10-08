import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'KitCity — Learn Web3 on the Streets',
  description: 'A realistic Nigerian city game that teaches Web3 through missions.',
  applicationName: 'KitCity',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.svg', type: 'image/svg+xml' },
      { url: '/icon-512.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'KitCity',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#10C8DC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}