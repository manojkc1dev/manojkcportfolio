import React from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  LayoutDashboard,
  Layers,
  FolderGit2,
  Wrench,
  Compass,
  FileText,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin('/admin');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-primary selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 shrink-0 bg-surface border-r border-border flex flex-col justify-between p-5">
        <div>
          {/* Brand */}
          <div className="pb-5 border-b border-border mb-6">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-bold tracking-tight text-base text-foreground group"
            >
              <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                MK
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">Manoj K.C.</span>
                <span className="text-[10px] text-muted-foreground font-mono mt-1">Portfolio CMS</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium" aria-label="Admin Navigation">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </Link>
            <Link
              href="/admin#hero"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Hero & Identity</span>
            </Link>
            <Link
              href="/admin#projects"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects ({2})</span>
            </Link>
            <Link
              href="/admin#skills"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>Skills & Stack</span>
            </Link>
            <Link
              href="/admin#seo"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Navigation & SEO</span>
            </Link>
            <Link
              href="/admin#audit"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Log & RLS</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-border space-y-4">
          <div className="p-3 rounded-xl bg-surface-2 border border-border">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-muted">Administrator</span>
              <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono text-[9px] font-bold uppercase">
                {auth.role}
              </span>
            </div>
            <p className="text-xs font-mono text-foreground truncate font-medium">
              {auth.user?.email}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-destructive transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 px-6 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted">CMS v0.2.0</span>
            <span className="text-border">/</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/30">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              RLS Hardened
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 text-xs font-medium text-foreground transition-colors"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
