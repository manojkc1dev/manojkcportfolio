import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import type { Project } from '../types';
import { track } from '../lib/analytics';

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
  return (
    <motion.article
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
    >
      {/* Gradient Border Glow on Hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 rounded-2xl bg-white dark:bg-neutral-900 -z-10" />

      {/* Top Image Preview with 1.02 zoom on hover */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950">
        <img
          src={project.image}
          alt={`Dashboard interface and API architecture of ${project.title}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Tagline */}
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 line-clamp-1">
            {project.tagline}
          </p>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {project.description}
          </p>

          {/* Highlights List */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Key Highlights
              </h4>
              <ul className="space-y-1.5">
                {project.highlights.map((highlight, hIdx) => (
                  <li
                    key={hIdx}
                    className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section: Tech chips wrap + action links */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {/* Tech Chips Wrap at Bottom */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/60"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Links with keyboard accessibility & rel="noopener noreferrer" */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
            {onOpenDetails ? (
              <button
                type="button"
                onClick={() => onOpenDetails(project)}
                className="text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
              >
                Details
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 ml-auto">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('project_click', { projectId: project.id })}
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
                  onClick={() => track('project_click', { projectId: project.id })}
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
      </div>
    </motion.article>
  );
};
