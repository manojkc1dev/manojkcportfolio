import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://manojkc1.com.np/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/manoj-kc-python-backend-developer.jpg</image:loc>
      <image:caption>Manoj K.C. - Professional Python and Django Backend Developer portfolio.</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/calcpro-django-rest-api-calculator.png</image:loc>
      <image:caption>CalcPro REST API calculator project built with Django and Python.</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/shabdhabhandar-django-rest-api-calculator.png</image:loc>
      <image:caption>Shabdhabhandar dictionary project: REST API built with Django and Python.</image:caption>
    </image:image>
  </url>
</urlset>`.trim();

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=600',
    },
  });
}
