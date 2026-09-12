'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/constants';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  key?: React.Key;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const visibleTech = project.tags.slice(0, 4);
  const remainingTechCount = project.tags.length - 4;

  return (
    <article
      id={`project-${project.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* 1:1 Square Thumbnail Container (75% width, +50% size increase) */}
      <div className="relative aspect-square w-3/4 mx-auto overflow-hidden rounded-xl border border-border bg-surface-2">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 38vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top-Right Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md border shadow-xs ${
              project.featured
                ? 'bg-primary/90 text-primary-foreground border-primary/40'
                : 'bg-surface/90 text-foreground border-border'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.liveUrl ? 'bg-success animate-pulse' : 'bg-primary-foreground'
              }`}
            />
            {project.featured ? 'Featured' : 'Live'}
          </span>
        </div>
      </div>

      {/* Content Below Square Image */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="mt-1.5 text-sm text-muted line-clamp-2 leading-relaxed">
            {project.subtitle || project.description}
          </p>

          {/* Tech Chips */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-surface-2 border border-border text-foreground/90"
              >
                {tech}
              </span>
            ))}
            {remainingTechCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-surface-2 border border-border text-muted">
                +{remainingTechCount}
              </span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-border/70 text-xs">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="sr-only">Live Demo</span>
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
              title="GitHub Source"
            >
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
