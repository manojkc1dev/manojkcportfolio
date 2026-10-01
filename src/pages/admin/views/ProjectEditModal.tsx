import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Plus,
  X,
  Sparkles,
  Check,
  Globe,
  Github,
  Image as ImageIcon,
  Gauge,
  CreditCard,
  Database,
  Activity,
  Users,
  Trash2,
  FileText,
  ExternalLink,
  Star,
} from 'lucide-react';
import type { AdminProject } from '../types';

interface ProjectEditModalProps {
  project?: AdminProject | null;
  onSave: (project: AdminProject) => void;
  onClose: () => void;
}

const METRIC_PRESETS = [
  {
    title: 'Marketplace / Payments',
    subtitle: 'Agritech & PayStream',
    metrics: [
      { label: 'API Response Time', value: '~30% faster API', icon: 'speed' as const },
      { label: 'Payment Settlement', value: 'Khalti + eSewa', icon: 'payment' as const },
    ],
  },
  {
    title: 'Calculator / Uptime',
    subtitle: 'CalcPro',
    metrics: [
      { label: 'Calculation Modes', value: '4 modes', icon: 'speed' as const },
      { label: 'Deployment Uptime', value: 'Zero-downtime deploy', icon: 'uptime' as const },
    ],
  },
  {
    title: 'Search & Volume',
    subtitle: 'Shabdhabhandar',
    metrics: [
      { label: 'Corpus Volume', value: '10K+ entries', icon: 'db' as const },
      { label: 'Search Latency', value: 'Sub-200ms search', icon: 'speed' as const },
    ],
  },
  {
    title: 'Architecture & PDF',
    subtitle: 'AcadFlow',
    metrics: [
      { label: 'Role Architecture', value: '3 roles', icon: 'users' as const },
      { label: 'Export Engine', value: 'PDF export', icon: 'db' as const },
    ],
  },
  {
    title: 'Auth & Security',
    subtitle: 'AuthSentinel',
    metrics: [
      { label: 'Token Invalidation', value: 'Redis blacklist', icon: 'speed' as const },
      { label: 'Access Security', value: 'Granular RBAC', icon: 'users' as const },
    ],
  },
  {
    title: 'GeoData & Latency',
    subtitle: 'Nepal GeoData',
    metrics: [
      { label: 'Cache Latency', value: 'Sub-15ms cache', icon: 'speed' as const },
      { label: 'Geographic Scale', value: '7 Prov · 77 Dist', icon: 'db' as const },
    ],
  },
];

