import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage = 'https://manojkc1.com.np/og-image.png',
  twitterCard = 'summary_large_image',
  robots,
  jsonLd,
}) => {
  const effectiveOgTitle = ogTitle || title;
  const effectiveOgDescription = ogDescription || description;
  const effectiveCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://manojkc1.com.np/');
  const effectiveOgUrl = ogUrl || effectiveCanonical;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="alternate" hrefLang="en" href={effectiveCanonical} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Manoj Khatri | Python Django REST API Developer" />
      <meta property="og:title" content={effectiveOgTitle} />
      <meta property="og:description" content={effectiveOgDescription} />
      <meta property="og:url" content={effectiveOgUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter / X */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@manojkc1dev" />
      <meta name="twitter:creator" content="@manojkc1dev" />
      <meta name="twitter:title" content={effectiveOgTitle} />
      <meta name="twitter:description" content={effectiveOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
