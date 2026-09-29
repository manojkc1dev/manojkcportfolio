import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';
import { posts } from '../src/data/writing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://manojkc1.com.np';
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  imageUrl?: string;
  imageTitle?: string;
}

const staticUrls: SitemapUrl[] = [
  {
    loc: `${DOMAIN}/`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '1.0',
    imageUrl: `${DOMAIN}/og-image.png`,
    imageTitle: 'Manoj K.C. | Backend Software Engineer | Python, Django, DRF',
  },
  {
    loc: `${DOMAIN}/projects`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: `${DOMAIN}/skills`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    loc: `${DOMAIN}/experience`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    loc: `${DOMAIN}/uses`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    loc: `${DOMAIN}/writing`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.8',
  },
];

const dynamicProjectUrls: SitemapUrl[] = projects
  .filter((p) => {
    // Only include if it has a case study with at least 3 of the new fields
    const count = [
      Boolean(p.role),
      Boolean(p.duration),
      Boolean(p.gallery && p.gallery.length > 0),
      Boolean(p.metrics && p.metrics.length > 0),
      Boolean(p.proof && p.proof.length > 0),
      Boolean(p.problem),
      Boolean(p.solution),
      Boolean(p.architecture),
      Boolean(p.whatIBuilt && p.whatIBuilt.length > 0),
      Boolean(p.challenges && p.challenges.length > 0),
      Boolean(p.lessonsLearned && p.lessonsLearned.length > 0),
      Boolean(p.relatedProjects && p.relatedProjects.length > 0),
    ].filter(Boolean).length;

    return count >= 3;
  })
  .map((p) => {
    const rawImage = p.gallery?.[0] || p.image;
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${DOMAIN}${rawImage}`
      : undefined;

    return {
      loc: `${DOMAIN}/projects/${p.id}`,
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: '0.85',
      imageUrl,
      imageTitle: p.title,
    };
  });

const dynamicWritingUrls: SitemapUrl[] = posts.map((post) => ({
  loc: `${DOMAIN}/writing/${post.slug}`,
  lastmod: post.date || TODAY,
  changefreq: 'monthly',
  priority: '0.7',
  imageUrl: post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${DOMAIN}${post.coverImage}`
    : undefined,
  imageTitle: post.title,
}));

const allUrls = [...staticUrls, ...dynamicProjectUrls, ...dynamicWritingUrls];

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
];

for (const entry of allUrls) {
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
  xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${entry.priority}</priority>`);

  if (entry.imageUrl) {
    xmlLines.push('    <image:image>');
    xmlLines.push(`      <image:loc>${escapeXml(entry.imageUrl)}</image:loc>`);
    if (entry.imageTitle) {
      xmlLines.push(`      <image:title>${escapeXml(entry.imageTitle)}</image:title>`);
    }
    xmlLines.push('    </image:image>');
  }

  xmlLines.push('  </url>');
}

xmlLines.push('</urlset>');
xmlLines.push('');

const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xmlLines.join('\n'), 'utf-8');

console.log(`[Sitemap] Successfully generated ${allUrls.length} URLs to public/sitemap.xml`);
