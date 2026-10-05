import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSkills } from '../lib/api/public';
import { skillGroups as defaultSkillGroups, currentFocus, SkillLevel } from '../data/skills';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHeader } from '../components/ui/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { Chip } from '../components/ui/Chip';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { AuthorBio } from '../components/ui/AuthorBio';
import { Seo } from '../components/Seo';
import type { SkillGroup, SkillItem, SkillCategory } from '../types';
import { Sparkles, Layers, ChevronDown, Star } from 'lucide-react';
import { track } from '../lib/analytics';

type SkillSortOption = 'group' | 'level' | 'alphabetical';

const LEVELS: { label: string; value: 'all' | SkillLevel }[] = [
  { label: 'All Levels', value: 'all' },
  { label: 'Expert', value: 'expert' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Learning', value: 'learning' },
];

const LEVEL_WEIGHT: Record<SkillLevel, number> = {
  expert: 4,
  advanced: 3,
  intermediate: 2,
  learning: 1,
};

function normalizeSkillLevel(skill: SkillItem): SkillLevel {
  if (skill.level) return skill.level;
  if (skill.proficiency) {
    const p = skill.proficiency.toLowerCase();
    if (p.includes('expert')) return 'expert';
    if (p.includes('adv')) return 'advanced';
    if (p.includes('int')) return 'intermediate';
    if (p.includes('learn')) return 'learning';
  }
  return 'intermediate';
}

function normalizeApiSkillGroups(categories: SkillCategory[]): SkillGroup[] {
  return categories.map((cat, idx) => ({
    id: cat.id ? String(cat.id) : `category-${idx}`,
    title: cat.title || cat.category || 'Competencies',
    category: cat.category || cat.title || 'Competencies',
    description: cat.description || '',
    skills: Array.isArray(cat.skills)
      ? cat.skills.map((s) => ({
          name: s.name,
          iconName: s.iconName,
          highlight: Boolean(s.highlight),
          proficiency:
            s.proficiency ||
            (s.level
              ? ((s.level.charAt(0).toUpperCase() + s.level.slice(1)) as
                  | 'Advanced'
                  | 'Intermediate'
                  | 'Learning')
              : 'Intermediate'),
          level: normalizeSkillLevel(s),
          years: s.years ?? 2,
        }))
      : [],
  }));
}

function getLevelBadgeStyles(level: SkillLevel) {
  switch (level) {
    case 'expert':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/70';
    case 'advanced':
      return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/70';
    case 'intermediate':
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/70';
    case 'learning':
    default:
      return 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/70';
  }
}

export const SkillsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [skills, setSkills] = useState<SkillGroup[]>(defaultSkillGroups);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setApiError] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // Live updates when changes are saved from the admin CMS
  useEffect(() => {
    const handleUpdate = () => setRefreshCounter((c) => c + 1);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, []);

  // Fetch skills from Django public API
  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    setIsLoading(true);
    getSkills({ signal: controller.signal })
      .then((apiCategories) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          setSkills(normalizeApiSkillGroups(apiCategories));
          setApiError(false);
        } else {
          // Empty response -> fallback to defaultSkillGroups
          setSkills(defaultSkillGroups);
        }
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('Failed to load skills from public API:', err);
        }
        setApiError(true);
        setSkills(defaultSkillGroups);
      })
      .finally(() => {
        if (!isCancelled && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [refreshCounter]);

  // Query params
  const queryParam = searchParams.get('q') || '';
  const levelParam = (searchParams.get('level') || 'all') as 'all' | SkillLevel;
  const sortParam = (searchParams.get('sort') || 'group') as SkillSortOption;

  const totalSkillCount = useMemo(() => {
    return skills.reduce((acc, g) => acc + g.skills.length, 0);
  }, [skills]);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all' || (key === 'sort' && val === 'group')) {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    updateParams({ q: val || null });
    track('filter_skills', { query: val });
  };

  const handleLevelChange = (val: 'all' | SkillLevel) => {
    updateParams({ level: val });
    track('filter_skills', { level: val });
  };

  const handleSortChange = (val: SkillSortOption) => {
    updateParams({ sort: val });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const activeFiltersCount =
    (queryParam ? 1 : 0) +
    (levelParam !== 'all' ? 1 : 0) +
    (sortParam !== 'group' ? 1 : 0);

  // Filtered and sorted skill groups
  const filteredGroups = useMemo(() => {
    const q = queryParam.toLowerCase().trim();

    return skills
      .map((group) => {
        let groupSkills = group.skills.filter((skill) => {
          const skillLevel = normalizeSkillLevel(skill);

          // Level filter
          if (levelParam !== 'all' && skillLevel !== levelParam) {
            return false;
          }

          // Search query filter
          if (q) {
            const matchesName = skill.name.toLowerCase().includes(q);
            const matchesGroup = group.title.toLowerCase().includes(q);
            return matchesName || matchesGroup;
          }

          return true;
        });

        // Sort inside group
        if (sortParam === 'level') {
          groupSkills = [...groupSkills].sort(
            (a, b) => LEVEL_WEIGHT[normalizeSkillLevel(b)] - LEVEL_WEIGHT[normalizeSkillLevel(a)]
          );
        } else if (sortParam === 'alphabetical') {
          groupSkills = [...groupSkills].sort((a, b) => a.name.localeCompare(b.name));
        }

        return {
          ...group,
          skills: groupSkills,
        };
      })
      .filter((group) => group.skills.length > 0);
  }, [skills, queryParam, levelParam, sortParam]);

  const displayedSkillsCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.skills.length, 0);
  }, [filteredGroups]);

  // JSON-LD structured data with globally increasing position indexing
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://manojkc1.com.np/skills#webpage',
        url: 'https://manojkc1.com.np/skills',
        name: 'Skills | Python, Django, DRF, PostgreSQL, Docker | Manoj K.C.',
        description:
          'Comprehensive inventory of technical skills, backend architectures, databases, and tooling mastered by Manoj K.C., Python/Django Engineer in Kathmandu, Nepal.',
        isPartOf: { '@id': 'https://manojkc1.com.np/#website' },
        author: { '@id': 'https://manojkc1.com.np/#person' },
      },
      {
        '@type': 'ItemList',
        name: 'Technical Skills - Python, Django, DRF, PostgreSQL',
        description: 'Core languages, backend frameworks, relational databases, security protocols, and devops tooling.',
        numberOfItems: displayedSkillsCount,
        itemListElement: filteredGroups
          .flatMap((g) => g.skills.map((s) => ({ skill: s, groupTitle: g.title })))
          .map(({ skill, groupTitle }, index) => ({
            '@type': 'Thing',
            position: index + 1,
            name: skill.name,
            description: `${skill.name} (${normalizeSkillLevel(skill)} proficiency) - ${groupTitle}`,
          })),
      },
    ],
  }), [filteredGroups, displayedSkillsCount]);

  return (
    <div className="min-h-screen pb-24">
      <Seo
        title="Skills | Python, Django, DRF, PostgreSQL, Docker | Manoj K.C."
        description="Comprehensive inventory of technical skills, backend architectures, databases, and tooling mastered by Manoj K.C., Python/Django Engineer in Kathmandu, Nepal."
        canonical="https://manojkc1.com.np/skills"
        jsonLd={jsonLd}
      />

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={[{ label: 'Skills' }]} />
      </div>

      {/* Header */}
      <PageHeader
        eyebrow="Competencies"
        title="Technical Skills - Python, Django, DRF, PostgreSQL"
        subtitle="Everything I work with, grouped by category and calibrated for enterprise reliability."
        meta={`${skills.length} categories · ${totalSkillCount} skills cataloged`}
      />

      {/* Sticky Filter Bar */}
      <FilterBar>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            value={queryParam}
            onChange={handleSearchChange}
            placeholder="Search skills (e.g. Django, PostgreSQL, Docker)..."
            ariaLabel="Search skills"
            className="flex-1 max-w-xl"
          />

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="skills-sort-select" className="text-xs font-mono text-neutral-500 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="skills-sort-select"
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value as SkillSortOption)}
                className="text-xs sm:text-sm py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="group">By Group (Default)</option>
                <option value="level">By Level (High to Low)</option>
                <option value="alphabetical">A-Z</option>
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

        {/* Level Filter Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by proficiency level">
          <span className="text-xs font-mono text-neutral-500 mr-1">Proficiency:</span>
          {LEVELS.map((lvl) => (
            <Chip
              key={lvl.value}
              active={levelParam === lvl.value}
              onClick={() => handleLevelChange(lvl.value)}
              size="sm"
            >
              {lvl.label}
            </Chip>
          ))}
        </div>
      </FilterBar>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Counter & Current Focus Callout */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-xs font-mono text-neutral-500">
            Showing {displayedSkillsCount} skills across {filteredGroups.length} categories
          </div>

          {/* Proficiency legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Expert (4)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Advanced (3)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Intermediate (2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Learning (1)
            </span>
          </div>
        </div>

        {/* Active Learning Focus Callout Banner (when no strict filters) */}
        {!queryParam && levelParam === 'all' && currentFocus.length > 0 && (
          <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-neutral-900 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Current Engineering Focus & Groundwork</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Technologies and architectural patterns currently being deepened through active prototyping and production deployments:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {currentFocus.map((focus) => (
                <span
                  key={focus.name}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {focus.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skill Groups Grid, Loading Skeleton, or Empty State */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            aria-busy="true"
            aria-label="Loading technical skills"
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs animate-pulse"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                    </div>
                    <div className="h-5 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-neutral-200/60 dark:bg-neutral-800/60 rounded mb-6" />
                  <div className="flex flex-wrap gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-24 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title="No skills match your search"
            description="Try changing your search term or selecting 'All Levels' to view all technical competencies."
            action={{
              label: 'Reset Filters',
              onClick: handleClearFilters,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGroups.map((group) => {
              const isExpanded = expandedGroups[group.id] || false;
              const hasMoreThan20 = group.skills.length > 20;
              const visibleSkills = hasMoreThan20 && !isExpanded ? group.skills.slice(0, 20) : group.skills;

              return (
                <div
                  key={group.id}
                  id={`skill-group-${group.id}`}
                  className="flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                          {group.title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                        {group.skills.length}
                      </span>
                    </div>

                    {group.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                        {group.description}
                      </p>
                    )}

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      {visibleSkills.map((skill) => {
                        const level = normalizeSkillLevel(skill);
                        const weight = LEVEL_WEIGHT[level];
                        const badgeClasses = getLevelBadgeStyles(level);

                        return (
                          <div
                            key={skill.name}
                            title={`${skill.name} — ${level} proficiency${skill.years ? ` (${skill.years}+ yrs)` : ''}`}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${badgeClasses}`}
                          >
                            <span>{skill.name}</span>

                            {skill.highlight && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" aria-label="Starred skill" />
                            )}

                            {/* 1-4 proficiency dots */}
                            <div className="flex items-center gap-0.5" aria-hidden="true">
                              {[1, 2, 3, 4].map((dotIndex) => (
                                <span
                                  key={dotIndex}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    dotIndex <= weight
                                      ? 'bg-current opacity-90'
                                      : 'bg-current opacity-20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Show More / Collapse button if > 20 skills */}
                  {hasMoreThan20 && (
                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedGroups((prev) => ({
                            ...prev,
                            [group.id]: !isExpanded,
                          }))
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? 'Show less' : `Show all ${group.skills.length} skills`}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* E-E-A-T Author Authority and Freshness */}
        <AuthorBio lastUpdated="September 2026" />
      </main>
    </div>
  );
};
