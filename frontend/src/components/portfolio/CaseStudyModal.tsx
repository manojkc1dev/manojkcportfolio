import React, { useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Server,
  Database,
  Cpu,
  Workflow,
  Sparkles,
  Users,
  Calendar,
  Building
} from 'lucide-react';

export const CaseStudyModal: React.FC = () => {
  const { activeProjectModal, setActiveProjectModal } = useCMS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProjectModal(null);
      }
    };
    if (activeProjectModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectModal, setActiveProjectModal]);

  if (!activeProjectModal) return null;

  const proj = activeProjectModal;

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveProjectModal(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Cover Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={proj.coverImage || proj.thumbnail}
            alt={proj.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            type="button"
            aria-label="Close Case Study"
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white border border-slate-700 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="absolute bottom-6 left-6 right-16">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                {proj.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                {proj.role}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {proj.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Key Quick Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Company / Client</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                {proj.client || proj.company || 'Enterprise'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Duration</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {proj.duration}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Team Size</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                {proj.teamSize} Engineers
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Authentication</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                {proj.authentication}
              </span>
            </div>
          </div>

          {/* Links Row */}
          <div className="flex flex-wrap items-center gap-3">
            {proj.githubUrl && (
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
              </a>
            )}
            {proj.liveDemoUrl && (
              <a
                href={proj.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <ExternalLink className="w-4 h-4" />
                Live Product Demo
              </a>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Executive Summary
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {proj.description}
            </p>
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                The Problem
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {proj.problem}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Architectural Solution
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {proj.solution}
              </p>
            </div>
          </div>

          {/* Connected System Architecture Visualizer */}
          {proj.architectureNodes && proj.architectureNodes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Workflow className="w-4 h-4" />
                System Topology & Flow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {proj.architectureDescription}
              </p>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {proj.architectureNodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 relative group hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase font-mono">
                          {node.type}
                        </span>
                        <Server className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div className="text-xs font-bold text-white mt-1">{node.label}</div>
                      <div className="text-[11px] font-mono text-emerald-400">{node.tech}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Features List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Core Capabilities & Innovations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {proj.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Technologies & Infrastructure
            </h4>
            <div className="flex flex-wrap gap-2">
              {proj.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">ID: {proj.id}</span>
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            Close Case Study
          </button>
        </div>

      </div>
    </div>
  );
};
