/**
 * src/components/admin/AdminLayout.tsx
 *
 * Full Admin layout with responsive sidebar, topbar, user profile dropdown,
 * quick navigation links, and child page outlet.
 */

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/useAuth';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  BookOpen,
  Inbox,
  Home,
  User,
  Layers,
  PhoneCall,
  PanelBottom,
  Sparkles,
  Building2,
  Share2,
  Settings,
  ShieldCheck,
  ExternalLink,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  end?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Blog', to: '/admin/blog', icon: BookOpen },
      { label: 'Inquiries', to: '/admin/inquiries', icon: Inbox },
    ],
  },
  {
    title: 'WEBSITE',
    items: [
      { label: 'Homepage', to: '/admin/content/homepage', icon: Home },
      { label: 'About Page', to: '/admin/content/about', icon: User },
      { label: 'Services Catalog', to: '/admin/content/services-catalog', icon: Layers },
      { label: 'Contact & Pricing', to: '/admin/content/contact', icon: PhoneCall },
      { label: 'Footer & Links', to: '/admin/content/footer', icon: PanelBottom },
    ],
  },
  {
    title: 'BRANDING & MEDIA',
    items: [
      { label: 'Logo Management', to: '/admin/branding/logo', icon: Sparkles },
      { label: 'Company Identity', to: '/admin/branding/identity', icon: Building2 },
      { label: 'Social Media', to: '/admin/branding/social', icon: Share2 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', to: '/admin/settings', icon: Settings },
      { label: 'Security', to: '/admin/security', icon: ShieldCheck },
    ],
  },
];

export default function AdminLayout() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  // Compute breadcrumb from current path
  const currentPath = location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);
  const sectionName =
    pathParts.length > 1
      ? pathParts.slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
      : 'Dashboard';

  const NavList = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-wider text-[var(--fg-muted)] uppercase font-mono">
            {section.title}
          </p>
          <div className="space-y-0.5 mt-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onItemClick}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-fg,white)] font-semibold shadow-xs'
                        : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex">
      {/* Desktop Sidebar (280px) */}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] h-screen sticky top-0 overflow-y-auto">
        {/* Branding block */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] font-bold text-sm">
              M
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">Manoj K.C.</span>
              <span className="text-[10px] text-[var(--fg-muted)] block">Portfolio CMS</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
            ADMIN
          </span>
        </div>

        {/* Navigation items */}
        <div className="p-4 flex-1">
          <NavList />
        </div>

        {/* Bottom user quick info */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)]/50">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold truncate">{profile?.email || user?.email}</p>
              <p className="text-[10px] text-[var(--primary)] capitalize font-medium">
                {role ?? 'admin'} Account
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--error)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] bg-[var(--surface)] h-full z-10 p-5 flex flex-col overflow-y-auto border-r border-[var(--border)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Manoj K.C.</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--primary)]/20 text-[var(--primary)]">
                  ADMIN
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:bg-[var(--surface-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <NavList onItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="pt-4 border-t border-[var(--border)] mt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-2)] hover:bg-[var(--error)]/10 hover:text-[var(--error)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Left: Mobile hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg md:hidden text-[var(--fg-muted)] hover:bg-[var(--surface-2)]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
              <span className="font-medium text-[var(--fg)]">Admin</span>
              <span>/</span>
              <span className="text-[var(--fg)] font-semibold">{sectionName}</span>
            </div>
          </div>

          {/* Center: Search input */}
          <div className="hidden sm:flex items-center max-w-xs w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
            <input
              type="text"
              placeholder="Quick search admin…"
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Right: Live site link + User dropdown */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)] transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] font-bold text-xs flex items-center justify-center">
                  {(profile?.email || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-3 z-40 space-y-3">
                    <div className="px-2 py-1 border-b border-[var(--border)] pb-2">
                      <p className="text-xs font-bold truncate text-[var(--fg)]">
                        {profile?.email || user?.email}
                      </p>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20 uppercase">
                          {role ?? 'Admin'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <NavLink
                        to="/admin/security"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-[var(--surface-2)] text-[var(--fg)]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[var(--fg-muted)]" />
                        <span>Security & Password</span>
                      </NavLink>
                      <NavLink
                        to="/admin/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-[var(--surface-2)] text-[var(--fg)]"
                      >
                        <Settings className="w-4 h-4 text-[var(--fg-muted)]" />
                        <span>System Settings</span>
                      </NavLink>
                    </div>
                    <div className="pt-2 border-t border-[var(--border)]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
