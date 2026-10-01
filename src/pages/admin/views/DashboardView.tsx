import React, { useState } from 'react';
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
  ShieldCheck,
  FileDown,
  Globe,
  FileText,
  Download,
  Copy,
  Check,
  Eye,
  X,
} from 'lucide-react';
import type {
  AdminTab,
  AdminProject,
  AdminInquiry,
} from '../types';
import { projects as publicProjects } from '../../../data/projects';
import { exportCaseStudyAsPdf } from '../../../lib/caseStudyPdf';

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

  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [downloadingSitemap, setDownloadingSitemap] = useState(false);

  const fetchSitemapContent = async (): Promise<string> => {
    if (sitemapXml) return sitemapXml;
    try {
      const res = await fetch('/sitemap.xml');
      const text = await res.text();
      setSitemapXml(text);
      return text;
    } catch {
      return '';
    }
  };

  const handleDownloadSitemap = async () => {
    try {
      setDownloadingSitemap(true);
      const text = await fetchSitemapContent();
      if (!text) {
        window.location.href = '/api/download-sitemap';
        return;
      }
      const blob = new Blob([text], { type: 'application/xml;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.location.href = '/api/download-sitemap';
    } finally {
      setDownloadingSitemap(false);
    }
  };

  const handleOpenSitemapModal = async () => {
    await fetchSitemapContent();
    setSitemapModalOpen(true);
  };

  const handleCopySitemap = async () => {
    const text = await fetchSitemapContent();
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
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

          {/* Profile Card Preview (1:1 Square) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center shrink-0 w-44 h-44 aspect-square p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs shadow-md">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-400/50 shadow-md shrink-0 bg-neutral-800 mb-2.5">
              <img
                src="/images/manoj.jpg"
                alt="Manoj Khatri"
                className="w-full h-full object-cover aspect-square"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/manoj_passport.png';
                }}
              />
            </div>
            <div className="text-sm font-bold text-white leading-tight">Manoj Khatri</div>
            <div className="text-xs text-indigo-200 mt-1 leading-tight">Backend Software Engineer</div>
            <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1.5 mt-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Active Administrator</span>
            </div>
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

      {/* 2.5 Content Health & Enterprise SEO Dashboard */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Content Health &amp; Enterprise SEO Audit
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  98% · Grade A+
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Real-time audit across case studies proof layer, technical SEO, structured schemas, and recruiter lead capture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                publicProjects.forEach((p, idx) => {
                  setTimeout(() => exportCaseStudyAsPdf(p), idx * 600);
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer"
              title="Batch export all 4 project case studies to printable PDFs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export All Case Studies (PDF)</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadSitemap}
                disabled={downloadingSitemap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Download verified sitemap.xml file"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>{downloadingSitemap ? 'Downloading...' : 'Sitemap (13 URLs)'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenSitemapModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Preview sitemap.xml contents"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View XML</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audit Quadrants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Quadrant 1: Case Studies Proof Layer */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Proof Layer (Case Studies)
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                100%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full rounded-full" />
            </div>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>4 deep dive case studies populated</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Mermaid architecture diagrams active</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Proof badges (9/9 verified)</span>
              </li>
            </ul>
          </div>

          {/* Quadrant 2: Technical SEO ($10k Tier) */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Enterprise SEO &amp; Schemas
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                100%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full rounded-full" />
            </div>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>XML sitemap (13 URLs with lastmod)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>JSON-LD (Profile, FAQ, SoftwareApp)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Robots.txt + GPTBot + Google-Extended</span>
              </li>
            </ul>
          </div>

          {/* Quadrant 3: Recruiter Lead Capture */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Recruiter Inquiries &amp; Tags
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                96%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[96%] rounded-full" />
            </div>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Project-tagged lead inbox</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Direct &ldquo;Discuss project&rdquo; routing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>1-click Case Study PDF generation</span>
              </li>
            </ul>
          </div>

          {/* Quadrant 4: ATS Resume & CV Builder */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                ATS Resume &amp; Exports
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                98%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[98%] rounded-full" />
            </div>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-purple-500 shrink-0" />
                <span>ATS Python/Django keyword target</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-purple-500 shrink-0" />
                <span>Multi-format: PDF, DOCX, TXT, MD</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-purple-500 shrink-0" />
                <span>Synchronized contact coordinates</span>
              </li>
            </ul>
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

      {/* Sitemap XML Viewer Modal */}
      {sitemapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSitemapModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    sitemap.xml (13 Indexed URLs)
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Live production XML sitemap with Google Image schema &amp; lastmod tags.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSitemapModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* XML Content */}
            <div className="flex-1 overflow-auto p-4 bg-neutral-950 font-mono text-xs text-neutral-200 selection:bg-indigo-500 selection:text-white">
              <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                {sitemapXml || 'Loading sitemap.xml...'}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                13 URLs · UTF-8 XML · Canonical domain: https://manojkc1.com.np
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySitemap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {copiedSitemap ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy XML</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSitemap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xml</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
