import type { MetadataRoute } from 'next';
import { OWNER_PROFILE, SEO_CONFIG } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.metadataBase;
  const currentDate = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Dynamic project routes
  const projectRoutes: MetadataRoute.Sitemap = OWNER_PROFILE.featuredProjects.map(
    (project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...projectRoutes];
}
