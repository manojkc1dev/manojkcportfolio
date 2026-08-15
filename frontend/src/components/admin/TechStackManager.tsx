import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TechStackItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

export const TechStackManager: React.FC = () => {
  const { techStack, addTechStackItem, updateTechStackItem, deleteTechStackItem } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState<Partial<TechStackItem>>({
    name: '',
    category: 'Framework',
    skillLevel: 90,
    yearsOfExperience: 5,
    officialWebsite: '',
    status: 'Active',
    featured: true,
    showOnHomepage: true,
  });

  const handleCreate = () => {
    if (!form.name) return;
    addTechStackItem(form as Omit<TechStackItem, 'id'>);
    setIsAdding(false);
    setForm({
      name: '',
      category: 'Framework',
      skillLevel: 90,
      yearsOfExperience: 5,
      officialWebsite: '',
      status: 'Active',
      featured: true,
      showOnHomepage: true,
    });
  };

  const handleUpdate = (id: string) => {
    updateTechStackItem(id, form);
    setEditingId(null);
  };

  const startEdit = (item: TechStackItem) => {
    setEditingId(item.id);
    setForm({ ...item });
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Tech Stack CMS</h2>
          <p className="text-xs text-slate-500">Manage frameworks, languages, databases, cloud tools, skill percentages, and experience years.</p>
        </div>

        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Add Tech Item
        </button>
      </div>

      {/* Add / Edit Modal Card */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-indigo-500/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{isAdding ? 'Create New Tech Stack Item' : 'Edit Tech Stack Item'}</span>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Technology Name</label>
              <input
                type="text"
                placeholder="e.g. FastAPI"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <option value="Language">Language</option>
                <option value="Framework">Framework</option>
                <option value="Database">Database</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="Tool">Tool</option>
                <option value="Testing">Testing</option>
                <option value="AI">AI</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skill Level (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={form.skillLevel}
                onChange={(e) => setForm({ ...form, skillLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Years Experience</label>
              <input
                type="number"
                value={form.yearsOfExperience}
                onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Website URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={form.officialWebsite}
                onChange={(e) => setForm({ ...form, officialWebsite: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Featured / Core Tech
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.showOnHomepage}
                onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show on Portfolio Homepage
            </label>
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
              <Save className="w-3.5 h-3.5" /> Save Item
            </button>
          </div>
        </div>
      )}

      {/* Tech Stack List Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Technology</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Skill Level</th>
              <th className="p-3.5">Experience</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {techStack.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  {item.name}
                  {item.featured && <Sparkles className="w-3 h-3 text-amber-500" title="Featured" />}
                </td>
                <td className="p-3.5 font-mono text-indigo-500 font-semibold">{item.category}</td>
                <td className="p-3.5 font-mono">{item.skillLevel}%</td>
                <td className="p-3.5 font-mono">{item.yearsOfExperience} yrs</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTechStackItem(item.id)}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
