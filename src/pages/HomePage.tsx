import React, { Suspense } from 'react';
import { Hero } from '../components/Hero';
import { Seo } from '../components/Seo';

const About = React.lazy(() =>
  import('../components/About').then((m) => ({ default: m.About }))
);
const Projects = React.lazy(() =>
  import('../components/Projects').then((m) => ({ default: m.Projects }))
);
const CurrentlyBuilding = React.lazy(() =>
  import('../components/CurrentlyBuilding').then((m) => ({ default: m.CurrentlyBuilding }))
);
const Skills = React.lazy(() =>
  import('../components/Skills').then((m) => ({ default: m.Skills }))
);
const Experience = React.lazy(() =>
  import('../components/Experience').then((m) => ({ default: m.Experience }))
);
const Contact = React.lazy(() =>
  import('../components/Contact').then((m) => ({ default: m.Contact }))
);

const SectionSkeleton: React.FC = () => (
  <div className="w-full py-20 px-4 max-w-7xl mx-auto animate-pulse">
    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-1/4 mb-4" />
    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
    </div>
  </div>
);

export const HomePage: React.FC = () => {
  return (
    <>
      <Seo
        title="Manoj Khatri | Python Django REST API Developer | Manoj K.C."
        description="Manoj Khatri (Manoj K.C.) is a Python Django REST API developer in Kathmandu, Nepal, building secure REST APIs with Django REST Framework, PostgreSQL, JWT auth, and Khalti/eSewa payment integrations."
        canonical="https://manojkc1.com.np/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': 'https://manojkc1.com.np/#person',
              name: 'Manoj Khatri',
              alternateName: [
                'Manoj K.C.',
                'ManojKC',
                'manojkc',
                'manojkc1',
                'ManojKhatri',
                'manojkhatri',
                'manojk.c',
                'manojk.c.',
                'manoj k.c.',
                'Manoj',
              ],
              jobTitle: 'Python Django REST API Developer',
              url: 'https://manojkc1.com.np/',
              image: {
                '@type': 'ImageObject',
                url: 'https://manojkc1.com.np/images/manoj.jpg',
                caption: 'Manoj Khatri — Python Django REST API Developer',
              },
              email: 'mailto:manojkc1dev@gmail.com',
              telephone: '+977-9842203976',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kathmandu',
                addressCountry: 'NP',
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Mahendra Multiple Campus, Tribhuvan University',
              },
              knowsAbout: [
                'Python',
                'Django',
                'Django REST Framework',
                'PostgreSQL',
                'REST APIs',
                'JWT',
                'RBAC',
                'Docker',
                'Khalti API',
                'eSewa API',
              ],
              sameAs: [
                'https://github.com/manojkc1dev/',
                'https://linkedin.com/in/manojkc1dev/',
                'https://twitter.com/manojkc1dev',
                'https://instagram.com/manojkc1dev',
                'https://facebook.com/manojkc1dev',
                'https://tiktok.com/@manojkc1dev',
              ],
            },
            {
              '@type': 'WebSite',
              '@id': 'https://manojkc1.com.np/#website',
              url: 'https://manojkc1.com.np/',
              name: 'Manoj Khatri | Python Django REST API Developer',
              publisher: { '@id': 'https://manojkc1.com.np/#person' },
              inLanguage: 'en',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://manojkc1.com.np/projects?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'WebPage',
              '@id': 'https://manojkc1.com.np/#webpage',
              url: 'https://manojkc1.com.np/',
              name: 'Manoj Khatri | Python Django REST API Developer | Manoj K.C.',
              description:
                'Manoj Khatri (Manoj K.C.) is a Python Django REST API developer in Kathmandu, Nepal, building secure REST APIs with Django REST Framework, PostgreSQL, JWT auth, and Khalti/eSewa payment integrations.',
              isPartOf: { '@id': 'https://manojkc1.com.np/#website' },
              about: { '@id': 'https://manojkc1.com.np/#person' },
            },
            {
              '@type': 'ProfilePage',
              '@id': 'https://manojkc1.com.np/#profilepage',
              url: 'https://manojkc1.com.np/',
              name: 'Manoj Khatri — Python Django REST API Developer',
              mainEntity: { '@id': 'https://manojkc1.com.np/#person' },
            },
            {
              '@type': 'FAQPage',
              '@id': 'https://manojkc1.com.np/#faq',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What backend technologies does Manoj Khatri specialize in?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Manoj Khatri (Manoj K.C.) specializes in Python 3.12, Django 5.x, Django REST Framework (DRF), and PostgreSQL database architecture. His engineering core encompasses composite B-Tree query indexing, Celery asynchronous task queues, Redis caching, Docker containerization, and Linux server operations. He develops secure RESTful APIs fortified with JWT authentication, role-based access control (RBAC), and strict input validation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Manoj Khatri available for remote freelance work?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Manoj Khatri is actively available for remote freelance engineering contracts, technical backend consulting, and full-time junior-to-mid backend engineering roles. Based in Kathmandu, Nepal (NPT / UTC+5:45), he collaborates effectively with international engineering teams across North America, Europe, and Asia-Pacific via asynchronous Git workflows, clear documentation, and prompt communication.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What payment gateways has Manoj Khatri integrated?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Manoj Khatri has built production-grade integrations with Nepalese fintech payment gateways including Khalti API v2 and eSewa EPAY v2 (with HMAC-SHA256 signature verification), as well as global gateways like Stripe. His payment architectures enforce strict transaction idempotency keys, automated reconciliation retries, and failure-safe webhook pipelines to guarantee zero duplicate charges.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does Manoj Khatri optimize database performance in Django/PostgreSQL?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Manoj Khatri systematically profiles execution bottlenecks using PostgreSQL EXPLAIN ANALYZE and Django Debug Toolbar. He eliminates N+1 query loops using select_related and prefetch_related, designs composite indexes tailored to high-cardinality filters, and leverages Redis for cached hot query results—achieving verified ~30% API response time reductions on high-traffic endpoints.',
                  },
                },
              ],
            },
          ],
        }}
      />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Code-split sections inside Suspense */}
        <Suspense fallback={<SectionSkeleton />}>
          <About />
          <Projects />
          <CurrentlyBuilding />
          <Skills />
          <Experience />
          <Contact />
        </Suspense>
      </main>
    </>
  );
};
