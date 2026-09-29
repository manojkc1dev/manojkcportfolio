import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Edit3,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import type { ResumeDocument, AtsIssue } from '../../../../lib/resume/schema';
import { runAtsAudit } from '../../../../lib/resume/ats/rules';
import { AtsScoreRadial } from './AtsScoreRadial';
import { AtsIssueList } from './AtsIssueList';
import { KeywordMatcher } from './KeywordMatcher';

interface AtsCheckPageProps {
  resume: ResumeDocument;
  onUpdateResume: (updated: ResumeDocument) => void;
  onFixNow: (issue: AtsIssue) => void;
  onShowToast: (message: string) => void;
}

export const AtsCheckPage: React.FC<AtsCheckPageProps> = ({
  resume,
  onUpdateResume,
  onFixNow,
  onShowToast,
}) => {
  const [targetRole, setTargetRole] = useState(resume.targetRole || 'Backend Engineer');
  const [customKeywords, setCustomKeywords] = useState<string[] | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const audit = runAtsAudit(resume.content, targetRole, customKeywords);
  const breakdown = audit.breakdown;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onUpdateResume({
        ...resume,
        atsScore: audit.score,
        atsIssues: audit.issues,
        atsBreakdown: audit.breakdown,
        targetRole,
      });
      setIsRefreshing(false);
      onShowToast('ATS Audit recalculated successfully.');
    }, 300);
  };

  const handleAddKeywordToSkills = (keyword: string) => {
    const updatedSections = [...resume.content.sections];
    let skillsSec = updatedSections.find((s) => s.type === 'skills');
    if (!skillsSec) {
      skillsSec = {
        id: `sec-skills-${Date.now()}`,
        type: 'skills',
        title: 'Technical Skills',
        visible: true,
        order: updatedSections.length,
        entries: [],
      };
      updatedSections.push(skillsSec);
    }

    if (skillsSec.entries.length === 0) {
      skillsSec.entries.push({
        id: `entry-skills-${Date.now()}`,
        title: 'Core Technologies',
        bullets: [keyword],
        visible: true,
      });
    } else {
      const topEntry = skillsSec.entries[0];
      const existing = (topEntry.bullets || []).join(', ');
      topEntry.bullets = [`${existing}, ${keyword}`.replace(/^,\s*/, '')];
    }

    const updated = {
      ...resume,
      content: {
        ...resume.content,
        sections: updatedSections,
      },
    };
    onUpdateResume(updated);
    onShowToast(`Added "${keyword}" to Technical Skills.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              ATS Compliance &amp; Parsing Audit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Simulates screening algorithms used by Fortune 500 applicant tracking systems (Workday, Greenhouse, Lever, Taleo, iCIMS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-run Audit</span>
          </button>
        </div>
      </div>

      {/* Main Score Overview & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Radial Score Card (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col items-center justify-center text-center">
          <AtsScoreRadial score={audit.score} size={170} />

          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {audit.score >= 85
                ? 'High-Match Candidate'
                : audit.score >= 70
                ? 'Competitive Profile'
                : 'High Rejection Risk'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
              {audit.score >= 85
                ? 'Your resume passes single-column parsing, keyword filters, and metrics benchmarks.'
                : 'Resolve critical errors and add quantified impact metrics to elevate your match score.'}
            </p>
          </div>
        </div>

        {/* Weighted Category Breakdown (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Category Breakdown &amp; Scoring Weights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { label: 'Action Verbs in Bullets', score: breakdown.actionVerbs, max: 20, desc: 'Past-tense power verbs, zero first-person pronouns' },
              { label: 'Quantified Achievements', score: breakdown.quantifiedAchievements, max: 20, desc: 'Measurable numbers, %, latency reduction, scale' },
              { label: 'Target Role Keyword Density', score: breakdown.keywordDensity, max: 15, desc: 'Matches target role requirements' },
              { label: 'Section Presence', score: breakdown.sectionPresence, max: 15, desc: 'Experience, Education, Skills, and Projects' },
              { label: 'Contact Completeness', score: breakdown.contactCompleteness, max: 10, desc: 'Verified name, email, phone, location' },
              { label: 'Formatting Safety', score: breakdown.formattingSafety, max: 10, desc: 'Standard titles, no emojis or corrupting tabs' },
              { label: 'Length & Word Density', score: breakdown.lengthAppropriateness, max: 10, desc: '40-120 word summary, >=3 bullets in latest role' },
            ].map((cat) => {
              const pct = Math.round((cat.score / cat.max) * 100);
              const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <div key={cat.label} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {cat.label}
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {cat.score}/{cat.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {cat.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Role & Keyword Density Analyzer */}
      <KeywordMatcher
        currentTargetRole={targetRole}
        matchedKeywords={audit.matchedKeywords}
        missingKeywords={audit.missingKeywords}
        onSelectPresetRole={(role) => setTargetRole(role)}
        onCustomJdChange={(kws) => setCustomKeywords(kws)}
        onAddKeywordToSkills={handleAddKeywordToSkills}
      />

      {/* Issues List with Fix Hints and Deep-Link */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Actionable Fixes &amp; Audit Issues ({audit.issues.length})
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Click &quot;Fix now&quot; on any recommendation to navigate straight to the relevant editor section.
            </p>
          </div>
        </div>

        <AtsIssueList issues={audit.issues} onFixNow={onFixNow} />
      </div>
    </div>
  );
};
