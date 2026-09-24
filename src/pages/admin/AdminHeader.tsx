import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  ExternalLink,
  Search,
  LogOut,
  Shield,
  User,
  Sparkles,
  Command,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { AdminTab } from './types';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onToggleSidebar: () => void;
  onBackToHome: () => void;
  userEmail?: string | null;
  onSignOut?: () => void;
}

const TAB_TITLES: Record<AdminTab, { group: string; label: string }> = {
  dashboard: { group: 'Overview', label: 'Portfolio Dashboard' },
  projects: { group: 'Portfolio Content', label: 'Projects & Live Demos Manager' },
  skills: { group: 'Portfolio Content', label: 'Skills & Tech Stack' },
  experience: { group: 'Portfolio Content', label: 'Experience & Education Timeline' },
  about: { group: 'Portfolio Content', label: 'About Me & Bio' },
  inquiries: { group: 'Communication', label: 'Contact Inquiries' },
  socials: { group: 'Communication', label: 'Social Profiles & Direct Contact' },
  settings: { group: 'System', label: 'Settings & Backups' },
  security: { group: 'System', label: 'Security & Credentials' },
  // Compatibility
  services: { group: 'Portfolio Content', label: 'Skills & Tech Stack' },
  blog: { group: 'Portfolio Content', label: 'Projects & Live Demos' },
  homepage: { group: 'Portfolio Content', label: 'About Me & Bio' },
  'services-catalog': { group: 'Portfolio Content', label: 'Skills & Tech Stack' },
  'contact-pricing': { group: 'Communication', label: 'Social Profiles & Direct Contact' },
  'footer-links': { group: 'Communication', label: 'Social Profiles & Direct Contact' },
  'logo-management': { group: 'Portfolio Content', label: 'About Me & Bio' },
  'company-identity': { group: 'Portfolio Content', label: 'About Me & Bio' },
  'social-media': { group: 'Communication', label: 'Social Profiles & Direct Contact' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onToggleSidebar,
  onBackToHome,
  userEmail,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const activeBreadcrumb = TAB_TITLES[currentTab] || { group: 'Admin', label: 'Dashboard' };

  // Filter tabs for search jump
  const searchResults = Object.entries(TAB_TITLES).filter(([tabKey, info]) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      info.label.toLowerCase().includes(q) ||
      info.group.toLowerCase().includes(q) ||
      tabKey.toLowerCase().includes(q)
    );
  });

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand, Toggle, Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              MK
            </div>
            <span className="font-semibold text-neutral-900 dark:text-white text-sm hidden sm:inline">
              Manoj Khatri
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
              PORTFOLIO ADMIN
            </span>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 hidden md:block" />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
            <span>Portfolio Admin</span>
            <span>/</span>
            <span>{activeBreadcrumb.group}</span>
            <span>&gt;</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {activeBreadcrumb.label}
            </span>
          </div>
        </div>

        {/* Center / Right: Quick jump, Theme toggle, Live site link, User avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick jump search */}
          <div className="relative" ref={searchRef}>
            <div className="relative hidden lg:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Quick jump... (e.g. projects)"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-neutral-800 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Quick jump dropdown */}
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Quick Navigation
                </div>
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-neutral-500 text-center">
                    No matching admin sections found
                  </div>
                ) : (
                  searchResults.map(([tabKey, info]) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => {
                        onSelectTab(tabKey as AdminTab);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {info.label}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {info.group}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            id="admin-theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            title={`Active theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* Live Site ↗ Link */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* User Avatar Circle */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
              title={userEmail || 'manojkc1dev@gmail.com'}
            >
              M
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1.5 z-50">
                <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Manoj Khatri (Admin)
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {userEmail || 'manojkc1dev@gmail.com'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('security');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>Security & Credentials</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Website Settings</span>
                </button>

                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
