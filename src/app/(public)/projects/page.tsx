import React from 'react';
import type { Metadata } from 'next';
import { OWNER_PROFILE, SEO_CONFIG } from '@/lib/constants';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { ProjectCard } from '@/components/public/ProjectCard';
import { SectionReveal } from '@/components/public/SectionReveal';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ProjectSchema } from '@/components/seo/ProjectSchema';
import { Code2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Backend Projects & Systems Engineering',
  description:
    'Production-grade Python and Django REST Framework projects engineered by Manoj K.C., featuring CalcPro and Shabdhabhandar.',
  openGraph: {
    title: 'Backend Projects — Manoj K.C.',
    description:
      'Production-grade Python and Django REST Framework projects engineered by Manoj K.C.',
    images: [SEO_CONFIG.openGraphImage],
  },
  alternates: {
    canonical: `${SEO_CONFIG.metadataBase}/projects`,
  },
};

export default function ProjectsListPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white">
      <BreadcrumbSchema items={breadcrumbs} />
      {OWNER_PROFILE.featuredProjects.map((p) => (
        <ProjectSchema key={p.slug} project={p} />
      ))}

      <Navbar />

      <main id="main-content" className="flex-1 pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        {/* Breadcrumb & Header */}
        <SectionReveal>
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground transition-colors p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-primary mb-4 shadow-xs">
              <Code2 className="w-3.5 h-3.5" />
              <span>Engineered Systems & Repositories</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Featured Backend Projects
            </h1>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Explore clean architecture, RESTful API design, database schemas, and modular Django applications built for scalability and performance.
            </p>
          </div>
        </SectionReveal>

        {/* 1 col mobile, 2 cols tablet, 3 cols desktop, gap-6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OWNER_PROFILE.featuredProjects.map((project, idx) => (
            <SectionReveal key={project.slug} delay={idx * 0.1}>
              <ProjectCard project={project} priority={idx === 0} />
            </SectionReveal>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
