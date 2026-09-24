import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projects as defaultProjects, ProjectCategory, ProjectStatus } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHeader } from '../components/ui/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { Chip } from '../components/ui/Chip';
import { SearchInput } from '../components/ui/SearchInput';
import { LoadMoreButton } from '../components/ui/LoadMoreButton';
import { EmptyState } from '../components/ui/EmptyState';
import { Seo } from '../components/Seo';
import type { Project } from '../types';
import { track } from '../lib/analytics';

const PAGE_SIZE = 9;

type SortOption = 'newest' | 'oldest' | 'alphabetical';

const CATEGORIES: { label: string; value: 'all' | ProjectCategory }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Backend', value: 'backend' },
  { label: 'Fullstack', value: 'fullstack' },
  { label: 'Tools', value: 'tools' },
  { label: 'Open Source', value: 'opensource' },
];

const STATUSES: { label: string; value: 'all' | ProjectStatus }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Archived', value: 'archived' },
];

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const firstNewCardRef = useRef<HTMLDivElement | null>(null);
  const [prevCount, setPrevCount] = useState<number>(PAGE_SIZE);
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

  // Read URL query params
  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('category') || 'all') as 'all' | ProjectCategory;
  const statusParam = (searchParams.get('status') || 'all') as 'all' | ProjectStatus;
  const sortParam = (searchParams.get('sort') || 'newest') as SortOption;
  const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Projects list (supports local admin overrides if available)
  const allProjects = useMemo<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects') || localStorage.getItem('admin_cms_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            id: p.id || p.slug,
            title: p.title,
            tagline: p.tagline || (p.client ? `${p.client}` : p.shortDescription),
            description: p.shortDescription || p.description,
            category: p.category || 'backend',
            year: p.year || 2026,
            status: p.status || 'live',
            highlights: Array.isArray(p.highlights)
              ? p.highlights
              : p.keyHighlights
              ? p.keyHighlights.split(';').map((s: string) => s.trim())
              : [p.shortDescription],
            tech: p.technologies || p.tech || [],
            links: {
              live: p.liveUrl || p.links?.live,
              github: p.githubUrl || p.links?.github,
              caseStudy: p.links?.caseStudy,
            },
            featured: Boolean(p.featured),
            image: p.thumbnail || p.image || '/images/agritech.png',
          }));
        }
      }
    } catch (e) {
      console.warn('Projects storage load error:', e);
    }
    return defaultProjects;
  }, [dataVersion]);

  // Update query params helper
  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all' || (key === 'sort' && val === 'newest') || (key === 'page' && val === '1')) {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    updateParams({ q: val || null, page: '1' });
    track('filter_projects', { query: val });
  };

  const handleCategoryChange = (val: 'all' | ProjectCategory) => {
    updateParams({ category: val, page: '1' });
    track('filter_projects', { category: val });
  };

  const handleStatusChange = (val: 'all' | ProjectStatus) => {
    updateParams({ status: val, page: '1' });
    track('filter_projects', { status: val });
  };

  const handleSortChange = (val: SortOption) => {
    updateParams({ sort: val });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Active filter count calculation
  const activeFiltersCount =
    (queryParam ? 1 : 0) +
    (categoryParam !== 'all' ? 1 : 0) +
    (statusParam !== 'all' ? 1 : 0) +
    (sortParam !== 'newest' ? 1 : 0);

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    let list = [...allProjects];

    // Search query filter
    if (queryParam.trim()) {
      const q = queryParam.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryParam !== 'all') {
      list = list.filter((p) => p.category === categoryParam);
    }

    // Status filter
    if (statusParam !== 'all') {
      list = list.filter((p) => p.status === statusParam);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortParam === 'newest') {
        return (b.year ?? 2026) - (a.year ?? 2026);
      }
      if (sortParam === 'oldest') {
        return (a.year ?? 2026) - (b.year ?? 2026);
      }
      if (sortParam === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [allProjects, queryParam, categoryParam, statusParam, sortParam]);

  // Pagination calculation
  const visibleLimit = pageParam * PAGE_SIZE;
  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleLimit),
    [filteredProjects, visibleLimit]
  );
  const remaining = Math.max(0, filteredProjects.length - visibleProjects.length);
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);

  // Handle Load More with focus management
  const handleLoadMore = () => {
    setPrevCount(visibleProjects.length);
    const nextPage = pageParam + 1;
    updateParams({ page: nextPage.toString() });
  };

  // Focus the first newly rendered card after loading more
  useEffect(() => {
    if (visibleProjects.length > prevCount && firstNewCardRef.current) {
      firstNewCardRef.current.focus();
    }
  }, [visibleProjects.length, prevCount]);

  // JSON-LD structured data for SEO
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Manoj K.C.',
    description: 'Production web applications, REST APIs, and backend architectures built by Manoj K.C.',
    numberOfItems: filteredProjects.length,
    itemListElement: filteredProjects.map((p, idx) => ({
      '@type': 'SoftwareApplication',
      position: idx + 1,
      name: p.title,
      description: p.description,
      applicationCategory: p.category || 'BusinessApplication',
      operatingSystem: 'Web, Linux',
      url: p.links.live || p.links.github,
    })),
  }), [filteredProjects]);

  return (
    <div className="min-h-screen pb-24">
      <Seo
        title="Projects | Manoj K.C. — Backend Software Engineer"
        description="Explore production backend systems, REST APIs, and fullstack applications built with Python, Django, DRF, and PostgreSQL."
        canonical="https://manojkc1.com.np/projects"
        jsonLd={jsonLd}
      />

      {/* Hidden SEO pagination links */}
      {pageParam < totalPages && (
        <link rel="next" href={`https://manojkc1.com.np/projects?page=${pageParam + 1}`} />
      )}
      {pageParam > 1 && (
        <link rel="prev" href={`https://manojkc1.com.np/projects?page=${pageParam - 1}`} />
      )}

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={[{ label: 'Projects' }]} />
      </div>

      {/* Header */}
      <PageHeader
        eyebrow="Portfolio"
        title="All Projects"
        subtitle={`${allProjects.length} backend systems, REST APIs, and fullstack applications shipped or in active development.`}
        meta="Updated September 2026 · Python / Django / DRF / PostgreSQL"
      />

      {/* Sticky Filter Bar */}
      <FilterBar>
        {/* Row 1: Search + Sort + Clear */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            value={queryParam}
            onChange={handleSearchChange}
            placeholder="Search by title, tagline, or tech (e.g. Django, JWT, Celery)..."
            ariaLabel="Search projects"
            className="flex-1 max-w-xl"
          />

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="project-sort-select" className="text-xs font-mono text-neutral-500 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="project-sort-select"
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="text-xs sm:text-sm py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Title (A-Z)</option>
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

        {/* Row 2: Category Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <span className="text-xs font-mono text-neutral-500 mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              active={categoryParam === cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              size="sm"
            >
              {cat.label}
            </Chip>
          ))}
        </div>

        {/* Row 3: Status Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
          <span className="text-xs font-mono text-neutral-500 mr-1">Status:</span>
          {STATUSES.map((st) => (
            <Chip
              key={st.value}
              active={statusParam === st.value}
              onClick={() => handleStatusChange(st.value)}
              size="sm"
            >
              {st.label}
            </Chip>
          ))}
        </div>
      </FilterBar>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>
            Showing {visibleProjects.length} of {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
          {remaining > 0 && (
            <span>
              {remaining} more available
            </span>
          )}
        </div>

        {/* Results Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects match your filters"
            description="Try clearing your search query or switching to 'All Categories' to view the full catalog."
            action={{
              label: 'Clear Filters',
              onClick: handleClearFilters,
            }}
          />
        ) : (
          <div
            aria-live="polite"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {visibleProjects.map((project, idx) => {
              const isNewlyLoadedFirst = idx === prevCount;
              return (
                <div
                  key={project.id}
                  ref={isNewlyLoadedFirst ? firstNewCardRef : null}
                  tabIndex={isNewlyLoadedFirst ? -1 : undefined}
                  className="focus:outline-none"
                >
                  <ProjectCard
                    project={project}
                    index={idx % PAGE_SIZE}
                    onOpenDetails={(p) => setActiveModalProject(p)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination Section */}
        {remaining > 0 && (
          <div className="mt-14 text-center">
            <LoadMoreButton
              onClick={handleLoadMore}
              remaining={remaining}
              label={`Load More Projects (${remaining} remaining)`}
            />
          </div>
        )}

        {filteredProjects.length > 0 && remaining === 0 && (
          <div className="mt-14 text-center py-6 border-t border-neutral-200/80 dark:border-neutral-800/80 text-xs font-mono text-neutral-500">
            You've seen all {filteredProjects.length} projects.
          </div>
        )}
      </main>

      {/* Deep-Dive Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
};
