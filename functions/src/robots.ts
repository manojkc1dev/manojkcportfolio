import { onRequest } from 'firebase-functions/v2/https';

export const robots = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://manojkc1.com.np/sitemap.xml

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /
`.trim();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(robotsTxt);
  }
);
