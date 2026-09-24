import React from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Briefcase,
  Star,
  Inbox,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
  Github,
  Cpu,
  User,
  Zap,
} from 'lucide-react';
import type {
  AdminTab,
  AdminProject,
  AdminInquiry,
} from '../types';

interface DashboardViewProps {
  projects: AdminProject[];
  inquiries: AdminInquiry[];
  skillsCount?: number;
  focusCount?: number;
  experienceCount?: number;
  onSelectTab: (tab: AdminTab) => void;
  onAddProject: () => void;
  onViewInquiry: (inquiry: AdminInquiry) => void;
  onBackToHome?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  inquiries,
  skillsCount = 28,
  focusCount = 5,
  experienceCount = 2,
  onSelectTab,
  onAddProject,
  onViewInquiry,
  onBackToHome,
}) => {
  const publishedProjects = projects.filter((p) => p.visibility === 'Published').length;
  const liveDemosCount = projects.filter((p) => Boolean(p.liveUrl && p.liveUrl.trim().length > 0)).length;
  const unreadInquiries = inquiries.filter((i) => !i.read).length;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Backend Engineer Portfolio Console</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, Manoj Khatri
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Manage your personal portfolio projects, live demos, GitHub repositories, technical skills stack,
            work experience, and incoming recruiter inquiries in real-time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onAddProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('skills')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-all shadow-sm cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Skills &amp; Tech Stack</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('experience')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-all shadow-sm cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience Timeline</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('inquiries')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-all shadow-sm cursor-pointer"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inquiries ({unreadInquiries} unread)</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Projects */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">
            {projects.length}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {publishedProjects} Published
          </div>
        </div>

        {/* Live Demos */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Demos</span>
            <ExternalLink className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {liveDemosCount} / {projects.length}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Active online</div>
        </div>

        {/* Skills Stack */}
        <div
          onClick={() => onSelectTab('skills')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tech Stack</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">
            {skillsCount}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Competencies</div>
        </div>

        {/* Learning Focus */}
        <div
          onClick={() => onSelectTab('skills')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Current Focus</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">
            {focusCount}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Deepening</div>
        </div>

        {/* Experience Milestones */}
        <div
          onClick={() => onSelectTab('experience')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Milestones</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">
            {experienceCount}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Career &amp; Edu</div>
        </div>

        {/* Inquiries */}
        <div
          onClick={() => onSelectTab('inquiries')}
          className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Inquiries</span>
            <Inbox className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">
            {inquiries.length}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {unreadInquiries} unread
          </div>
        </div>
      </div>

      {/* 3. Projects & Live Demos Status Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Projects &amp; Live Demos Status</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Status of all portfolio projects, live demo deployments, and GitHub source links.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('projects')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <span>Manage All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {proj.title}
                  </span>
                  {proj.featured && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                  {proj.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200/80 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 5 && (
                    <span className="text-[10px] font-mono text-neutral-400 px-1">
                      +{proj.technologies.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2 shrink-0">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                )}

                {proj.liveUrl ? (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
                    Repo only
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Contact Inquiries */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Contact Inquiries</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Messages submitted via the contact form on your portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('inquiries')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <span>View All ({inquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-6 text-xs text-neutral-500">
            No inquiries received yet. When visitors fill out the contact form, their messages will appear here.
          </div>
        ) : (
          <div className="space-y-2.5">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => onViewInquiry(inquiry)}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {inquiry.name}
                    </span>
                    {!inquiry.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {inquiry.message}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-neutral-400 shrink-0">
                  {inquiry.submittedAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
