import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BlogPost } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Eye, BookOpen, Clock, Tag } from 'lucide-react';

export const BlogManager: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog, setActiveBlogModal } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'System Architecture',
    excerpt: '',
    content: '',
    readingTimeMinutes: 8,
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    tags: ['django', 'python', 'architecture'],
    status: 'Published',
    authorName: 'Manoj Khatri',
  });

  const handleCreate = () => {
    if (!form.title) return;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addBlog({
      ...form,
      slug,
      publishedAt: new Date().toISOString(),
    } as Omit<BlogPost, 'id'>);
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    updateBlog(id, form);
    setEditingId(null);
  };

  const startEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({ ...blog });
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Blog CMS Manager</h2>
          <p className="text-xs text-slate-500">Publish architectural whitepapers, reading time calculations, tags, and status toggles.</p>
        </div>

        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Create Article
        </button>
      </div>

      {/* Add / Edit Article */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAdding ? 'Write New Whitepaper' : 'Edit Article Content'}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Article Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Article Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Content (Markdown Supported)</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="flex gap-2">
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
                <Save className="w-3.5 h-3.5" /> Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
          >
            <div
              onClick={() => setActiveBlogModal(b)}
              className="space-y-1 cursor-pointer flex-1"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  {b.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {b.readingTimeMinutes} min read
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  b.status === 'Published' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                }`}>
                  {b.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {b.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {b.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveBlogModal(b)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-indigo-200 dark:border-indigo-800 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Read Article
              </button>
              <button
                type="button"
                onClick={() => startEdit(b)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                title="Edit Article"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deleteBlog(b.id)}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 cursor-pointer"
                title="Delete Article"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
