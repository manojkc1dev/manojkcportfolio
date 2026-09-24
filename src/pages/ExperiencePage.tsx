import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { experiences as defaultExperiences, ExperienceType } from '../data/experience';
import { profile } from '../data/profile';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHeader } from '../components/ui/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Seo } from '../components/Seo';
import type { Experience } from '../types';
import {
  Briefcase,
  GraduationCap,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { track } from '../lib/analytics';

type ExpSortOption = 'newest' | 'oldest';

const TYPES: { label: string; value: 'all' | ExperienceType }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Internship & Trainee', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Full-time', value: 'fulltime' },
  { label: 'Education', value: 'education' },
];

function normalizeExpType(exp: Experience): ExperienceType {
  const t = (exp.type || '').toLowerCase();
  if (t.includes('intern') || t.includes('trainee')) return 'internship';
  if (t.includes('freelance') || t.includes('contract')) return 'freelance';
  if (t.includes('full') || t.includes('fulltime')) return 'fulltime';
  if (t.includes('edu') || t.includes('student') || t.includes('degree')) return 'education';
  return 'internship';
}

function calculateDuration(start?: string, end?: string | 'present'): string {
  if (!start) return '';
  const [startYear, startMonth = 1] = start.split('-').map(Number);

  let endYear: number;
  let endMonth: number;

  if (!end || end === 'present') {
    const now = new Date();
    endYear = now.getFullYear();
    endMonth = now.getMonth() + 1;
  } else {
    const parts = end.split('-').map(Number);
    endYear = parts[0];
    endMonth = parts[1] || 12;
  }

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  if (totalMonths <= 0) return '';

  if (totalMonths < 12) {
    return `${totalMonths} mo${totalMonths > 1 ? 's' : ''}`;
  }

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (remainingMonths === 0) {
    return `${years} yr${years > 1 ? 's' : ''}`;
  }
  return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
}

function formatPeriodDisplay(exp: Experience): string {
  if (exp.period) return exp.period;
  if (exp.start) {
    const startStr = exp.start;
    const endStr = exp.end === 'present' ? 'Present' : exp.end || 'Present';
    return `${startStr} — ${endStr}`;
  }
  return '';
}

