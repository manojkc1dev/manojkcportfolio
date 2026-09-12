import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OWNER_PROFILE, SEO_CONFIG, type Project } from '@/lib/constants';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { SectionReveal } from '@/components/public/SectionReveal';
import { ProjectSchema } from '@/components/seo/ProjectSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ArrowLeft, Github, ArrowUpRight, CheckCircle2, Server, Layers } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OWNER_PROFILE.featuredProjects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = OWNER_PROFILE.featuredProjects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} — Python & Django Project`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Backend Project by Manoj K.C.`,
      description: project.description,
      images: [project.image],
    },
    alternates: {
      canonical: `${SEO_CONFIG.metadataBase}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = OWNER_PROFILE.featuredProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: project.title, url: `/projects/${project.slug}` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white">
      <BreadcrumbSchema items={breadcrumbs} />
      <ProjectSchema project={project} />

      <Navbar />

      <main id="main-content" className="flex-1 pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <SectionReveal>
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground transition-colors p-2 rounded-lg border border-border bg-surface hover:bg-surface-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all projects</span>
            </Link>
          </div>

          <article className="p-6 sm:p-10 rounded-2xl bg-surface border border-border shadow-xs">
            {/* 1:1 Square Hero Image */}
            <div className="relative aspect-square max-w-sm mx-auto w-full overflow-hidden rounded-xl border border-border bg-surface-2 mb-8">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-surface-2 text-accent border border-border">
                {project.applicationCategory}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
                Verified Production Architecture
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-muted mb-8 leading-relaxed">
              {project.subtitle}
            </p>

            <div className="p-6 rounded-xl bg-surface-2 border border-border mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Architecture Overview</span>
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted" />
                <span>Technologies & Tooling</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-mono bg-surface-2 text-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Github className="w-4 h-4" />
                <span>Inspect GitHub Source</span>
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-surface-2 text-foreground border border-border hover:border-primary/50 transition-colors"
                >
                  <span>Launch Live Application</span>
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                </a>
              )}
            </div>
          </article>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
