/**
 * src/pages/admin/DashboardPage.tsx
 *
 * CMS Executive Overview Dashboard with live KPI counters, recent inquiries,
 * quick action links, and system status indicators.
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase/client';
import {
  FolderKanban,
  CheckCircle2,
  Wrench,
  BookOpen,
  Star,
  FileEdit,
  Sparkles,
  Inbox,
  PlusCircle,
  ArrowRight,
  Database,
  MapPin,
  Phone,
  Eye,
  Home,
  User,
  Layers,
  PhoneCall,
  PanelBottom,
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  company?: string;
  scope?: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState<{
    projects: string | number;
    liveWorks: string | number;
    services: string | number;
    articles: string | number;
    featured: string | number;
    drafts: string | number;
    newLeads: string | number;
    totalLeads: string | number;
  }>({
    projects: '—',
    liveWorks: '—',
    services: '—',
    articles: '—',
    featured: '—',
    drafts: '—',
    newLeads: '—',
    totalLeads: '—',
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  useEffect(() => {
    async function loadKPICounters() {
      try {
        // Projects total
        const pTotal = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        // Projects live / published
        const pLive = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);

        // Featured projects
        const pFeatured = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('featured', true);

        // Draft projects
        const pDrafts = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('published', false);

        // Services
        const sTotal = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true });

        // Blogs / Articles
        const bTotal = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true });

        // New leads
        const leadsNew = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        // Total leads
        const leadsTotal = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true });

        setCounts({
          projects: pTotal.count ?? (pTotal.error ? '—' : 0),
          liveWorks: pLive.count ?? (pLive.error ? '—' : 0),
          services: sTotal.count ?? (sTotal.error ? '—' : 0),
          articles: bTotal.count ?? (bTotal.error ? '—' : 0),
          featured: pFeatured.count ?? (pFeatured.error ? '—' : 0),
          drafts: pDrafts.count ?? (pDrafts.error ? '—' : 0),
          newLeads: leadsNew.count ?? (leadsNew.error ? '—' : 0),
          totalLeads: leadsTotal.count ?? (leadsTotal.error ? '—' : 0),
        });
      } catch {
        // If query fails, keep fallback '—'
      }
    }

    async function loadRecentInquiries() {
      setLoadingInquiries(true);
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('id, name, company, scope, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data) {
          setInquiries(data as Inquiry[]);
        }
      } catch {
        setInquiries([]);
      } finally {
        setLoadingInquiries(false);
      }
    }

    loadKPICounters();
    loadRecentInquiries();
  }, []);

  const kpis = [
    { label: 'Total Projects', value: counts.projects, icon: FolderKanban, color: 'text-blue-500' },
    { label: 'Live Works', value: counts.liveWorks, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Services', value: counts.services, icon: Wrench, color: 'text-purple-500' },
    { label: 'Articles', value: counts.articles, icon: BookOpen, color: 'text-amber-500' },
    { label: 'Featured', value: counts.featured, icon: Star, color: 'text-yellow-500' },
    { label: 'Drafts', value: counts.drafts, icon: FileEdit, color: 'text-rose-500' },
    { label: 'New Leads', value: counts.newLeads, icon: Sparkles, color: 'text-teal-500' },
    { label: 'Total Leads', value: counts.totalLeads, icon: Inbox, color: 'text-indigo-500' },
  ];

  const shortcuts = [
    { label: 'Projects CMS', to: '/admin/projects', icon: FolderKanban },
    { label: 'Services CMS', to: '/admin/services', icon: Wrench },
    { label: 'Blog CMS', to: '/admin/blog', icon: BookOpen },
    { label: 'Leads Inbox', to: '/admin/inquiries', icon: Inbox },
    { label: 'Homepage', to: '/admin/content/homepage', icon: Home },
    { label: 'About Page', to: '/admin/content/about', icon: User },
    { label: 'Contact & Rates', to: '/admin/content/contact', icon: PhoneCall },
    { label: 'Footer CMS', to: '/admin/content/footer', icon: PanelBottom },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface)] to-[var(--surface-2)] border border-[var(--border)] shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.email || user?.email || 'Admin'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] max-w-2xl">
              Centralized control center. Manage content, portfolio, branding, and inquiries with real-time database synchronisation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/admin/projects')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-fg,white)] hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={() => navigate('/admin/services')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Service</span>
            </button>
            <button
              onClick={() => navigate('/admin/blog')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>Write Article</span>
            </button>
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Grid (8 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-2 hover:border-[var(--primary)]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--fg-muted)] truncate">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color} shrink-0`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)]">
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Inquiries (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--fg)]">Recent Project Inquiries</h2>
              <p className="text-xs text-[var(--fg-muted)]">Incoming leads via contact submissions</p>
            </div>
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1">
            {loadingInquiries ? (
              <div className="py-12 text-center text-xs text-[var(--fg-muted)]">
                Loading inquiries…
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--fg-muted)] space-y-2">
                <Inbox className="w-8 h-8 text-[var(--fg-muted)]/50 mx-auto" />
                <p>No inquiries yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-[var(--surface-2)]/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[var(--fg)] truncate">
                          {inq.name}
                        </p>
                        {inq.company && (
                          <span className="text-[10px] text-[var(--fg-muted)] truncate">
                            · {inq.company}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--fg-muted)] truncate">
                        {inq.scope || 'General consultation inquiry'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          inq.status === 'new'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                            : 'bg-[var(--surface-2)] text-[var(--fg-muted)]'
                        }`}
                      >
                        {inq.status || 'new'}
                      </span>
                      <Link
                        to="/admin/inquiries"
                        className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Shortcuts + System Status (1 col) */}
        <div className="space-y-6">
          {/* Quick Access Tiles */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--fg)]">Content Management Quick Access</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {shortcuts.map((tile) => {
                const Icon = tile.icon;
                return (
                  <Link
                    key={tile.to}
                    to={tile.to}
                    className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)]/50 flex flex-col items-start gap-2 text-xs font-medium text-[var(--fg)] transition-all"
                  >
                    <Icon className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[11px] font-semibold">{tile.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xs space-y-3.5">
            <h2 className="text-base font-bold text-[var(--fg)]">System Infrastructure Status</h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="flex items-center gap-2 text-[var(--fg-muted)]">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  Database
                </span>
                <span className="font-semibold text-emerald-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="flex items-center gap-2 text-[var(--fg-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Headquarters
                </span>
                <span className="font-semibold text-[var(--fg)]">Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="flex items-center gap-2 text-[var(--fg-muted)]">
                  <Phone className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Primary Contact
                </span>
                <span className="font-semibold text-[var(--fg)]">+977 9809807760</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
