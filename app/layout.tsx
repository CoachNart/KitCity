import './globals.css';
import type { Metadata, Viewport } from 'next';

const logo = 'https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png';

export const metadata: Metadata = {
  title: 'KitCity — Explore. Discover. Learn Web3',
  description: 'Explore a fictional open world, uncover its stories, and learn Web3 through interactive missions.',
  applicationName: 'KitCity',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: logo, type: 'image/png' },
    ],
    apple: logo,
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