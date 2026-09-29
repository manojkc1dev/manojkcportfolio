import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Trash2,
  Globe,
  EyeOff,
  Calendar,
  HardDrive,
  BarChart2,
} from 'lucide-react';
import { ResumeVersion } from '../../../lib/admin/resumeTypes';
import { formatBytes } from '../../../lib/admin/formatBytes';
import { formatRelativeTime } from '../../../lib/admin/relativeTime';
import { StatusPill } from './StatusPill';
import { ConfirmInline } from './ConfirmInline';

interface VersionHistoryCardProps {
  version: ResumeVersion;
  isSelectedForCompare: boolean;
  onToggleCompare: (version: ResumeVersion) => void;
  onSetActive: (version: ResumeVersion) => void;
  onTogglePublic: (version: ResumeVersion, isPublic: boolean) => void;
  onDownload: (version: ResumeVersion) => void;
  onDelete: (version: ResumeVersion) => void;
}

export const VersionHistoryCard: React.FC<VersionHistoryCardProps> = ({
  version,
  isSelectedForCompare,
  onToggleCompare,
  onSetActive,
  onTogglePublic,
  onDownload,
  onDelete,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <article
      aria-label={`${version.label} version details`}
      className={`p-4 rounded-xl border transition-all ${
        version.isActive
          ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelectedForCompare}
            onChange={() => onToggleCompare(version)}
            aria-label={`Select ${version.label} for metadata comparison`}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>{version.label}</span>
              {version.isActive && <StatusPill variant="active" />}
            </h4>
            <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
              {version.fileName}
            </p>
          </div>
        </div>

        <StatusPill variant={version.isPublic ? 'public' : 'private'} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 py-2 border-y border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <span>{formatRelativeTime(version.uploadedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-neutral-400" />
          <span>{formatBytes(version.fileSizeBytes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart2 className="w-3 h-3 text-neutral-400" />
          <span>{version.downloadCount} dl</span>
        </div>
      </div>

      {isConfirmingDelete ? (
        <div className="mt-3">
          <ConfirmInline
            onConfirm={() => {
              setIsConfirmingDelete(false);
              onDelete(version);
            }}
            onCancel={() => setIsConfirmingDelete(false)}
          />
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDownload(version)}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              aria-label={`Download ${version.label}`}
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {!version.isActive && (
              <button
                type="button"
                onClick={() => onSetActive(version)}
                className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-[11px] font-medium"
              >
                Set active
              </button>
            )}

            <button
              type="button"
              onClick={() => onTogglePublic(version, !version.isPublic)}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              aria-label={`Toggle public access for ${version.label}`}
              title={version.isPublic ? 'Make Private' : 'Make Public'}
            >
              {version.isPublic ? <Globe className="w-3.5 h-3.5 text-blue-500" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
            </button>
          </div>

          {!version.isActive && (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              aria-label={`Delete ${version.label}`}
              title="Delete version"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </article>
  );
};
