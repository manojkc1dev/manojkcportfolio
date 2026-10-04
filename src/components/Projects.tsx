import React, { useState, useMemo } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects as staticProjects } from '../data/projects';
import { useProjects } from '../hooks/useProjects';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { ViewAllLink } from './ui/ViewAllLink';
import type { Project } from '../types';

// Canonical required project order:
// 1. Agritech | Agriculture Marketplace Platform
// 2. CalcPro | Multi-Functional Web Calculator
// 3. AuthSentinel | Django JWT & RBAC Boilerplate
// 4. PayStream | Unified Nepal Payment Hub
// 5. Shabdhabhandar | English-to-Nepali Dictionary
// 6. AcadFlow | Student Management System
// 7. Nepal GeoData | Administrative Boundaries API
const REQUIRED_PROJECT_IDS = [
  'agritech',
  'calcpro',
  'auth-sentinel',
  'paystream-gateway',
  'shabdhabhandar',
  'acadflow',
  'nepal-geodata-api',
];

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Django API is the primary source; staticProjects is the offline fallback.
  const { data: allProjects } = useProjects();

  // Curate featured projects: supports starred projects from admin panel while maintaining required order
  const displayProjects = useMemo(() => {
    const projectMap = new Map<string, Project>();
    allProjects.forEach((p) => {
      projectMap.set(p.id, p);
    });

    // Check if there are any starred/featured projects
    const starredProjects = allProjects.filter((p) => p.featured);
    const ordered: Project[] = [];

    // 1. Project #1 (Featured Hero Project)
    // Always start with Agritech if available, or first starred project
    const agritech = projectMap.get('agritech') || staticProjects.find((p) => p.id === 'agritech');
    if (agritech && (agritech.featured || starredProjects.length === 0)) {
      ordered.push(agritech);
    } else if (starredProjects.length > 0) {
      ordered.push(starredProjects[0]);
    }

    // 2. Add remaining required projects in specified order if starred or by default
    for (const reqId of REQUIRED_PROJECT_IDS) {
      if (ordered.some((op) => op.id === reqId)) continue;
      const found = projectMap.get(reqId) || staticProjects.find((p) => p.id === reqId);
      if (found && (found.featured || starredProjects.length === 0)) {
        ordered.push(found);
      }
    }

    // 3. Add any additional starred projects created in Admin Panel
    for (const p of starredProjects) {
      if (!ordered.some((op) => op.id === p.id)) {
        ordered.push(p);
      }
    }

    // 4. Backfill from REQUIRED_PROJECT_IDS if fewer than 7
    if (ordered.length < 7) {
      for (const reqId of REQUIRED_PROJECT_IDS) {
        const found = projectMap.get(reqId) || staticProjects.find((p) => p.id === reqId);
        if (found && !ordered.some((op) => op.id === found.id)) {
          ordered.push(found);
          if (ordered.length === 7) break;
        }
      }
    }

    return ordered;
  }, [allProjects]);

  // Main featured hero project (#1: Agritech)
  const featuredProject = displayProjects[0];
  // Supporting project cards (#2 through #7, or all additional starred projects)
  const supportingProjects = displayProjects.slice(1);

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900/60 mb-3 font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Selected Work (1:3:3 Showcase)</span>
            </div>
            <h2
              id="projects-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
            >
              Projects
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Production backends, shipped APIs, live demos.
            </p>
          </div>

          <div className="shrink-0">
            <ViewAllLink
              to="/projects"
              label="View All Projects"
              count={allProjects.length}
            />
          </div>
        </div>

        {/* Deterministic CSS Grid:
            Desktop:
              Row 1: Project #1 (Featured Hero Card spanning 3 columns: lg:col-span-3)
              Row 2: Projects #2, #3, #4 (3 equal columns: lg:col-span-1 each)
              Row 3: Projects #5, #6, #7 (3 equal columns: lg:col-span-1 each)
            Tablet:
              Row 1: Project #1 (Full width spanning 2 columns: md:col-span-2)
              Row 2: Projects #2 | #3 (md:col-span-1 each)
              Row 3: Projects #4 | #5 (md:col-span-1 each)
              Row 4: Projects #6 | #7 (md:col-span-1 each)
            Mobile:
              1 column (grid-cols-1), stacked in exact order 1 through 7 without overflow
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          {/* Row 1 Hero: Project #1 (Agritech) */}
          {featuredProject && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <FeaturedProjectCard
                project={featuredProject}
                onOpenDetails={(proj) => setActiveModalProject(proj)}
              />
            </div>
          )}

          {/* Supporting Project Cards (Projects #2 through #7) */}
          {supportingProjects.map((project, index) => (
            <div
              key={project.id}
              className="col-span-1 md:col-span-1 lg:col-span-1 h-full"
            >
              <ProjectCard
                project={project}
                index={index}
                onOpenDetails={(proj) => setActiveModalProject(proj)}
              />
            </div>
          ))}
        </div>

        {/* Centered Bottom Action: View All Projects (N) */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 font-semibold text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <span>View All Projects ({allProjects.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Deep-Dive Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
