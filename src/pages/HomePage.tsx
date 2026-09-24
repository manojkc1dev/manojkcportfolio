import React, { Suspense } from 'react';
import { Hero } from '../components/Hero';
import { Seo } from '../components/Seo';

const About = React.lazy(() =>
  import('../components/About').then((m) => ({ default: m.About }))
);
const Projects = React.lazy(() =>
  import('../components/Projects').then((m) => ({ default: m.Projects }))
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
        title="Manoj Khatri | Backend Software Engineer — Python, Django, DRF"
        description="Python & Django backend developer shipping REST APIs, JWT authentication, RBAC authorization, and eSewa/Khalti payment integrations for production web apps."
        canonical="https://manojkc1.com.np/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Manoj Khatri',
          jobTitle: 'Backend Software Engineer',
          url: 'https://manojkc1.com.np',
          sameAs: [
            'https://github.com/manojkc1dev',
            'https://linkedin.com/in/manojkc1dev',
            'https://twitter.com/manojkc1dev',
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
          <Skills />
          <Experience />
          <Contact />
        </Suspense>
      </main>
    </>
  );
};
