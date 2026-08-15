import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Project, ArchitectureNode } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Eye, Folder, Workflow, CheckCircle2, Pin } from 'lucide-react';

export const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, setActiveProjectModal } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: 'Distributed Systems',
    description: '',
    role: 'Principal Architect',
    client: '',
    duration: '6 Months',
    teamSize: 8,
    problem: '',
    solution: '',
    features: ['Real-time streaming', 'Multi-region failover'],
    techStack: ['Python', 'Django 5', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'Published',
    pinned: false,
    githubUrl: 'https://github.com/enterprise/project',
    liveDemoUrl: 'https://demo.enterprise.com',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    authentication: 'JWT + OAuth2 + RBAC',
    architectureDescription: 'High-throughput microservices layout with Celery workers',
    architectureNodes: [
      { id: '1', name: 'Gateway', label: 'Nginx Reverse Proxy', type: 'Gateway', tech: 'Nginx' },
      { id: '2', name: 'API Server', label: 'Django REST API', type: 'Service', tech: 'Django 5.0' },
      { id: '3', name: 'Database', label: 'PostgreSQL Primary Cluster', type: 'Database', tech: 'PostgreSQL 16' },
    ]
  });

  const handleCreate = () => {
    if (!form.title) return;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addProject({
      ...form,
      slug,
      viewsCount: 0,
      likesCount: 0,
    } as Omit<Project, 'id'>);
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    updateProject(id, form);
    setEditingId(null);
  };

  const startEdit = (proj: Project) => {
    setEditingId(proj.id);
    setForm({ ...proj });
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Projects CMS Manager</h2>
          <p className="text-xs text-slate-500">Create & manage architectural case studies, system node diagrams, draft status, and featured pins.</p>
        </div>

        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Add Case Study
        </button>
      </div>

      {/* Add / Edit Form Modal Card */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAdding ? 'Create Case Study' : 'Edit Case Study Details'}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="FinTech SaaS">FinTech SaaS</option>
                <option value="AI / LLM Orchestration">AI / LLM Orchestration</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Executive Summary</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Problem Statement</label>
              <textarea
                rows={3}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Architectural Solution</label>
              <textarea
                rows={3}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">GitHub Repo URL</label>
              <input
                type="text"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Demo URL</label>
              <input
                type="text"
                value={form.liveDemoUrl}
                onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Pinned Project
            </label>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Status:</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => isAdding ? handleCreate() : handleUpdate(editingId!)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save Project
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase">
                  {proj.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    proj.status === 'Published' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                  }`}>
                    {proj.status}
                  </span>
                  {proj.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {proj.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {proj.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveProjectModal(proj)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Case Study
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(proj)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
