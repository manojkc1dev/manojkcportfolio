import React from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Lock,
} from 'lucide-react';
import type { ResumeDocument } from '../../../../lib/resume/schema';

interface ResumeCardProps {
  resume: ResumeDocument;
  onEdit: (resume: ResumeDocument) => void;
  onExport: (resume: ResumeDocument) => void;
  onSetActive: (resume: ResumeDocument) => void;
  onDuplicate: (resume: ResumeDocument) => void;
  onTogglePublic: (resume: ResumeDocument) => void;
  onDelete: (resume: ResumeDocument) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onEdit,
  onExport,
  onSetActive,
  onDuplicate,
  onTogglePublic,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(resume.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  }, [resume.updatedAt]);

  const atsScore = resume.atsScore ?? 85;
  const scoreBadgeColor =
    atsScore >= 85
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
      : atsScore >= 70
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 bg-white dark:bg-neutral-900 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        resume.isActive
          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      {/* Top Banner / Tags */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {resume.type}
            </span>
            {resume.isActive && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="w-3 h-3" />
                <span>Active Public</span>
              </span>
            )}
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreBadgeColor}`}
            title={`ATS audit score computed at ${atsScore}/100`}
          >
            <Sparkles className="w-3 h-3" />
            <span>ATS: {atsScore}</span>
          </div>
        </div>

        {/* Title & Role */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
          {resume.variant || 'Default Variant'}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {resume.content.header.title || 'Backend Software Engineer'}
        </p>

        {/* Stats summary */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {formattedDate}</span>
          </span>
          <span>
            {resume.content.sections.length} sections • {resume.content.sections.reduce((acc, s) => acc + (s.entries?.length || 0), 0)} entries
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-neutral-50/70 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(resume)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-2xs cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onExport(resume)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Export resume in PDF, Word, HTML, or Text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {!resume.isActive && (
            <button
              type="button"
              onClick={() => onSetActive(resume)}
              className="px-2 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors cursor-pointer"
              title="Set as the active live resume served at /resume.pdf"
            >
              Set Active
            </button>
          )}

          <button
            type="button"
            onClick={() => onTogglePublic(resume)}
            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title={resume.isPublic ? 'Publicly accessible' : 'Private link only'}
          >
            {resume.isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-neutral-400" />}
          </button>

          <button
            type="button"
            onClick={() => onDuplicate(resume)}
            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Duplicate variant"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(resume)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-1 text-[10px] text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
