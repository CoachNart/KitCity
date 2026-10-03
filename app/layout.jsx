import './globals.css';

export const metadata = { title: 'KitCity 3D - Onboard Nigeria', description: 'KitCity 3D - Onboard Nigeria' };

export default function RootLayout({ children }) {
  return <html lang="en"><head><meta name="theme-color" content="#001014" /><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" /></head><body>{children}</body></html>;
}
