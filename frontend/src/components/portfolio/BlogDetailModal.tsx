import React, { useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Calendar, Clock, Tag, User, BookOpen, Share2 } from 'lucide-react';

export const BlogDetailModal: React.FC = () => {
  const { activeBlogModal, setActiveBlogModal, hero } = useCMS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveBlogModal(null);
      }
    };
    if (activeBlogModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBlogModal, setActiveBlogModal]);

  if (!activeBlogModal) return null;

  const blog = activeBlogModal;

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveBlogModal(null);
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
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cover Header */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            type="button"
            aria-label="Close Article"
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white border border-slate-700 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="absolute bottom-6 left-6 right-16">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white uppercase tracking-wider mb-2 inline-block">
              {blog.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {blog.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                {blog.authorName || hero.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-mono font-medium">
              <Clock className="w-3.5 h-3.5" />
              {blog.readingTimeMinutes} min read
            </div>
          </div>

          {/* Article Excerpt */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 italic">
            "{blog.excerpt}"
          </div>

          {/* Article Content / Markdown View */}
          <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 font-sans whitespace-pre-line">
            {blog.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" /> Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Slug: {blog.slug}</span>
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
};
