import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal,
  ShieldCheck,
  CreditCard,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasCaseStudy = Boolean(
    project.problem ||
    project.solution ||
    (project.proof && project.proof.length > 0) ||
    project.architecture ||
    project.links.caseStudy
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header Image or Terminal Preview with close button */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-950 shrink-0">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 text-neutral-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {project.category || 'BACKEND API SERVICE'}
                  </span>
                </div>
                <div className="my-auto py-2">
                  <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                    {project.id === 'auth-sentinel' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : project.id === 'paystream-gateway' ? (
                      <CreditCard className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-cyan-400" />
                    )}
                    <span className="text-sm font-mono font-bold text-white">
                      {project.id === 'auth-sentinel'
                        ? 'POST /api/v1/auth/jwt/token/'
                        : project.id === 'paystream-gateway'
                        ? 'POST /api/v1/payments/verify/'
                        : 'RESTful API Microservice'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-indigo-600 text-white shadow-xs">
                    <Sparkles className="w-3 h-3" /> Featured Project
                  </span>
                )}
                {project.status && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/90 text-white uppercase tracking-wider">
                    {project.status}
                  </span>
                )}
              </div>
              <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-300 mt-1 font-medium">
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Body Scrollable Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Overview */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Overview &amp; Architecture
              </h4>
              <p className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key Metrics Grid */}
            {project.metrics && project.metrics.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                  Key Metrics &amp; Performance
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  Key Engineering Highlights
                </h4>
                <ul className="space-y-2.5">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                Tech Stack &amp; Libraries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Press <kbd className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[11px] font-mono">ESC</kbd> to close
            </div>
            <div className="flex items-center gap-3">
              {hasCaseStudy && (
                <Link
                  to={project.links.caseStudy || `/projects/${project.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
