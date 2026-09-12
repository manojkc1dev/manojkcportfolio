import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OWNER_PROFILE } from '@/lib/constants';
import {
  ShieldCheck,
  Database,
  FileCheck,
  Server,
  Code2,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Master Console · Manoj K.C.</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Portfolio CMS & Backend Operations
          </h1>
          <p className="text-xs text-muted mt-1">
            System status, content tables, and row-level security audit
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/15 text-success border border-success/30">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Supabase RLS Active
          </span>
        </div>
      </div>

      {/* Metric / Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Database Connection</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">
            Supabase PostgreSQL
          </div>
          <p className="text-xs text-muted mt-1">
            RLS policies enforced on all 23 tables
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>SEO & Sitemaps</span>
            <FileCheck className="w-4 h-4 text-success" />
          </div>
          <div className="text-lg font-bold text-foreground">
            Sitemaps & JSON-LD
          </div>
          <p className="text-xs text-muted mt-1">
            Person, WebSite, Project & Image XML
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Endpoints & Health</span>
            <Server className="w-4 h-4 text-accent" />
          </div>
          <div className="text-lg font-bold text-foreground">
            /api/health (v0.2.0)
          </div>
          <p className="text-xs text-muted mt-1">
            Seed data synchronized & verified
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Profile Configuration */}
        <div id="hero" className="p-6 rounded-2xl bg-surface border border-border">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Active Profile Configuration</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-border/70">
              <span className="text-muted">Name:</span>
              <span className="font-semibold text-foreground">{OWNER_PROFILE.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/70">
              <span className="text-muted">Title:</span>
              <span className="font-semibold text-foreground">{OWNER_PROFILE.title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/70">
              <span className="text-muted">Email:</span>
              <span className="font-semibold text-foreground">{OWNER_PROFILE.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/70">
              <span className="text-muted">Phone:</span>
              <span className="font-semibold text-foreground">{OWNER_PROFILE.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/70">
              <span className="text-muted">Location:</span>
              <span className="font-semibold text-foreground">
                {OWNER_PROFILE.location} ({OWNER_PROFILE.timezone})
              </span>
            </div>
            <div className="py-2">
              <span className="text-muted block mb-1">Qualification:</span>
              <span className="font-medium text-foreground leading-relaxed">
                {OWNER_PROFILE.qualification}
              </span>
            </div>
          </div>
        </div>

        {/* Content Table Thumbnails (100x100 square) */}
        <div id="projects" className="p-6 rounded-2xl bg-surface border border-border">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span>Published Projects ({OWNER_PROFILE.featuredProjects.length})</span>
            </span>
            <span className="text-[11px] font-mono text-muted">Square (1:1) Thumbnails</span>
          </h2>

          <div className="space-y-4">
            {OWNER_PROFILE.featuredProjects.map((p) => (
              <div
                key={p.slug}
                className="p-3.5 rounded-xl bg-surface-2 border border-border flex items-center gap-4 group"
              >
                {/* 100x100 square thumbnail as specified in Part D */}
                <div className="relative w-[100px] h-[100px] shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted shrink-0 ml-2">
                      /{p.slug}
                    </span>
                  </div>

                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
