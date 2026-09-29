import React, { useState } from 'react';
import {
  FileCheck,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Zap,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { ResumeData } from '../types';
import { calculateAtsMetrics, ACTION_VERBS } from './resumeUtils';

interface AtsScannerViewProps {
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  onShowToast: (msg: string) => void;
}

export const AtsScannerView: React.FC<AtsScannerViewProps> = ({
  resumeData,
  onUpdateResumeData,
  onShowToast,
}) => {
  const [jobDescription, setJobDescription] = useState(
    resumeData.customization?.targetJobDescription || ''
  );

  const metrics = calculateAtsMetrics(resumeData, jobDescription);

  const handleSaveJd = (text: string) => {
    setJobDescription(text);
    const updated: ResumeData = {
      ...resumeData,
      customization: {
        ...resumeData.customization,
        targetJobDescription: text,
      },
    };
    onUpdateResumeData(updated);
  };

  const handleAddKeywordToSkills = (keyword: string) => {
    // Find skills section or create one
    const sections = [...resumeData.sections];
    let skillSec = sections.find((s) => s.category === 'skills');

    if (!skillSec) {
      skillSec = {
        id: `sec-${Date.now()}`,
        title: 'Core Technical Competencies',
        category: 'skills',
        items: [],
      };
      sections.push(skillSec);
    }

    // Capitalize keyword for display
    const formattedKw = keyword
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (skillSec.items.length > 0) {
      // Append to first skills category
      const firstItem = { ...skillSec.items[0] };
      firstItem.subtitle = firstItem.subtitle ? `${firstItem.subtitle}, ${formattedKw}` : formattedKw;
      skillSec.items = [firstItem, ...skillSec.items.slice(1)];
    } else {
      skillSec.items = [
        {
          id: `item-${Date.now()}`,
          title: 'Target Tech Stack',
          subtitle: formattedKw,
          description: `Key competency aligned with target job requirements.`,
        },
      ];
    }

    onUpdateResumeData({ ...resumeData, sections });
    onShowToast(`Added "${formattedKw}" to Technical Skills section!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Match Rate & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  ATS Score &amp; Compatibility
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Taleo · Workday · Greenhouse · Lever
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {metrics.score}%
            </span>
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {metrics.score >= 90 ? 'Tier 1 ATS Readiness' : 'Passable ATS Score'}
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {jobDescription.trim() ? `${metrics.jobMatchRate}% match with target JD` : 'Universal parsing ready'}
              </p>
            </div>
          </div>

          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.score}%` }}
            />
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            Engineered to bypass applicant filters by enforcing standard heading tags, chronological periods, and action-oriented STAR bullet structures.
          </div>
        </div>

        {/* Target Job Description Scanner */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Target Job Description (JD) Keyword Matcher
              </h3>
            </div>
            {jobDescription && (
              <button
                type="button"
                onClick={() => handleSaveJd('')}
                className="text-[11px] text-neutral-500 hover:text-rose-500 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear JD</span>
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Paste any job posting text below. The enterprise ATS parser will highlight matched skills and identify missing keywords to boost your interview chances.
          </p>

          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => handleSaveJd(e.target.value)}
            placeholder="Paste LinkedIn, Indeed, or company job description here (e.g., 'Looking for Senior Django Developer with Celery, Redis, Docker, and PostgreSQL experience...')"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />

          {/* Keywords Match Breakdown */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Matched Target Keywords ({metrics.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {metrics.matchedKeywords.length === 0 ? (
                  <span className="text-xs text-neutral-400 italic">No exact keyword matches found yet.</span>
                ) : (
                  metrics.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>{kw}</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {metrics.missingKeywords.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Missing Keywords ({metrics.missingKeywords.length}) — Click to Inject</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {metrics.missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddKeywordToSkills(kw)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Click to automatically add this keyword to your Skills section"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATS Quality Criteria Checklist */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          ATS Architecture &amp; Scan Verification Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {metrics.checks.map((check) => (
            <div
              key={check.id}
              className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {check.title}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-6 leading-relaxed">
                {check.detail}
              </p>
              {!check.passed && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 pl-6 italic">
                  Tip: {check.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Verbs Library */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Executive Action Verb Bank (STAR Method)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              ATS parsers rank resumes higher when experience bullet points lead with strong, measurable power verbs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Architecture &amp; Engineering
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ACTION_VERBS.engineering.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 font-mono text-[11px]"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Performance &amp; Scale
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ACTION_VERBS.performance.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 font-mono text-[11px]"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Leadership &amp; Delivery
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ACTION_VERBS.leadership.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 font-mono text-[11px]"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
