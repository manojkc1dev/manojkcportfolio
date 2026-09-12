import React from 'react';
import { OWNER_PROFILE } from '@/lib/constants';

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${OWNER_PROFILE.domain}/#person`,
    name: OWNER_PROFILE.name,
    jobTitle: 'Python Django Backend Developer',
    description: OWNER_PROFILE.heroIntro,
    url: OWNER_PROFILE.domain,
    image: `${OWNER_PROFILE.domain}${OWNER_PROFILE.avatarImage}`,
    email: OWNER_PROFILE.email,
    telephone: OWNER_PROFILE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: OWNER_PROFILE.addressLocality,
      addressCountry: OWNER_PROFILE.addressCountry,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: OWNER_PROFILE.alumniOf.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nepalgunj, Banke',
        addressCountry: 'NP',
      },
    },
    sameAs: [
      'https://github.com/manojkc1',
      'https://www.linkedin.com/in/manojkc1',
    ],
    knowsAbout: [
      'Python',
      'Django',
      'DRF',
      'PostgreSQL',
      'REST',
      'JWT',
      'FastAPI',
      'SQLite',
    ],
  };

  return (
    <script
      id="person-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default PersonSchema;