const AVAILABLE_PROOF_BADGES = [
  { id: 'live-demo', label: 'Live Demo' },
  { id: 'public-repo', label: 'Public Repo' },
  { id: 'readme', label: 'README Docs' },
  { id: 'tests', label: 'Automated Tests' },
  { id: 'ci-passing', label: 'CI Passing' },
  { id: 'deployed', label: 'Production Deployed' },
  { id: 'api-docs', label: 'API Documentation' },
  { id: 'docker', label: 'Docker Containerized' },
  { id: 'postman-collection', label: 'Postman Collection' },
];

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  project,
  onSave,
  onClose,
}) => {
  const isEditing = !!project;

  const [formData, setFormData] = useState<AdminProject>(() => {
    if (project) {
      return {
        ...project,
        tagline: project.tagline || '',
        caseStudyUrl: project.caseStudyUrl || (project.slug ? `/projects/${project.slug}` : ''),
        metrics:
          project.metrics && project.metrics.length > 0
            ? project.metrics.map((m) => ({ ...m }))
            : [
                { label: 'API Response Time', value: '~30% faster API', icon: 'speed' },
                { label: 'Payment Settlement', value: 'Khalti + eSewa', icon: 'payment' },
              ],
        proof: project.proof ? [...project.proof] : ['live-demo', 'public-repo', 'readme'],
      };
    }
    return {
      id: `proj-${Date.now()}`,
      title: '',
      slug: '',
      category: 'ERP & Management',
      status: 'Deployed',
      visibility: 'Published',
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      client: '',
      industry: '',
      yearDuration: '2026 · 3 Months',
      tagline: '',
      shortDescription: '',
      fullCaseStudy: '',
      liveUrl: '',
      githubUrl: '',
      caseStudyUrl: '',
      technologies: ['Python', 'Django', 'React'],
      languages: ['Python', 'TypeScript'],
      keyHighlights: '',
      gallery: [],
      metrics: [
        { label: 'API Response Time', value: '~30% faster API', icon: 'speed' },
        { label: 'Payment Settlement', value: 'Khalti + eSewa', icon: 'payment' },
      ],
      proof: ['live-demo', 'public-repo', 'readme'],
    };
  });

  const [techInput, setTechInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [imageMode, setImageMode] = useState<'link' | 'upload'>('link');

  const handleSlugGenerate = () => {
    if (formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({
        ...prev,
        slug: generated,
        caseStudyUrl: prev.caseStudyUrl || `/projects/${generated}`,
      }));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleAddLang = () => {
    if (langInput.trim() && !formData.languages.includes(langInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, langInput.trim()],
      }));
      setLangInput('');
    }
  };

  const handleRemoveLang = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleAddMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [
        ...(prev.metrics || []),
        { label: 'Metric Name', value: 'Metric Value', icon: 'speed' },
      ],
    }));
  };

  const handleUpdateMetric = (
    index: number,
    field: 'label' | 'value' | 'icon',
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.metrics || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, metrics: updated };
    });
  };

  const handleRemoveMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index),
    }));
  };

  const handleApplyPresetMetrics = (
    presetMetrics: { label: string; value: string; icon: 'speed' | 'users' | 'db' | 'payment' | 'uptime' }[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      metrics: presetMetrics.map((m) => ({ ...m })),
    }));
  };

  const handleToggleProofBadge = (badgeId: string) => {
    setFormData((prev) => {
      const current = prev.proof || [];
      const updated = current.includes(badgeId)
        ? current.filter((b) => b !== badgeId)
        : [...current, badgeId];
      return { ...prev, proof: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {isEditing ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Update architecture specifications, client details, technical stack, and case study narrative.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Section 1: PROJECT OVERVIEW */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Project Overview
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise ERP & Inventory Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={handleSlugGenerate}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. enterprise-erp-inventory"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tagline (Subtitle / Scope)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Multi-vendor marketplace connecting farmers and buyers."
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ERP & Management">ERP & Management</option>
                  <option value="FinTech & Payments">FinTech & Payments</option>
                  <option value="E-commerce & Retail">E-commerce & Retail</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                  <option value="GovTech & Logistics">GovTech & Logistics</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="Security & Web3">Security & Web3</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Deployment Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as AdminProject['status'] })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Deployed">Deployed</option>
                  <option value="In Production">In Production</option>
                  <option value="In Development">In Development</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Client / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Himalayan Retail Group"
                  value={formData.client || ''}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wholesale & Supply Chain"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Project Year & Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2025 · 4 Months"
                  value={formData.yearDuration || ''}
                  onChange={(e) => setFormData({ ...formData, yearDuration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Short Description (Card Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the project scope in 1-2 concise sentences..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Case Study & Architectural Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed engineering breakdown, architectural challenges, and solutions..."
                  value={formData.fullCaseStudy || ''}
                  onChange={(e) => setFormData({ ...formData, fullCaseStudy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: ACTION LINKS & VERIFICATIONS */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Action Links &amp; Verifications (Case Study · Quick View · GitHub · Live Demo)
              </h3>
              <span className="text-[10px] text-neutral-400">Controls the 4 card actions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Live Demo / Deployment URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    placeholder="https://agritech-marketplace.onrender.com/"
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    placeholder="https://github.com/manojkc1dev/..."
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Case Study Page URL / Route
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="/projects/agritech or https://..."
                    value={formData.caseStudyUrl || (formData.slug ? `/projects/${formData.slug}` : '')}
                    onChange={(e) => setFormData({ ...formData, caseStudyUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  Enables the &quot;Case Study&quot; button on the card. &quot;Quick View&quot; modal is active automatically.
                </p>
              </div>

              {/* Proof Badges */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Verification Proof Badges
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_PROOF_BADGES.map((badge) => {
                    const active = (formData.proof || []).includes(badge.id);
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => handleToggleProofBadge(badge.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                          active
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: KEY METRICS & CARD STATS (SHOWN ON PROJECT CARD) */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Key Metrics &amp; Card Stats (Shown on Project Card)
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  The top 2 metrics are rendered directly in the card's 2-column stats box (e.g. &quot;API Response Time / ~30% faster API&quot; and &quot;Payment Settlement / Khalti + eSewa&quot;).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMetric}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            {/* Presets Row */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
                Quick Metric Presets (Click to apply):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METRIC_PRESETS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleApplyPresetMetrics(preset.metrics)}
                    className="p-2 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 hover:bg-blue-50 dark:bg-neutral-800/60 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                      <span>{preset.title}</span>
                      <span className="text-[9px] font-mono text-neutral-400 font-normal">Apply</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {preset.metrics[0].label}: {preset.metrics[0].value}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                      {preset.metrics[1].label}: {preset.metrics[1].value}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Metrics List */}
            <div className="space-y-2.5 pt-1">
              {(formData.metrics || []).map((metric, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="flex items-center gap-2 text-neutral-400 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {mIdx + 1}
                    </span>
                    <select
                      value={metric.icon || 'speed'}
                      onChange={(e) =>
                        handleUpdateMetric(
                          mIdx,
                          'icon',
                          e.target.value as 'speed' | 'users' | 'db' | 'payment' | 'uptime'
                        )
                      }
                      className="px-2 py-1 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                    >
                      <option value="speed">Speed (Gauge)</option>
                      <option value="payment">Payment (Card)</option>
                      <option value="db">Database (DB)</option>
                      <option value="uptime">Uptime (Activity)</option>
                      <option value="users">Users (Team)</option>
                    </select>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="sr-only">Metric Label</label>
                      <input
                        type="text"
                        placeholder="Label (e.g. API Response Time)"
                        value={metric.label}
                        onChange={(e) => handleUpdateMetric(mIdx, 'label', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="sr-only">Metric Value</label>
                      <input
                        type="text"
                        placeholder="Value (e.g. ~30% faster API)"
                        value={metric.value}
                        onChange={(e) => handleUpdateMetric(mIdx, 'value', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(mIdx)}
                    title="Remove Metric"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 self-end sm:self-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {(!formData.metrics || formData.metrics.length === 0) && (
                <div className="p-4 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 dark:text-neutral-400">
                  No metrics added yet. Click &quot;Add Metric&quot; or choose a preset above.
                </div>
              )}
            </div>
          </div>

          {/* Section 4: TECHNOLOGIES & LANGUAGES */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Technologies & Languages
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Technologies & Frameworks
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology (e.g. Docker, Redis)..."
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-neutral-700 dark:text-neutral-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Programming Languages
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {formData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLang(lang)}
                        className="text-blue-400 hover:text-blue-700 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add language (e.g. Python, SQL)..."
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLang();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddLang}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-neutral-700 dark:text-neutral-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Key Engineering Highlights
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sub-100ms reporting queries over 2M transaction ledger rows; 99.99% SLA."
                  value={formData.keyHighlights || ''}
                  onChange={(e) => setFormData({ ...formData, keyHighlights: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: MEDIA & VISUALS */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Media & Visuals
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Project Cover Image URL
              </label>

              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setImageMode('link')}
                  className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    imageMode === 'link'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Image Link / URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Upload from Device
                </button>
              </div>

              {imageMode === 'link' ? (
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-center">
                  <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-1" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Drag and drop your project cover image here or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setFormData((prev) => ({
                              ...prev,
                              thumbnail: event.target!.result as string,
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-2 text-xs"
                  />
                </div>
              )}

              {formData.thumbnail && (
                <div className="mt-3 flex items-center gap-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-16 h-12 rounded object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-white truncate">
                      Cover Thumbnail Active
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {formData.thumbnail}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnail: '' })}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: PUBLISHING CONTROLS */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Publishing Controls
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visibility === 'Published'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visibility: e.target.checked ? 'Published' : 'Draft',
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-700"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Published Live to Public Portfolio
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-neutral-300 dark:border-neutral-700"
                />
                <Star className={`w-4 h-4 ${formData.featured ? 'text-amber-500 fill-amber-400' : 'text-neutral-400'}`} />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
                  Starred Project Showcase on Homepage
                </span>
              </label>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
