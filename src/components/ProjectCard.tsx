import React from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  Github,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Globe,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { track } from '../lib/analytics';
import { ProofBadges } from './projects/ProofBadges';

interface ProjectCardProps {
  project: Project;
  onOpenDetails?: (project: Project) => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetails,
  index = 0,
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
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative h-full flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
    >
      {/* Gradient Border Glow on Hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 rounded-2xl bg-white dark:bg-neutral-900 -z-10" />

      {/* Top Image Preview or Technical Architecture Placeholder */}
      <div
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950 shrink-0 cursor-pointer"
        onClick={() => onOpenDetails && onOpenDetails(project)}
        title="Click to view details"
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`Interface preview of ${project.title}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          /* Technical backend / API preview for projects without UI screenshots (Never assign unrelated images!) */
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800/80 text-neutral-300 select-none">
            {/* Terminal / Code Window Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                {project.category?.toUpperCase() || 'BACKEND API'}
              </span>
            </div>

            {/* Center Architecture / Endpoint Spec */}
            <div className="my-auto py-2">
              <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                {project.id === 'auth-sentinel' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : project.id === 'paystream-gateway' ? (
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                ) : project.id === 'nepal-geodata-api' ? (
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="text-xs font-mono font-bold text-white tracking-wide truncate">
                  {project.id === 'auth-sentinel'
                    ? 'POST /api/v1/auth/jwt/token/'
                    : project.id === 'paystream-gateway'
                    ? 'POST /api/v1/payments/verify/'
                    : project.id === 'nepal-geodata-api'
                    ? 'GET /api/v1/boundaries/geojson/'
                    : 'RESTful API Endpoint'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 line-clamp-1">
                {project.tagline}
              </p>
            </div>

            {/* Bottom Specs Strip */}
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-1.5">
              <span className="text-emerald-400 font-semibold">200 OK</span>
              <span className="truncate ml-2 text-neutral-400">{project.tech.slice(0, 2).join(' · ')}</span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Status badge in top-right */}
        {project.status && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
                project.status === 'live'
                  ? 'bg-emerald-500/90 text-white'
                  : project.status === 'ongoing'
                  ? 'bg-amber-500/90 text-white'
                  : 'bg-neutral-700/90 text-neutral-200'
              }`}
            >
              {project.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Content: structured in required sequence with mt-auto on Actions */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 h-full">
        {/* Category & Year */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {project.category || 'Backend'}
          </span>
          {project.year && (
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              {project.year}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {project.title}
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {project.tagline}
          </p>
        )}

        {/* Description */}
        <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Stats / Metadata */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-3.5 grid grid-cols-2 gap-2 py-2 px-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800/60">
            {project.metrics.slice(0, 2).map((metric, mIdx) => (
              <div key={mIdx} className="flex flex-col min-w-0">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider truncate">
                  {metric.label}
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Key Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Key Highlights
            </span>
            <ul className="space-y-1.5">
              {project.highlights.slice(0, 2).map((highlight, hIdx) => (
                <li
                  key={hIdx}
                  className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug line-clamp-2">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technology Badges */}
        <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Proof Badges */}
        {project.proof && project.proof.length > 0 && (
          <div className="mt-2.5">
            <ProofBadges proof={project.proof} size="sm" />
          </div>
        )}

        {/* Actions - Pushed to bottom via mt-auto */}
        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasCaseStudy && (
              project.links.caseStudy?.startsWith('http') ? (
                <a
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('project_case_study_click', { projectId: project.id })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to={project.links.caseStudy || `/projects/${project.id}`}
                  onClick={() => track('project_case_study_click', { projectId: project.id })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )
            )}

            {onOpenDetails && (
              <button
                type="button"
                onClick={() => onOpenDetails(project)}
                className="text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
              >
                Quick View
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_click', { projectId: project.id, type: 'github' })}
                aria-label={`View ${project.title} source code on GitHub`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_click', { projectId: project.id, type: 'live' })}
                aria-label={`View live demo for ${project.title}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
