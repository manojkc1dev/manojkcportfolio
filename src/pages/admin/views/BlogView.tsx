import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import type { AdminArticle } from '../types';
import { BlogEditModal } from './BlogEditModal';

interface BlogViewProps {
  articles: AdminArticle[];
  onUpdateArticles: (articles: AdminArticle[]) => void;
  onShowToast: (message: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  articles,
  onUpdateArticles,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null | undefined>(undefined);

  const categories = ['all', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleToggleFeatured = (id: string) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a));
    onUpdateArticles(updated);
    onShowToast('Article sticky showcase status updated.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const updated = articles.filter((a) => a.id !== id);
      onUpdateArticles(updated);
      onShowToast('Article deleted successfully.');
    }
  };

  const handleSaveArticle = (savedArticle: AdminArticle) => {
    const exists = articles.some((a) => a.id === savedArticle.id);
    let updated: AdminArticle[];
    if (exists) {
      updated = articles.map((a) => (a.id === savedArticle.id ? savedArticle : a));
      onShowToast('Article updated successfully.');
    } else {
      updated = [savedArticle, ...articles];
      onShowToast('New article published.');
    }
    onUpdateArticles(updated);
    setEditingArticle(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Engineering Blog & Insights CMS
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Draft, format, and publish technical insights, system architecture deep-dives, and company news.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingArticle(null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Article</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-neutral-500">
                    No matching articles found.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {article.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 line-clamp-1">
                          {article.excerpt}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          /blog/{article.slug}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {article.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">
                      {article.date}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          article.visibility === 'Published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {article.visibility === 'Published' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{article.visibility}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(article.id)}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title={article.featured ? 'Featured sticky article' : 'Not featured'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            article.featured
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingArticle(article)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingArticle !== undefined && (
        <BlogEditModal
          article={editingArticle}
          onSave={handleSaveArticle}
          onClose={() => setEditingArticle(undefined)}
        />
      )}
    </div>
  );
};
