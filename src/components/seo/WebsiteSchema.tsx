import React from 'react';
import { OWNER_PROFILE } from '@/lib/constants';

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${OWNER_PROFILE.domain}/#website`,
    name: 'Manoj K.C. Portfolio',
    url: OWNER_PROFILE.domain,
    description: OWNER_PROFILE.heroIntro,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Person',
      name: OWNER_PROFILE.name,
      url: OWNER_PROFILE.domain,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${OWNER_PROFILE.domain}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default WebsiteSchema;
