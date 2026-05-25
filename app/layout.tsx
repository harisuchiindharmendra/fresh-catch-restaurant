import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import SmoothScroll from '@/components/effects/SmoothScroll';
import CustomCursor from '@/components/effects/CustomCursor';
import FilmGrain from '@/components/effects/FilmGrain';
import Vignette from '@/components/effects/Vignette';
import Aurora from '@/components/effects/Aurora';
import LightRays from '@/components/effects/LightRays';
import LiquidFilter from '@/components/effects/LiquidFilter';
import IntroOverlay from '@/components/effects/IntroOverlay';
import SceneTransition from '@/components/effects/SceneTransition';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

// Strip any BOM / whitespace that some shells inject when piping env values.
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fresh-catch-restaurant.vercel.app';
const SITE_URL = RAW_SITE_URL.replace(/^﻿/, '').trim();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#040912' },
    { media: '(prefers-color-scheme: light)', color: '#040912' },
  ],
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fresh Catch — Cinematic Seafood Dining',
    template: '%s · Fresh Catch',
  },
  description:
    'An elevated seafood dining experience designed for unforgettable nights. Fresh from the ocean, crafted into art.',
  keywords: [
    'fresh catch',
    'seafood restaurant',
    'fine dining',
    'michelin seafood',
    'tasting menu',
    'omakase',
    'luxury restaurant',
  ],
  authors: [{ name: 'Fresh Catch' }],
  creator: 'Fresh Catch',
  publisher: 'Fresh Catch',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Fresh Catch',
    title: 'Fresh Catch — Cinematic Seafood Dining',
    description:
      'Fresh from the ocean. Crafted into art. An elevated seafood dining experience designed for unforgettable nights.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Fresh Catch — Cinematic Seafood Dining',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Catch — Cinematic Seafood Dining',
    description: 'Fresh from the ocean. Crafted into art.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-navy-950 text-ivory antialiased selection:bg-gold/30 selection:text-ivory">
        <LiquidFilter />
        <IntroOverlay />
        <SmoothScroll>
          <Aurora />
          <LightRays />
          <SceneTransition />
          <Navigation />
          {children}
          <Footer />
          <Vignette />
          <FilmGrain />
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
