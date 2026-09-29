import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Github,
  Terminal,
  Send,
  Video,
  ArrowLeft,
  ArrowRight,
  Layers,
  ChevronDown,
  CheckCircle2,
  Download,
  FileDown,
  MessageSquare,
  Mail,
  X,
  Gauge,
  Users,
  Database,
  CreditCard,
  Activity,
  ChevronLeft,
} from 'lucide-react';
import { projects } from '../data/projects';
import { ProofBadges } from '../components/projects/ProofBadges';
import { MermaidDiagram } from '../components/projects/MermaidDiagram';
import { Seo } from '../components/Seo';
import { exportCaseStudyAsPdf } from '../lib/caseStudyPdf';
import type { Project, Metric } from '../types';

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  speed: Gauge,
  users: Users,
  db: Database,
  payment: CreditCard,
  uptime: Activity,
};

export const ProjectCaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const currentIndex = projects.findIndex((p) => p.id === slug);
  const project: Project | undefined = projects[currentIndex];

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  // Challenge accordion state (open indices)
  const [openChallenges, setOpenChallenges] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleChallenge = (idx: number) => {
    setOpenChallenges((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Lightbox state for gallery
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null || !project?.gallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null && prev < (project.gallery?.length ?? 1) - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : (project.gallery?.length ?? 1) - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, project?.gallery]);

  if (!project) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
          Project Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
          The requested project case study could not be found or may have been updated.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </main>
    );
  }

  // Related project objects
  const relatedProjectsList = (project.relatedProjects || [])
    .map((rId) => projects.find((p) => p.id === rId))
    .filter(Boolean) as Project[];

  // SEO tags
  const pageTitle = `${project.title} | Manoj K.C. — Django & DRF Projects`;
  const metaDescription =
    project.tagline ||
    project.description.slice(0, 155) ||
    'Deep dive architecture case study by Manoj K.C.';
  const canonicalUrl = `https://manojkc1.com.np/projects/${project.id}`;
  const ogImageUrl = project.gallery?.[0] || project.image || 'https://manojkc1.com.np/og-image.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        url: project.links.live || canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Manoj K.C.',
          url: 'https://manojkc1.com.np/',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://manojkc1.com.np/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: 'https://manojkc1.com.np/projects',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Seo
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogImage={ogImageUrl}
        jsonLd={jsonLd}
      />

      <article className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium truncate max-w-xs sm:max-w-sm">
            {project.title.split('|')[0].trim()}
          </span>
        </nav>

        {/* 2. Hero Section */}
        <header className="mb-14">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs font-mono">
            {project.status && (
              <span
                className={`px-3 py-1 rounded-full uppercase tracking-wider font-semibold border ${
                  project.status === 'live'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : project.status === 'ongoing'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                }`}
              >
                {project.status}
              </span>
            )}
            {project.year && (
              <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-700/60">
                Year: {project.year}
              </span>
            )}
            {project.role && (
              <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-700/60">
                Role: {project.role}
              </span>
            )}
            {project.duration && (
              <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-700/60">
                Duration: {project.duration}
              </span>
            )}
          </div>

          {/* H1 Title & Tagline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mb-6">
            {project.tagline}
          </p>

          {/* Proof Badges */}
          {project.proof && project.proof.length > 0 && (
            <div className="mb-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                Verified Proof Badges
              </div>
              <ProofBadges proof={project.proof} size="md" />
            </div>
          )}

          {/* CTA Row (Live, GitHub, API Docs, Postman, Video) */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {project.links.apiDocs && (
              <a
                href={project.links.apiDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>API Docs</span>
              </a>
            )}

            {project.links.postman && (
              <a
                href={project.links.postman}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Postman Spec</span>
              </a>
            )}

            {project.links.video && (
              <a
                href={project.links.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Walkthrough Video</span>
              </a>
            )}

            {/* Case Study PDF Download Button */}
            {project.problem && project.solution && project.tagline && (
              <button
                type="button"
                onClick={() => exportCaseStudyAsPdf(project)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Case Study (PDF)</span>
              </button>
            )}

            {/* Discuss This Project Button */}
            <a
              href={`/#contact?project=${project.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss this project</span>
            </a>
          </div>

          {/* Tech Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Hero Screenshot */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800 shadow-2xl aspect-video w-full">
            <img
              src={project.image}
              alt={`Architecture and user interface of ${project.title}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </header>

        {/* 3. Metrics Bar (skip if no metrics) */}
        {project.metrics && project.metrics.length > 0 && (
          <section
            aria-label="Key Performance Metrics"
            className="mb-16 p-6 sm:p-8 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xs"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-6">
              Verified Key Metrics &amp; Benchmarks
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.metrics.map((metric: Metric, idx: number) => {
                const Icon = (metric.icon && METRIC_ICONS[metric.icon]) || Gauge;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <Icon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{metric.label}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                      {metric.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Gallery + Keyboard Lightbox (skip if no gallery) */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Interface &amp; System Screenshots
              </h2>
              <span className="text-xs font-mono text-neutral-400">Click to expand</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.gallery.map((imgUrl, gIdx) => (
                <button
                  key={gIdx}
                  type="button"
                  onClick={() => setLightboxIndex(gIdx)}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 aspect-video focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-zoom-in"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} screenshot ${gIdx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 5. The Problem (skip if no problem) */}
        {project.problem && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 mb-3 font-mono uppercase tracking-wider">
              <span>The Problem Space</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Context &amp; Core Problem
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
              {project.problem}
            </p>
          </section>
        )}

        {/* 6. What I Built (skip if no solution) */}
        {project.solution && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 mb-3 font-mono uppercase tracking-wider">
              <span>The Architectural Solution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              System Design &amp; Core Solution
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
              {project.solution}
            </p>
          </section>
        )}

        {/* 7. What I personally shipped — first-person bullets */}
        {project.whatIBuilt && project.whatIBuilt.length > 0 && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              What I Personally Shipped
            </h2>
            <ul className="space-y-4">
              {project.whatIBuilt.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. Architecture — Mermaid diagram */}
        {project.architecture && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-2 font-mono uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Data &amp; Service Flow</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  System Architecture Diagram
                </h2>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl">
              Visualizing the request pipeline from client-side state transitions through DRF routing, authentication validation, database storage, and external API gateways.
            </p>
            <MermaidDiagram chart={project.architecture} />
          </section>
        )}

        {/* 9. Tech Stack Table */}
        {project.techStackTable && project.techStackTable.length > 0 && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Engineering Stack Breakdown
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
              <table className="w-full text-left text-sm font-sans border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 dark:bg-neutral-800/70 border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-white font-mono text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Layer</th>
                    <th className="py-3 px-4 sm:px-6">Choice</th>
                    <th className="py-3 px-4 sm:px-6">Rationale &amp; Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                  {project.techStackTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-xs text-neutral-500 dark:text-neutral-400">
                        {row.layer}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-neutral-900 dark:text-white">
                        {row.choice}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed">
                        {row.why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 10. Challenges & Solutions — Accordions */}
        {project.challenges && project.challenges.length > 0 && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Engineering Challenges &amp; Technical Solutions
            </h2>
            <div className="space-y-4">
              {project.challenges.map((c, cIdx) => {
                const isOpen = Boolean(openChallenges[cIdx]);

                return (
                  <div
                    key={cIdx}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleChallenge(cIdx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                        {c.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-indigo-500' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 space-y-4 text-xs sm:text-sm border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-rose-500 font-semibold mb-1">
                            The Obstacle
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {c.problem}
                          </p>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-indigo-500 font-semibold mb-1">
                            Technical Approach
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {c.approach}
                          </p>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 font-semibold mb-1">
                            Measured Outcome
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {c.outcome}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 11. What I Learned */}
        {project.lessonsLearned && project.lessonsLearned.length > 0 && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Key Lessons Learned
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.lessonsLearned.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
                >
                  <span className="font-mono text-indigo-500 font-bold block mb-1">
                    Lesson #{idx + 1}
                  </span>
                  {lesson}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 12. Related Work */}
        {relatedProjectsList.length > 0 && (
          <section className="mb-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjectsList.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/projects/${rel.id}`}
                  className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                      {rel.title.split('|')[0].trim()}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {rel.tagline}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 13. CTA: Contact + Download Resume */}
        <section className="mb-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-neutral-950 border border-indigo-500/20 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Interested in Building Similar Systems?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mb-8 leading-relaxed">
            I am available for freelance backend contracts, technical consulting, and remote full-time Python/Django engineering positions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`/#contact?project=${project.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss this project</span>
            </a>
            <a
              href="mailto:manojkc1dev@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Manoj</span>
            </a>
            <a
              href="/resume.pdf"
              download="Manoj_KC_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold text-sm border border-neutral-300 dark:border-neutral-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume (PDF)</span>
            </a>
          </div>
        </section>

        {/* 14. Footer Navigation: Prev / All / Next */}
        <footer className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.id}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev:</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {prevProject.title.split('|')[0].trim()}
              </span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            to="/projects"
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800 transition-colors"
          >
            All Projects
          </Link>

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.id}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-right"
            >
              <span className="hidden sm:inline">Next:</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {nextProject.title.split('|')[0].trim()}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </footer>
      </article>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && project.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close image viewer"
            >
              <X className="w-6 h-6" />
            </button>

            {project.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : (project.gallery?.length ?? 1) - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) =>
                      prev !== null && prev < (project.gallery?.length ?? 1) - 1 ? prev + 1 : 0
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Next screenshot"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.gallery[lightboxIndex]}
                alt={`${project.title} screenshot enlarged`}
                className="w-full h-auto object-contain max-h-[85vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
