import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://specidiee.work'),
  title: {
    default: 'specidiee.work',
    template: '%s | specidiee.work',
  },
  description: 'Personal blog of specidiee',
  openGraph: {
    title: 'specidiee.work',
    description: 'Personal blog of specidiee',
    url: 'https://specidiee.work',
    siteName: 'specidiee.work',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'specidiee.work',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'specidiee.work',
    description: 'Personal blog of specidiee',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
