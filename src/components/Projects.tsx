import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects as defaultProjects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { ViewAllLink } from './ui/ViewAllLink';
import type { Project } from '../types';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
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

  // Curate 1 : 3 : 3 layout (1 flagship project + 3 in row 1 + 3 in row 2 = 7 projects)
  const displayProjects = useMemo(() => {
    const featured = allProjects.filter((p) => p.featured);
    const nonFeatured = allProjects.filter((p) => !p.featured);
    const ordered = [...featured, ...nonFeatured];
    return ordered.slice(0, 7);
  }, [allProjects]);

  // Main flagship hero project
  const mainFeatured = displayProjects[0];
  // First row of 3 projects
  const rowOneProjects = displayProjects.slice(1, 4);
  // Second row of 3 projects
  const rowTwoProjects = displayProjects.slice(4, 7);

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

        {/* 1. Primary Flagship Project Card (Hero Spotlight: 1) */}
        {mainFeatured && (
          <motion.div
            id={`featured-project-${mainFeatured.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="group relative rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden mb-10 sm:mb-12 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div
              className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[2px]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 rounded-3xl bg-white dark:bg-neutral-900 -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/80">
                      FLAGSHIP BACKEND
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Python 3.12 · Django 5
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
                    {mainFeatured.title}
                  </h3>

                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                    {mainFeatured.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {mainFeatured.highlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {mainFeatured.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {mainFeatured.links.live && (
                    <a
                      href={mainFeatured.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-xs"
                    >
                      <span>Live Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  {mainFeatured.links.github && (
                    <a
                      href={mainFeatured.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <span>Repository</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(mainFeatured)}
                    className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-2 cursor-pointer"
                  >
                    Deep Dive Architecture →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <div
                  onClick={() => setActiveModalProject(mainFeatured)}
                  className="relative group rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800 shadow-md cursor-pointer aspect-video sm:aspect-4/3 w-full"
                  title="Click to view full architecture & details"
                >
                  <img
                    src={mainFeatured.image}
                    alt={mainFeatured.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-neutral-900/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 font-mono">
                    <span>Django REST Framework</span>
                    <span>PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Row 1 of 3 Projects (3) */}
        {rowOneProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {rowOneProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpenDetails={(proj) => setActiveModalProject(proj)}
              />
            ))}
          </div>
        )}

        {/* 3. Row 2 of 3 Projects (3) */}
        {rowTwoProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {rowTwoProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index + 3}
                onOpenDetails={(proj) => setActiveModalProject(proj)}
              />
            ))}
          </div>
        )}

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
