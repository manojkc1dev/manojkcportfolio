import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Plus,
  Check,
  Globe,
  Layers,
  Database,
  GraduationCap,
  Building2,
  Cpu,
  Smartphone,
  Cloud,
  ShieldCheck,
  Code,
  Server,
  Settings,
  Sparkles,
  Workflow,
  Terminal,
  Lock,
  BarChart,
  Zap,
  Monitor,
  Network,
} from 'lucide-react';
import type { AdminService } from '../types';

export const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Globe,
  Layers,
  Database,
  GraduationCap,
  Building2,
  Cpu,
  Smartphone,
  Cloud,
  ShieldCheck,
  Code,
  Server,
  Settings,
  Sparkles,
  Workflow,
  Terminal,
  Lock,
  BarChart,
  Zap,
  Monitor,
  Network,
};

interface ServiceEditModalProps {
  service?: AdminService | null;
  onSave: (service: AdminService) => void;
  onClose: () => void;
}

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({
  service,
  onSave,
  onClose,
}) => {
  const isEditing = !!service;

  const [formData, setFormData] = useState<AdminService>(() => {
    if (service) return { ...service };
    return {
      id: `srv-${Date.now()}`,
      order: 1,
      title: '',
      slug: '',
      icon: 'Globe',
      shortSummary: '',
      detailedScope: '',
      features: ['Custom Tailored Architecture', 'Full Technical Documentation'],
      deliverables: ['Production Docker Container', 'Complete Source Code'],
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      visibility: 'Published',
      featured: true,
      metaTitle: '',
      metaDescription: '',
    };
  });

  const [newFeature, setNewFeature] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleSlugGenerate = () => {
    if (formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData((prev) => ({
        ...prev,
        deliverables: [...(prev.deliverables || []), newDeliverable.trim()],
      }));
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: (prev.deliverables || []).filter((_, i) => i !== idx),
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  const ActiveIconComponent = SERVICE_ICONS[formData.icon] || Globe;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
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
                {isEditing ? 'Edit Service Offering' : 'Add New Service Offering'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Define architectural scopes, key technical capabilities, and deliverable commitments.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Section 1: GENERAL INFORMATION */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                General Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom Web Application Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. custom-web-development"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Display Order Number
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Service Icon Selection Grid */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Service Icon
                  </label>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    Selected: <ActiveIconComponent className="w-3.5 h-3.5 inline" /> {formData.icon}
                  </span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  {Object.entries(SERVICE_ICONS).map(([iconName, IconComp]) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      title={iconName}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                        formData.icon === iconName
                          ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Short Summary / Teaser *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview describing what problems this service solves..."
                  value={formData.shortSummary}
                  onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Detailed Scope & Architectural Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="In-depth technical breakdown and methodology..."
                  value={formData.detailedScope || ''}
                  onChange={(e) => setFormData({ ...formData, detailedScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: KEY TECHNICAL FEATURES */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Key Technical Features
              </h3>
            </div>

            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const updated = [...formData.features];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, features: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-neutral-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another key feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/70 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: DELIVERABLES & HANDOVER */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Deliverables & Handover
              </h3>
            </div>

            <div className="space-y-2">
              {(formData.deliverables || []).map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </div>
                  <input
                    type="text"
                    value={deliv}
                    onChange={(e) => {
                      const updated = [...(formData.deliverables || [])];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, deliverables: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="p-1.5 text-neutral-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add deliverable commitment..."
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-200 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deliverable</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: PUBLISHING & TECH STACK */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Publishing & Technologies
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Core Technologies & Frameworks
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
                  placeholder="Add technology (e.g. Next.js, Django)..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
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
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-neutral-300 dark:border-neutral-700"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Publish Live to Public Site
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-neutral-300 dark:border-neutral-700"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Feature on Homepage
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Update Service' : 'Create Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
