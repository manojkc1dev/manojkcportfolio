import React from 'react';
import { Download, Copy, ExternalLink, LucideIcon } from 'lucide-react';

interface ExportFormatCardProps {
  title: string;
  extension: string;
  badge?: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  onDownload: () => void;
  onCopy?: () => void;
  onPreview?: () => void;
  publicUrl?: string;
}

export const ExportFormatCard: React.FC<ExportFormatCardProps> = ({
  title,
  extension,
  badge,
  description,
  icon: Icon,
  iconColor,
  onDownload,
  onCopy,
  onPreview,
  publicUrl,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/60 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {title}
                </h4>
                <span className="font-mono text-[10px] text-neutral-400">
                  {extension}
                </span>
              </div>
              {badge && (
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
          {description}
        </p>

        {publicUrl && (
          <div className="mb-4 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="font-mono truncate">{publicUrl}</span>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold ml-2 shrink-0"
            >
              <span>View Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download {extension}</span>
        </button>

        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="py-1.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Preview
          </button>
        )}

        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="py-1.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        )}
      </div>
    </div>
  );
};
