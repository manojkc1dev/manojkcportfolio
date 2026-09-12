import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: [
      'https://manojkc1.com.np/sitemap.xml',
      'https://manojkc1.com.np/sitemap-images.xml',
    ],
    host: 'manojkc1.com.np',
  };
}
