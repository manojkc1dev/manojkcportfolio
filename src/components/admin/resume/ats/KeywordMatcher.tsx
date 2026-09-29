import React, { useState } from 'react';
import { Target, Plus, Check, Search, FileText } from 'lucide-react';
import { TARGET_ROLE_PRESETS, extractKeywordsFromText } from '../../../../lib/resume/ats/keywords';

interface KeywordMatcherProps {
  currentTargetRole: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  onSelectPresetRole: (role: string) => void;
  onCustomJdChange: (keywords: string[]) => void;
  onAddKeywordToSkills: (keyword: string) => void;
}

export const KeywordMatcher: React.FC<KeywordMatcherProps> = ({
  currentTargetRole,
  matchedKeywords = [],
  missingKeywords = [],
  onSelectPresetRole,
  onCustomJdChange,
  onAddKeywordToSkills,
}) => {
  const [customJdText, setCustomJdText] = useState('');
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');

  const handleApplyCustomJd = () => {
    if (!customJdText.trim()) return;
    const extracted = extractKeywordsFromText(customJdText);
    onCustomJdChange(extracted);
  };

  const total = matchedKeywords.length + missingKeywords.length;
  const matchPct = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 100;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Target Role &amp; JD Keyword Density
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Applicant Tracking Systems match job descriptions against candidate skills and experience.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              mode === 'preset'
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Role Presets
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              mode === 'custom'
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Paste Job Description
          </button>
        </div>
      </div>

      {mode === 'preset' ? (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Select Standard Engineering Role:
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_ROLE_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => onSelectPresetRole(preset.title)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  currentTargetRole.toLowerCase() === preset.title.toLowerCase()
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Paste Target Job Description (JD) Text:
          </label>
          <textarea
            rows={3}
            value={customJdText}
            onChange={(e) => setCustomJdText(e.target.value)}
            placeholder="Paste recruiter requirements or JD text here to extract keywords..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleApplyCustomJd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Analyze JD Keywords</span>
          </button>
        </div>
      )}

      {/* Match Score Bar */}
      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-neutral-800 dark:text-neutral-200">
            Keyword Match Rate: {matchPct}%
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
            {matchedKeywords.length} matched / {missingKeywords.length} missing
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              matchPct >= 80 ? 'bg-emerald-500' : matchPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${matchPct}%` }}
          />
        </div>
      </div>

      {/* Matched & Missing Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Matched */}
        <div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Found in Resume ({matchedKeywords.length})</span>
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {matchedKeywords.length === 0 ? (
              <span className="text-[11px] text-neutral-400 italic">No matched keywords yet.</span>
            ) : (
              matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  ✓ {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing */}
        <div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">
            Missing Keywords ({missingKeywords.length}) — Click to Add to Skills
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {missingKeywords.length === 0 ? (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                All target keywords are covered!
              </span>
            ) : (
              missingKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => onAddKeywordToSkills(kw)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 hover:border-amber-400 transition-colors cursor-pointer"
                  title={`Add "${kw}" to Technical Skills`}
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{kw}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
