import React, { useState } from 'react';
import {
  Plus,
  UploadCloud,
  FileText,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import type { ResumeDocument, ResumeType, ResumeTheme, ResumeContent } from '../../../../lib/resume/schema';
import { createDefaultResume, generateId } from '../../../../lib/resume/schema';
import { ResumeCard } from './ResumeCard';
import { NewResumeDialog } from './NewResumeDialog';
import { ImportDialog } from './ImportDialog';

interface ResumeLibraryProps {
  resumes: ResumeDocument[];
  onSelectResume: (resume: ResumeDocument) => void;
  onExportResume: (resume: ResumeDocument) => void;
  onSetActive: (resume: ResumeDocument) => void;
  onDuplicate: (resume: ResumeDocument) => void;
  onTogglePublic: (resume: ResumeDocument) => void;
  onDelete: (resume: ResumeDocument) => void;
  onCreateNew: (options: {
    type: ResumeType;
    variant: string;
    title: string;
    theme: ResumeTheme;
  }) => void;
  onImportResume: (content: ResumeContent, fileType: ResumeType, filename: string) => void;
}

export const ResumeLibrary: React.FC<ResumeLibraryProps> = ({
  resumes = [],
  onSelectResume,
  onExportResume,
  onSetActive,
  onDuplicate,
  onTogglePublic,
  onDelete,
  onCreateNew,
  onImportResume,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'resume' | 'cv'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newDialogType, setNewDialogType] = useState<ResumeType>('resume');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const filteredResumes = resumes.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const variantMatch = (r.variant || '').toLowerCase().includes(q);
      const titleMatch = (r.content?.header?.title || '').toLowerCase().includes(q);
      const nameMatch = (r.content?.header?.name || '').toLowerCase().includes(q);
      return variantMatch || titleMatch || nameMatch;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search variants or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'resume', 'cv'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer uppercase text-[11px] ${
                  filterType === t
                    ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setImportDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-neutral-500" />
            <span>Import PDF / DOCX</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewDialogType('resume');
              setNewDialogOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Resume</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewDialogType('cv');
              setNewDialogOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New CV</span>
          </button>
        </div>
      </div>

      {/* Grid of Resume Cards */}
      {filteredResumes.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
          <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            No resume variants found
          </h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `No resumes matched "${searchQuery}". Clear your search query or create a new tailored variant.`
              : 'Create your first structured ATS resume or import an existing PDF/DOCX to get started.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNewDialogType('resume');
                setNewDialogOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-xs"
            >
              + Create First Resume
            </button>
            <button
              type="button"
              onClick={() => setImportDialogOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Import PDF / Word
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map((resume) => (
            <ResumeCard
              key={resume.resumeId}
              resume={resume}
              onEdit={onSelectResume}
              onExport={onExportResume}
              onSetActive={onSetActive}
              onDuplicate={onDuplicate}
              onTogglePublic={onTogglePublic}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <NewResumeDialog
        isOpen={newDialogOpen}
        initialType={newDialogType}
        onClose={() => setNewDialogOpen(false)}
        onCreate={onCreateNew}
      />

      <ImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onConfirmImport={onImportResume}
      />
    </div>
  );
};
