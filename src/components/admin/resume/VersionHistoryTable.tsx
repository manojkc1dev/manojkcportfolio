import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  CheckCircle2,
  Trash2,
  Globe,
  EyeOff,
  GitCompare,
  ArrowUpDown,
  Filter,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { ResumeVersion, ResumeVersionType, VersionComparisonDelta } from '../../../lib/admin/resumeTypes';
import { formatBytes } from '../../../lib/admin/formatBytes';
import { formatRelativeTime } from '../../../lib/admin/relativeTime';
import { StatusPill } from './StatusPill';
import { ConfirmInline } from './ConfirmInline';
import { VersionHistoryCard } from './VersionHistoryCard';

interface VersionHistoryTableProps {
  versions: ResumeVersion[];
  type: ResumeVersionType;
  onSetActive: (version: ResumeVersion) => Promise<void>;
  onTogglePublic: (version: ResumeVersion, isPublic: boolean) => Promise<void>;
  onDownload: (version: ResumeVersion) => void;
  onDelete: (version: ResumeVersion) => Promise<void>;
  onUploadClick: () => void;
}

const PAGE_SIZE = 10;

export const VersionHistoryTable: React.FC<VersionHistoryTableProps> = ({
  versions,
  type,
  onSetActive,
  onTogglePublic,
  onDownload,
  onDelete,
  onUploadClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const typeDisplay = type === 'resume' ? 'Resume' : 'CV';

  // Filter & Sort: newest first
  const filteredVersions = useMemo(() => {
    return versions
      .filter((v) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          v.label.toLowerCase().includes(q) ||
          v.fileName.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
  }, [versions, searchTerm]);

  const pagedVersions = useMemo(() => {
    return filteredVersions.slice(0, visibleCount);
  }, [filteredVersions, visibleCount]);

  const hasMore = visibleCount < filteredVersions.length;

  const handleToggleCompare = (version: ResumeVersion) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(version.versionId)) {
        return prev.filter((id) => id !== version.versionId);
      }
      if (prev.length >= 2) {
        // Keep the second one and add the new one
        return [prev[1], version.versionId];
      }
      return [...prev, version.versionId];
    });
  };

  // Compute comparison delta
  const comparisonDelta: VersionComparisonDelta | null = useMemo(() => {
    if (selectedForCompare.length !== 2) return null;
    const v1 = versions.find((v) => v.versionId === selectedForCompare[0]);
    const v2 = versions.find((v) => v.versionId === selectedForCompare[1]);
    if (!v1 || !v2) return null;

    // v1 is older or newer
    const [newer, older] = v1.uploadedAt >= v2.uploadedAt ? [v1, v2] : [v2, v1];
    const sizeDiffBytes = newer.fileSizeBytes - older.fileSizeBytes;
    const downloadDiff = newer.downloadCount - older.downloadCount;
    const timeDiffDays = Math.round(
      Math.abs(newer.uploadedAt - older.uploadedAt) / (1000 * 60 * 60 * 24)
    );

    return {
      v1: newer,
      v2: older,
      sizeDiffBytes,
      sizeDiffFormatted: `${sizeDiffBytes >= 0 ? '+' : ''}${formatBytes(sizeDiffBytes)}`,
      downloadDiff,
      timeDiffDays,
    };
  }, [selectedForCompare, versions]);

  if (versions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          No {typeDisplay} Uploaded Yet
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          Upload your first version to make it available at{' '}
          <span className="font-mono text-neutral-700 dark:text-neutral-300">
            manojkc1.com.np/{type}.pdf
          </span>.
        </p>
        <button
          type="button"
          onClick={onUploadClick}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <span>Upload First {typeDisplay}</span>
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="history-heading" className="space-y-4">
      {/* Header Bar: Search, Stats, & Compare trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="history-heading" className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
            Version History
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {filteredVersions.length} {filteredVersions.length === 1 ? 'version' : 'versions'} archived
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Comparison Action */}
          {selectedForCompare.length === 2 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(!showCompareModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Selected (2)</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search versions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filter versions by label or file name"
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Comparison Drawer / Summary Card */}
      {comparisonDelta && showCompareModal && (
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-neutral-800 dark:text-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Metadata Comparison: {comparisonDelta.v1.label} vs {comparisonDelta.v2.label}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCompareModal(false)}
              className="p-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-neutral-500"
              aria-label="Close comparison view"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-indigo-100 dark:border-indigo-900/60">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">File Size Delta</span>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                {comparisonDelta.sizeDiffFormatted}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {formatBytes(comparisonDelta.v1.fileSizeBytes)} vs {formatBytes(comparisonDelta.v2.fileSizeBytes)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-indigo-100 dark:border-indigo-900/60">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Downloads Delta</span>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                {comparisonDelta.downloadDiff >= 0 ? `+${comparisonDelta.downloadDiff}` : comparisonDelta.downloadDiff}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {comparisonDelta.v1.downloadCount} vs {comparisonDelta.v2.downloadCount} downloads
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-indigo-100 dark:border-indigo-900/60">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Release Gap</span>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                {comparisonDelta.timeDiffDays} days
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                Separation between releases
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <caption className="sr-only">Resume and CV Version History Table</caption>
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 font-semibold">
              <th scope="col" className="w-10 px-4 py-3 text-center">
                <span className="sr-only">Select for comparison</span>
              </th>
              <th scope="col" className="px-4 py-3">Label & File</th>
              <th scope="col" className="px-4 py-3">Type</th>
              <th scope="col" className="px-4 py-3">Uploaded</th>
              <th scope="col" className="px-4 py-3">Size</th>
              <th scope="col" className="px-4 py-3">Downloads</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {pagedVersions.map((v) => {
              const isSelected = selectedForCompare.includes(v.versionId);
              const isDeleting = deletingId === v.versionId;

              return (
                <tr
                  key={v.versionId}
                  className={`hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors ${
                    v.isActive ? 'bg-indigo-50/15 dark:bg-indigo-950/15' : ''
                  }`}
                >
                  {/* Select for comparison */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCompare(v)}
                      aria-label={`Select ${v.label} for metadata comparison`}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>

                  {/* Label & Filename */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {v.label}
                      </span>
                      {v.isActive && <StatusPill variant="active" />}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                      {v.fileName}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {v.type}
                    </span>
                  </td>

                  {/* Uploaded */}
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {formatRelativeTime(v.uploadedAt)}
                  </td>

                  {/* Size */}
                  <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {formatBytes(v.fileSizeBytes)}
                  </td>

                  {/* Downloads */}
                  <td className="px-4 py-3 text-neutral-900 dark:text-white font-medium whitespace-nowrap">
                    <span title="Total downloads since upload">{v.downloadCount.toLocaleString()}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {isDeleting ? (
                      <div className="flex justify-end">
                        <ConfirmInline
                          onConfirm={async () => {
                            setDeletingId(null);
                            await onDelete(v);
                          }}
                          onCancel={() => setDeletingId(null)}
                        />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Download button */}
                        <button
                          type="button"
                          onClick={() => onDownload(v)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                          aria-label={`Download ${v.label}`}
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Set Active button */}
                        {!v.isActive ? (
                          <button
                            type="button"
                            onClick={() => onSetActive(v)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer text-xs"
                          >
                            Set active
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        )}

                        {/* Make Public toggle */}
                        <button
                          type="button"
                          onClick={() => onTogglePublic(v, !v.isPublic)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                          aria-label={`Toggle public visibility for ${v.label}`}
                          title={v.isPublic ? 'Publicly accessible (click to make private)' : 'Private (click to make public)'}
                        >
                          {v.isPublic ? (
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                        </button>

                        {/* Delete button (disabled if active) */}
                        <button
                          type="button"
                          disabled={v.isActive}
                          onClick={() => setDeletingId(v.versionId)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                          aria-label={v.isActive ? 'Active version cannot be deleted' : `Delete ${v.label}`}
                          title={v.isActive ? 'Active version cannot be deleted' : 'Delete version'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Screen < md) */}
      <div className="md:hidden space-y-3">
        {pagedVersions.map((v) => (
          <VersionHistoryCard
            key={v.versionId}
            version={v}
            isSelectedForCompare={selectedForCompare.includes(v.versionId)}
            onToggleCompare={handleToggleCompare}
            onSetActive={onSetActive}
            onTogglePublic={onTogglePublic}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Load More Pagination */}
      {hasMore && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Load More Versions ({filteredVersions.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
};
