import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

// self-hosted at build time; no runtime request to Google
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PIZA — Representation 2.0',
  description:
    'PIZA is a creator-first talent management company turning cultural influence into ownership. Founded in Los Angeles by Stephanie Piza.',
  metadataBase: new URL('https://piza.studiosubtract.com'),
  openGraph: {
    title: 'PIZA — Representation 2.0',
    description:
      'PIZA is a creator-first talent management company turning cultural influence into ownership. Founded in Los Angeles by Stephanie Piza.',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0402',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
