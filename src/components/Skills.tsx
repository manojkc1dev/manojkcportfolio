import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Server,
  Cpu,
  Code,
  FileCode2,
  Atom,
  Database,
  DatabaseBackup,
  Workflow,
  Gauge,
  Layers,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Network,
  GitBranch,
  GitMerge,
  Container,
  Flame,
  Cloud,
  Layout,
  Palette,
  Boxes,
  Zap,
  HardDrive,
  Sparkles,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { skillGroups as defaultSkillGroups, currentFocus as defaultFocus } from '../data/skills';
import { ViewAllLink } from './ui/ViewAllLink';
import type { SkillGroup, SkillItem } from '../types';

const skillIconsMap: Record<string, React.ElementType> = {
  Terminal,
  Server,
  Cpu,
  Code,
  FileCode2,
  Atom,
  Database,
  DatabaseBackup,
  Workflow,
  Gauge,
  Layers,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Network,
  GitBranch,
  GitMerge,
  Container,
  Flame,
  Cloud,
  Layout,
  Palette,
  Boxes,
  Zap,
  HardDrive,
  Sparkles,
  Wrench,
};

const proficiencyConfig: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  Advanced: {
    label: 'Advanced',
    badgeClass:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  advanced: {
    label: 'Advanced',
    badgeClass:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
  },
  Intermediate: {
    label: 'Intermediate',
    badgeClass:
      'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800',
    dotClass: 'bg-indigo-500',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass:
      'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800',
    dotClass: 'bg-indigo-500',
  },
  Learning: {
    label: 'Learning',
    badgeClass:
      'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
  learning: {
    label: 'Learning',
    badgeClass:
      'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800',
    dotClass: 'bg-amber-500',
  },
};

interface SkillPillProps {
  skill: SkillItem;
}

const SkillPill: React.FC<SkillPillProps> = ({ skill }) => {
  const Icon = (skill.iconName && skillIconsMap[skill.iconName]) || Code;
  const proficiencyKey = skill.level || skill.proficiency || 'Intermediate';
  const config = proficiencyConfig[proficiencyKey] || proficiencyConfig.Intermediate;

  return (
    <div
      className="relative group inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-neutral-50/80 dark:bg-neutral-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-neutral-800 dark:text-neutral-200 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition-colors duration-150 cursor-default select-none shrink-0"
    >
      <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      </span>

      <span className="font-medium whitespace-nowrap">
        {skill.name}
      </span>

      {/* Subtle indicator dot matching proficiency */}
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass} opacity-60 group-hover:opacity-100 transition-opacity`}
        aria-hidden="true"
      />

      {/* Floating non-shifting Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium tracking-tight text-white bg-neutral-900 dark:bg-neutral-800 border border-neutral-700/80 shadow-md whitespace-nowrap z-30 transition-opacity duration-150"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
        <span className="font-semibold text-neutral-100">{config.label}</span>
        {skill.years ? (
          <span className="text-neutral-400 text-[10px]">· {skill.years}+ yrs</span>
        ) : null}
        {/* Tooltip caret arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
      </div>
    </div>
  );
};

export const Skills: React.FC = () => {
  const navigate = useNavigate();
  const [dataVersion, setDataVersion] = useState(0);

  // Re-read storage dynamically when admin saves changes in the CMS
  useEffect(() => {
    const handleUpdate = () => setDataVersion((v) => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, []);

  const focusItems = useMemo<SkillItem[]>(() => {
    try {
      const savedFocus = localStorage.getItem('portfolio_current_focus');
      if (savedFocus) {
        const parsed = JSON.parse(savedFocus);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Current focus load error:', e);
    }
    return defaultFocus;
  }, [dataVersion]);

  const allSkillGroups = useMemo<SkillGroup[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((g: any, idx: number) => ({
            id: g.id || `group-${idx}`,
            title: g.title || g.category || 'Competencies',
            category: g.category || g.title,
            description: g.description || '',
            skills: Array.isArray(g.skills) ? g.skills : [],
          }));
        }
      }
    } catch (e) {
      console.warn('Skills load error:', e);
    }
    return defaultSkillGroups;
  }, [dataVersion]);

  const totalSkillsCount = useMemo(() => {
    return allSkillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  }, [allSkillGroups]);

  // 1 : 3 : 3 layout (1 focus banner + 3 in row 1 + 3 in row 2 = 6 groups previewed)
  const rowOneGroups = useMemo(() => allSkillGroups.slice(0, 3), [allSkillGroups]);
  const rowTwoGroups = useMemo(() => allSkillGroups.slice(3, 6), [allSkillGroups]);

  return (
    <section
      id="skills"
      aria-label="Skills and Technologies"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Row with Left Eyebrow/Title/Subtitle and Right 'View All' Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-3 font-mono uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              <span>Technical Stack (1:3:3 Showcase)</span>
            </div>
            <h2
              id="skills-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
            >
              Skills &amp; Tooling
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Core technologies, architectural patterns, and engineering capabilities.
            </p>
          </div>

          <div className="shrink-0">
            <ViewAllLink
              to="/skills"
              label="View All Skills"
              count={totalSkillsCount}
            />
          </div>
        </div>

        {/* 1. Current Engineering Focus Banner (Hero Spotlight: 1) */}
        <motion.div
          id="current-focus-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-indigo-200/70 dark:border-indigo-900/50 shadow-sm mb-10 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Current Engineering Focus</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Active deep-dive architectures, asynchronous task queues, and vector storage.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
              <Sparkles className="w-3 h-3" />
              <span>In Active Study</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {focusItems.map((item) => (
              <SkillPill key={item.name} skill={item} />
            ))}
          </div>
        </motion.div>

        {/* 2. Row 1 of 3 Skill Groups (3) */}
        {rowOneGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 items-stretch">
            {rowOneGroups.map((group, groupIdx) => (
              <motion.div
                key={group.id || group.title}
                id={`skills-group-${(group.id || group.title).toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (groupIdx % 3) * 0.1 }}
                className="h-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      {group.title}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {group.skills.length}
                    </span>
                  </div>

                  {group.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed min-h-[32px]">
                      {group.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {group.skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 3. Row 2 of 3 Skill Groups (3) */}
        {rowTwoGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 items-stretch">
            {rowTwoGroups.map((group, groupIdx) => (
              <motion.div
                key={group.id || group.title}
                id={`skills-group-${(group.id || group.title).toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (groupIdx % 3) * 0.1 }}
                className="h-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      {group.title}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {group.skills.length}
                    </span>
                  </div>

                  {group.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed min-h-[32px]">
                      {group.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 items-center">
                  {group.skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Centered Bottom Action: View All Skills (N groups, M total) */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/skills')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 font-semibold text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <span>
              View All Skills ({allSkillGroups.length} groups, {totalSkillsCount} total)
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