function getTypeBadgeStyles(type: ExperienceType) {
  switch (type) {
    case 'internship':
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'freelance':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'fulltime':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'education':
    default:
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
}

export const ExperiencePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataVersion, setDataVersion] = useState(0);

  // Live updates when changes are saved from the admin CMS
  useEffect(() => {
    const handleUpdate = () => setDataVersion((v) => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, []);

  // URL state
  const typeParam = (searchParams.get('type') || 'all') as 'all' | ExperienceType;
  const sortParam = (searchParams.get('sort') || 'newest') as ExpSortOption;

  // Experience list (supports local admin edits)
  const allExperiences = useMemo<Experience[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_experience');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e: any) => ({
            id: e.id,
            role: e.role,
            company: e.company,
            companyUrl: e.companyUrl || 'https://github.com/manojkc1dev',
            period: e.period,
            start: e.start || (e.period?.includes('2026') ? '2026-02' : '2020-11'),
            end: e.end || (e.period?.includes('Jul 2026') ? '2026-07' : '2025-10'),
            location: e.location || 'Nepal',
            type: e.type || 'internship',
            description: e.description,
            bullets: Array.isArray(e.bullets)
              ? e.bullets
              : e.bullets
              ? [e.bullets]
              : [],
            tech: Array.isArray(e.tech) ? e.tech : [],
          }));
        }
      }
    } catch (err) {
      console.warn('Experience storage load error:', err);
    }
    return defaultExperiences;
  }, [dataVersion]);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all' || (key === 'sort' && val === 'newest')) {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next, { replace: true });
  };

  const handleTypeChange = (val: 'all' | ExperienceType) => {
    updateParams({ type: val });
    track('filter_experience', { type: val });
  };

  const handleSortChange = (val: ExpSortOption) => {
    updateParams({ sort: val });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const activeFiltersCount =
    (typeParam !== 'all' ? 1 : 0) +
    (sortParam !== 'newest' ? 1 : 0);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let list = allExperiences.filter((exp) => {
      if (typeParam === 'all') return true;
      return normalizeExpType(exp) === typeParam;
    });

    list.sort((a, b) => {
      const aVal = a.start || a.period || '';
      const bVal = b.start || b.period || '';
      if (sortParam === 'newest') {
        return bVal.localeCompare(aVal);
      }
      return aVal.localeCompare(bVal);
    });

    return list;
  }, [allExperiences, typeParam, sortParam]);

  // Group by Year / Phase
  const groupedExperiences = useMemo(() => {
    const groups: { header: string; items: Experience[] }[] = [];

    filteredExperiences.forEach((exp) => {
      const year = exp.start ? exp.start.slice(0, 4) : 'Recent';
      let groupHeader = year;

      if (normalizeExpType(exp) === 'education') {
        groupHeader = `${exp.start?.slice(0, 4) || '2020'} - ${exp.end?.slice(0, 4) || '2025'} (Undergraduate)`;
      }

      const existing = groups.find((g) => g.header === groupHeader);
      if (existing) {
        existing.items.push(exp);
      } else {
        groups.push({ header: groupHeader, items: [exp] });
      }
    });

    return groups;
  }, [filteredExperiences]);

  // JSON-LD structured data
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Professional Experience & Academic Background of Manoj K.C.',
    itemListElement: filteredExperiences.map((exp, idx) => ({
      '@type': 'WorkPosition',
      position: idx + 1,
      name: exp.role,
      worksFor: {
        '@type': 'Organization',
        name: exp.company,
      },
      startDate: exp.start,
      endDate: exp.end === 'present' ? undefined : exp.end,
      description: exp.description || exp.bullets?.join(' '),
    })),
  }), [filteredExperiences]);

  return (
    <div className="min-h-screen pb-24 print:bg-white print:text-black">
      <Seo
        title="Experience | Manoj K.C. — Backend Engineer"
        description="Chronological engineering experience, backend traineeship at Sajha Infotech, freelance client solutions, and BIT academic capstone."
        canonical="https://manojkc1.com.np/experience"
        jsonLd={jsonLd}
      />

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 print:hidden">
        <Breadcrumb items={[{ label: 'Experience' }]} />
      </div>

      {/* Header */}
      <PageHeader
        eyebrow="Timeline"
        title="Experience & Education"
        subtitle="Professional roles, intensive traineeships, freelance contracts, and academic milestones."
        meta={`${allExperiences.length} entries on record since 2020`}
        actions={
          <div className="print:hidden">
            <a
              href={profile.resumeUrl || '/resume.pdf'}
              download="Manoj_KC_Backend_Engineer_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('resume_download_click', { location: 'experience_page' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>
        }
      />

      {/* Sticky Filter Bar */}
      <FilterBar className="print:hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Type Filter Chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by experience type">
            <span className="text-xs font-mono text-neutral-500 mr-1">Filter by:</span>
            {TYPES.map((t) => (
              <Chip
                key={t.value}
                active={typeParam === t.value}
                onClick={() => handleTypeChange(t.value)}
                size="sm"
              >
                {t.label}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="exp-sort-select" className="text-xs font-mono text-neutral-500 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="exp-sort-select"
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value as ExpSortOption)}
                className="text-xs sm:text-sm py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5 whitespace-nowrap cursor-pointer"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </FilterBar>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Counter */}
        <div className="mb-8 flex items-center justify-between text-xs font-mono text-neutral-500 print:hidden">
          <span>
            Showing {filteredExperiences.length} of {allExperiences.length} entries
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Print timeline
          </button>
        </div>

        {/* Empty State */}
        {filteredExperiences.length === 0 ? (
          <EmptyState
            title="No experience matches your filter"
            description="Try choosing 'All Types' to inspect full professional history and academic milestones."
            action={{
              label: 'Show All Experience',
              onClick: handleClearFilters,
            }}
          />
        ) : (
          <div className="space-y-12">
            {groupedExperiences.map((group) => (
              <section key={group.header} aria-labelledby={`year-heading-${group.header.replace(/\s+/g, '-')}`}>
                {/* Group Year Heading */}
                <div className="flex items-center gap-3 mb-6">
                  <span
                    id={`year-heading-${group.header.replace(/\s+/g, '-')}`}
                    className="text-sm font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    {group.header}
                  </span>
                  <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                {/* Vertical Timeline items */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-8 ml-2 sm:ml-4">
                  {group.items.map((exp) => {
                    const normType = normalizeExpType(exp);
                    const isEducation = normType === 'education';
                    const isPresent = exp.end === 'present';
                    const duration = calculateDuration(exp.start, exp.end);
                    const periodDisplay = formatPeriodDisplay(exp);
                    const badgeStyles = getTypeBadgeStyles(normType);

                    return (
                      <div
                        key={exp.id}
                        id={`exp-card-${exp.id}`}
                        className="relative group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 print:border print:shadow-none print:break-inside-avoid"
                      >
                        {/* Timeline Node on the Left Border */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full border-4 border-white dark:border-neutral-950 flex items-center justify-center transition-transform group-hover:scale-125 ${
                            isPresent
                              ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                              : isEducation
                              ? 'bg-amber-500'
                              : 'bg-indigo-600'
                          }`}
                          aria-hidden="true"
                        >
                          {isPresent && (
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          )}
                        </div>

                        {/* Entry Header: Role + Company + Type Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {exp.role}
                              </h3>
                              {isPresent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                              {exp.companyUrl ? (
                                <a
                                  href={exp.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                                >
                                  <span>{exp.company}</span>
                                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                                </a>
                              ) : (
                                exp.company
                              )}
                            </p>
                          </div>

                          {/* Type Badge */}
                          <span
                            className={`self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${badgeStyles}`}
                          >
                            {normType}
                          </span>
                        </div>

                        {/* Location and Dates Bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                          {periodDisplay && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{periodDisplay}</span>
                              {duration && (
                                <span className="text-neutral-400 font-normal">({duration})</span>
                              )}
                            </span>
                          )}

                          {exp.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{exp.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {exp.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                            {exp.description}
                          </p>
                        )}

                        {/* Bullets */}
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="space-y-2 mb-5">
                            {exp.bullets.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5 leading-relaxed"
                              >
                                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Technologies Used */}
                        {exp.tech && exp.tech.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <Code2 className="w-3.5 h-3.5 text-neutral-400 mr-1" />
                            {exp.tech.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
