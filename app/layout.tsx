import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KitCity',
  description: 'KitCity',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}