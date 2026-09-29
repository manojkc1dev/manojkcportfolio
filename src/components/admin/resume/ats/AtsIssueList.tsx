import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { AtsIssue } from '../../../../lib/resume/schema';
import { AtsIssueCard } from './AtsIssueCard';

interface AtsIssueListProps {
  issues: AtsIssue[];
  onFixNow?: (issue: AtsIssue) => void;
}

export const AtsIssueList: React.FC<AtsIssueListProps> = ({ issues = [], onFixNow }) => {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  if (issues.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2.5" />
        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          Zero ATS Compliance Issues Found
        </h3>
        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
          Your resume conforms to modern ATS parsing standards, featuring clean single-column semantic markup, strong action-verb driven bullet points, and quantified engineering achievements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Errors Group */}
      {errors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-rose-200 dark:border-rose-900/60">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Critical Errors ({errors.length}) — Will Trigger ATS Rejection
            </h3>
          </div>
          <ul role="list" className="space-y-2.5">
            {errors.map((issue, idx) => (
              <li key={`err-${idx}`}>
                <AtsIssueCard issue={issue} onFixNow={onFixNow} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. Warnings Group */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-amber-200 dark:border-amber-900/60">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Warnings ({warnings.length}) — Reduces Candidate Match Rate
            </h3>
          </div>
          <ul role="list" className="space-y-2.5">
            {warnings.map((issue, idx) => (
              <li key={`warn-${idx}`}>
                <AtsIssueCard issue={issue} onFixNow={onFixNow} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Info Group */}
      {infos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-blue-200 dark:border-blue-900/60">
            <Info className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Suggestions &amp; Polish ({infos.length}) — Recommended Improvements
            </h3>
          </div>
          <ul role="list" className="space-y-2.5">
            {infos.map((issue, idx) => (
              <li key={`info-${idx}`}>
                <AtsIssueCard issue={issue} onFixNow={onFixNow} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
