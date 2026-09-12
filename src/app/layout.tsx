import React from 'react';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PersonSchema } from '@/components/seo/PersonSchema';
import { WebsiteSchema } from '@/components/seo/WebsiteSchema';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SEO_CONFIG } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.metadataBase),
  title: {
    default: SEO_CONFIG.titleDefault,
    template: SEO_CONFIG.titleTemplate,
  },
  description: SEO_CONFIG.description,
  keywords: [...SEO_CONFIG.keywords],
  authors: [{ name: 'Manoj K.C.', url: SEO_CONFIG.metadataBase }],
  creator: 'Manoj K.C.',
  publisher: 'Manoj K.C.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO_CONFIG.metadataBase,
    siteName: 'Manoj K.C. Portfolio',
    title: SEO_CONFIG.titleDefault,
    description: SEO_CONFIG.description,
    images: [
      {
        url: SEO_CONFIG.openGraphImage,
        width: 1200,
        height: 630,
        alt: 'Manoj K.C. - Professional Python and Django Backend Developer portfolio.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.titleDefault,
    description: SEO_CONFIG.description,
    images: [SEO_CONFIG.openGraphImage],
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
  verification: {
    google: SEO_CONFIG.googleVerification,
  },
  alternates: {
    canonical: SEO_CONFIG.canonical,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <PersonSchema />
        <WebsiteSchema />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
