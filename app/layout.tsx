import type { Metadata, Viewport } from 'next';
import './globals.css';

const DESCRIPTION =
  'PIZA is a next-gen talent venture studio and creative IP accelerator helping digital creators, entertainers, and storytellers build, co-own, and scale media empires. Founded in Los Angeles by Stephanie Piza.';

export const metadata: Metadata = {
  // Tab label only. Share cards keep the longer line below.
  title: 'PIZA',
  description: DESCRIPTION,
  metadataBase: new URL('https://piza.global'),
  openGraph: {
    title: 'PIZA · Representation 2.0',
    description: DESCRIPTION,
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        {/* General Sans for display, Satoshi for body. One link per family:
            Fontshare's CSS endpoint only serves the first `f[]` it is given. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
