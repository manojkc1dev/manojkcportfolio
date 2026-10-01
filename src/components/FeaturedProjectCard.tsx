import React from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  Github,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gauge,
  CreditCard,
  Database,
  Activity,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { track } from '../lib/analytics';
import { ProofBadges } from './projects/ProofBadges';

interface FeaturedProjectCardProps {
  project: Project;
  onOpenDetails?: (project: Project) => void;
}

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  speed: Gauge,
  payment: CreditCard,
  db: Database,
  uptime: Activity,
  users: Users,
};

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  onOpenDetails,
}) => {
  const hasCaseStudy = Boolean(
    project.links.caseStudy ||
    project.problem ||
    project.solution ||
    (project.proof && project.proof.length > 0) ||
    project.architecture
  );

  return (
    <motion.article
      id={`featured-project-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group relative w-full rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      {/* Subtle border glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 rounded-3xl bg-white dark:bg-neutral-900 -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10 items-stretch">
        {/* Left Column: Rich Content */}
        <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
          <div>
            {/* Kicker Row: Status + Category + Year */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Featured Hero Project
              </span>
              {project.status && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                  {project.status}
                </span>
              )}
              {project.role && (
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  {project.role} Backend · {project.duration || '2026'}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2 leading-tight">
              {project.title}
            </h3>

            {/* Tagline */}
            <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
              {project.tagline}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Metrics Grid */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 p-3 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60">
                {project.metrics.map((m, idx) => {
                  const IconComponent = (m.icon && METRIC_ICONS[m.icon]) || Activity;
                  return (
                    <div key={idx} className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mb-1">
                        <IconComponent className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-wider truncate">
                          {m.label}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {m.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Highlights Bullets */}
            {project.highlights && project.highlights.length > 0 && (
              <ul className="space-y-2 mb-6">
                {project.highlights.slice(0, 4).map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Tech Chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Proof Badges */}
            {project.proof && project.proof.length > 0 && (
              <div className="mb-6">
                <ProofBadges proof={project.proof} size="sm" />
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_click', { projectId: project.id, type: 'live' })}
                aria-label={`View live demo for ${project.title}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                onClick={() => track('project_click', { projectId: project.id, type: 'github' })}
                aria-label={`View ${project.title} repository on GitHub`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {hasCaseStudy && (
              project.links.caseStudy?.startsWith('http') ? (
                <a
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('project_case_study_click', { projectId: project.id })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  to={project.links.caseStudy || `/projects/${project.id}`}
                  onClick={() => track('project_case_study_click', { projectId: project.id })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )
            )}

            {onOpenDetails && (
              <button
                type="button"
                onClick={() => onOpenDetails(project)}
                className="text-xs sm:text-sm font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 px-3 py-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
              >
                Quick View →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Hero Visual Container */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
          <div
            onClick={() => onOpenDetails && onOpenDetails(project)}
            className="relative group/img rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800 shadow-lg cursor-pointer w-full h-full min-h-[200px] sm:min-h-[280px] lg:min-h-[420px] aspect-video sm:aspect-16/10 lg:aspect-auto flex items-center justify-center"
            title="Click to view full architecture & details"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenDetails && onOpenDetails(project);
              }
            }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`Live application interface of ${project.title}`}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover/img:scale-[1.03] transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-400">
                <Database className="w-12 h-12 text-indigo-400 mb-3" />
                <span className="text-sm font-bold text-white">{project.title}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

            {/* Image Overlay Bottom Pill */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 bg-neutral-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 font-mono shadow-sm">
              <span className="truncate">{project.tech.slice(0, 3).join(' · ')}</span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">
                {project.metrics?.[3]?.value || '99.9% Uptime'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
