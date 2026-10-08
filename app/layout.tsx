import './globals.css';
import type { Metadata, Viewport } from 'next';

const logo = 'https://i.postimg.cc/6pLt0sn3/file-000000006e348210b7a8c70bc4ed899d.png';

export const metadata: Metadata = {
  title: 'KitCity — Learn Web3 on the Streets',
  description: 'A realistic Nigerian city game that teaches Web3 through missions.',
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