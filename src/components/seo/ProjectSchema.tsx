import React from 'react';
import { OWNER_PROFILE, type Project } from '@/lib/constants';

interface ProjectSchemaProps {
  project: Project;
  key?: React.Key;
}

export function ProjectSchema({ project }: ProjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${OWNER_PROFILE.domain}/projects/${project.slug}#software`,
    name: project.title,
    headline: project.subtitle,
    description: project.description,
    applicationCategory: project.applicationCategory || 'DeveloperApplication',
    operatingSystem: project.operatingSystem || 'Web, Any',
    image: `${OWNER_PROFILE.domain}${project.image}`,
    url: project.liveUrl || `${OWNER_PROFILE.domain}/projects/${project.slug}`,
    codeRepository: project.githubUrl,
    keywords: project.tags.join(', '),
    author: {
      '@type': 'Person',
      '@id': `${OWNER_PROFILE.domain}/#person`,
      name: OWNER_PROFILE.name,
      jobTitle: OWNER_PROFILE.title,
      url: OWNER_PROFILE.domain,
    },
    creator: {
      '@type': 'Person',
      name: OWNER_PROFILE.name,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      id={`project-jsonld-${project.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ProjectSchema;
