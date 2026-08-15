import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Search, X, Folder, BookOpen, Cpu, Sparkles, Briefcase, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    projects,
    blogs,
    techStack,
    skills,
    experiences,
    setActiveProjectModal,
    setActiveBlogModal
  } = useCMS();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingProjects = q ? projects.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.techStack.some(t => t.toLowerCase().includes(q))
  ) : [];

  const matchingBlogs = q ? blogs.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.excerpt.toLowerCase().includes(q) ||
    b.tags.some(t => t.toLowerCase().includes(q))
  ) : [];

  const matchingTech = q ? techStack.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  ) : [];

  const matchingExperiences = q ? experiences.filter(e =>
    e.company.toLowerCase().includes(q) ||
    e.position.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q)
  ) : [];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsSearchOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800 py-3">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, architecture blogs, tech stack, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!query && (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Global Search active</p>
              <p>Type keywords like <span className="font-mono text-indigo-500">Django</span>, <span className="font-mono text-indigo-500">FastAPI</span>, or <span className="font-mono text-indigo-500">PostgreSQL</span></p>
            </div>
          )}

          {/* Projects */}
          {matchingProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Folder className="w-4 h-4 text-indigo-500" />
                Projects & Case Studies ({matchingProjects.length})
              </div>
              <div className="space-y-1.5">
                {matchingProjects.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectModal(proj);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {proj.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blogs */}
          {matchingBlogs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Blog Publications ({matchingBlogs.length})
              </div>
              <div className="space-y-1.5">
                {matchingBlogs.map(blog => (
                  <button
                    key={blog.id}
                    onClick={() => {
                      setActiveBlogModal(blog);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {blog.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {blog.excerpt}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {matchingTech.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                Tech Stack ({matchingTech.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {matchingTech.map(t => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{t.name}</span>
                    <span className="text-[10px] text-indigo-500 font-mono">{t.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiences */}
          {matchingExperiences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                Career History ({matchingExperiences.length})
              </div>
              <div className="space-y-1.5">
                {matchingExperiences.map(exp => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="font-bold text-slate-900 dark:text-white">{exp.position} @ {exp.company}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{exp.duration} • {exp.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && !matchingProjects.length && !matchingBlogs.length && !matchingTech.length && !matchingExperiences.length && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No results found for "<span className="font-semibold text-slate-600 dark:text-slate-200">{query}</span>".
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Press <kbd className="px-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">ESC</kbd> to close</span>
          <span>Enterprise Search Engine</span>
        </div>
      </div>
    </div>
  );
};
