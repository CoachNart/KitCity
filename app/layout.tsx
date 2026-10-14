import './globals.css';
import type { Metadata, Viewport } from 'next';

const logo = 'https://i.postimg.cc/qqbdTXky/file-00000000958881f4a776df689a235dec.png';

export const metadata: Metadata = {
  title: 'KitCity — The Lost Value',
  description: 'Explore Lagos in KitCity: The Lost Value, a story-driven Nigerian open-world adventure filled with characters, choices, discoveries, and missions.',
  applicationName: 'KitCity',
  keywords: ['KitCity', 'The Lost Value', 'Nigerian game', 'open-world adventure', 'story-driven game', 'Lagos game'],
  openGraph: {
    title: 'KitCity — The Lost Value',
    description: 'Explore Lagos, meet its people, uncover clues, and follow the story in a Nigerian open-world adventure.',
    siteName: 'KitCity — The Lost Value',
    type: 'website',
    locale: 'en_NG',
    images: [{ url: logo, width: 512, height: 512, alt: 'KitCity — The Lost Value' }],
  },
  twitter: {
    card: 'summary',
    title: 'KitCity — The Lost Value',
    description: 'A story-driven Nigerian open-world adventure set in Lagos.',
    images: [{ url: logo, alt: 'KitCity — The Lost Value' }],
  },
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