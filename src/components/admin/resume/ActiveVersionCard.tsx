import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Globe,
  EyeOff,
  Calendar,
  User,
  HardDrive,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import { ResumeVersion } from '../../../lib/admin/resumeTypes';
import { formatBytes } from '../../../lib/admin/formatBytes';
import { formatRelativeTime } from '../../../lib/admin/relativeTime';
import { StatusPill } from './StatusPill';

interface ActiveVersionCardProps {
  version: ResumeVersion | null;
  type: 'resume' | 'cv';
  onTogglePublic: (isPublic: boolean) => void;
  onDownload: () => void;
  onReplace: () => void;
  publicUrl: string;
}

export const ActiveVersionCard: React.FC<ActiveVersionCardProps> = ({
  version,
  type,
  onTogglePublic,
  onDownload,
  onReplace,
  publicUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [showStatsSparkline, setShowStatsSparkline] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const typeDisplay = type === 'resume' ? 'Resume' : 'CV';

  if (!version) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
          No Active {typeDisplay} Configured
        </h3>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Upload your first {typeDisplay} PDF below to make it publicly available at{' '}
          <span className="font-mono text-neutral-700 dark:text-neutral-300">
            manojkc1.com.np/{type}.pdf
          </span>.
        </p>
        <button
          type="button"
          onClick={onReplace}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload {typeDisplay}</span>
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="active-version-heading" className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            {typeDisplay}
          </span>
          <StatusPill variant="active" />
          <StatusPill variant={version.isPublic ? 'public' : 'private'} />
        </div>

        {/* Public Download Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Public download
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={version.isPublic}
            aria-label={`Toggle public download for active ${typeDisplay}`}
            onClick={() => onTogglePublic(!version.isPublic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              version.isPublic ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                version.isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Main Details */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <h2 id="active-version-heading" className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{version.label}</span>
            </h2>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {version.fileName}
            </p>
          </div>

          {version.notes && (
            <div className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 italic">
              &ldquo;{version.notes}&rdquo;
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatRelativeTime(version.uploadedAt)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatBytes(version.fileSizeBytes)}</span>
            </div>

            <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate" title={version.uploadedBy}>
                {version.uploadedBy.split('@')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 lg:border-l lg:border-neutral-200 lg:dark:border-neutral-800 lg:pl-6">
          {/* Download Count Card */}
          <div className="relative">
            <div
              onClick={() => setShowStatsSparkline(!showStatsSparkline)}
              className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between cursor-pointer hover:bg-neutral-100/70 dark:hover:bg-neutral-800 transition-colors"
              title="Click to view 7-day download trend"
            >
              <div>
                <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <BarChart2 className="w-3 h-3 text-indigo-500" />
                  <span>Downloads Since Upload</span>
                </div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                  {version.downloadCount.toLocaleString()}
                </div>
              </div>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                {showStatsSparkline ? 'Hide chart' : '7-day trend'}
              </span>
            </div>

            {/* Sparkline Popover */}
            {showStatsSparkline && version.dailyDownloads && (
              <div className="mt-2 p-3 rounded-xl bg-neutral-900 text-white text-xs border border-neutral-700 shadow-xl space-y-2">
                <div className="text-[11px] text-neutral-400 flex justify-between font-mono">
                  <span>Last 7 Days Downloads</span>
                  <span>Total: {version.dailyDownloads.reduce((a, b) => a + b.count, 0)}</span>
                </div>
                <div className="flex items-end gap-1.5 h-14 pt-2">
                  {version.dailyDownloads.map((d, i) => {
                    const max = Math.max(...version.dailyDownloads!.map((x) => x.count), 1);
                    const heightPercent = Math.max(12, Math.round((d.count / max) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t bg-indigo-500 hover:bg-indigo-400 transition-all"
                          title={`${d.date}: ${d.count} downloads`}
                        />
                        <span className="text-[9px] text-neutral-400">{d.date.replace('Day ', 'D')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
              title="Copy public URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy public link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReplace}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
              title={`Upload replacement for this ${typeDisplay}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
