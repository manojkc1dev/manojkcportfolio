import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import type { AtsIssue } from '../../../../lib/resume/schema';

interface AtsIssueCardProps {
  issue: AtsIssue;
  onFixNow?: (issue: AtsIssue) => void;
}

export const AtsIssueCard: React.FC<AtsIssueCardProps> = ({ issue, onFixNow }) => {
  const isError = issue.severity === 'error';
  const isWarning = issue.severity === 'warning';

  const severityBadge = (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        isError
          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          : isWarning
          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      }`}
    >
      {issue.severity}
    </span>
  );

  const IconComponent = isError ? AlertCircle : isWarning ? AlertTriangle : Info;
  const iconColor = isError ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-blue-500';

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {severityBadge}
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Section: {issue.section}
              </span>
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              {issue.message}
            </h4>
          </div>
        </div>

        {onFixNow && (
          <button
            type="button"
            onClick={() => onFixNow(issue)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shrink-0 cursor-pointer"
          >
            <span>Fix now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="ml-6.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">How to fix: </span>
        {issue.fixHint}
      </div>
    </div>
  );
};
