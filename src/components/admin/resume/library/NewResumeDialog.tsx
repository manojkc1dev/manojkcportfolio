import React, { useState } from 'react';
import { X, Sparkles, FileText, Check } from 'lucide-react';
import type { ResumeType, ResumeTheme } from '../../../../lib/resume/schema';

interface NewResumeDialogProps {
  initialType?: ResumeType;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (options: {
    type: ResumeType;
    variant: string;
    title: string;
    theme: ResumeTheme;
  }) => void;
}

export const NewResumeDialog: React.FC<NewResumeDialogProps> = ({
  initialType = 'resume',
  isOpen,
  onClose,
  onCreate,
}) => {
  const [type, setType] = useState<ResumeType>(initialType);
  const [variant, setVariant] = useState(
    initialType === 'cv' ? 'academic-cv' : 'backend-engineer'
  );
  const [title, setTitle] = useState('Backend Software Engineer');
  const [theme, setTheme] = useState<ResumeTheme>('ats-classic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant.trim()) return;
    onCreate({
      type,
      variant: variant.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      theme,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </span>
            <h3 id="dialog-title" className="text-sm font-bold text-neutral-900 dark:text-white">
              Create New {type === 'cv' ? 'Curriculum Vitae (CV)' : 'Resume Variant'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Document Type Selector */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('resume');
                  setVariant('backend-engineer');
                }}
                className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  type === 'resume'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                }`}
              >
                1-2 Page Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('cv');
                  setVariant('systems-architect');
                }}
                className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  type === 'cv'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                }`}
              >
                Comprehensive CV
              </button>
            </div>
          </div>

          {/* Variant Identifier */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Variant Identifier (Slug) *
            </label>
            <input
              type="text"
              required
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g. backend-engineer, django-specialist"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Used internally to tag variants tailored to specific roles or job applications.
            </span>
          </div>

          {/* Target Role Title */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Target Headline Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Backend Software Engineer"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ATS Layout Theme */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              ATS Layout Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ats-classic', label: 'ATS Classic', desc: 'Standard single-column' },
                { id: 'ats-modern', label: 'ATS Modern', desc: 'Crisp Inter sans-serif' },
                { id: 'minimal', label: 'Minimal', desc: 'Ultra-condensed lines' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as ResumeTheme)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="font-bold text-[11px]">{t.label}</div>
                  <div className="text-[9.5px] opacity-75">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs cursor-pointer"
            >
              Create Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
