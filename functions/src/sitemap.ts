import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const sitemap = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  async (req, res) => {
    let lastModDate = '2025-01-01';

    try {
      const deployDoc = await admin.firestore().collection('meta').doc('lastDeploy').get();
      if (deployDoc.exists) {
        const data = deployDoc.data();
        if (data?.timestamp) {
          const dateObj =
            typeof data.timestamp.toDate === 'function'
              ? data.timestamp.toDate()
              : new Date(data.timestamp);
          if (!isNaN(dateObj.getTime())) {
            lastModDate = dateObj.toISOString().split('T')[0];
          }
        } else if (data?.date) {
          lastModDate = String(data.date);
        }
      }
    } catch (err) {
      console.warn('Could not read meta/lastDeploy for sitemap lastmod, using fallback date:', err);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://manojkc1.com.np/</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://manojkc1.com.np/og-image.png</image:loc>
      <image:title>Manoj Khatri | Backend Software Engineer</image:title>
    </image:image>
  </url>
</urlset>`.trim();

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(xml);
  }
);
