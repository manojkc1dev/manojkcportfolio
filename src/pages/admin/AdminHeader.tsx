import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  ExternalLink,
  Search,
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
  userAvatar?: string;
  onSignOut?: () => void;
}

const TAB_TITLES: Record<AdminTab, { group: string; label: string }> = {
  dashboard: { group: 'Overview', label: 'Dashboard' },
  projects: { group: 'Portfolio Content', label: 'Projects' },
  skills: { group: 'Portfolio Content', label: 'Skills' },
  experience: { group: 'Portfolio Content', label: 'Experience' },
  about: { group: 'Portfolio Content', label: 'About Me & Bio' },
  resume: { group: 'Portfolio Content', label: 'Resume & CV' },
  inquiries: { group: 'Communication', label: 'Inquiries' },
  socials: { group: 'Communication', label: 'Social Profiles' },
  settings: { group: 'System', label: 'Settings' },
  security: { group: 'System', label: 'Security' },
  // Compatibility
  services: { group: 'Portfolio Content', label: 'Skills' },
  blog: { group: 'Portfolio Content', label: 'Projects' },
  homepage: { group: 'Portfolio Content', label: 'About Me & Bio' },
  'services-catalog': { group: 'Portfolio Content', label: 'Skills' },
  'contact-pricing': { group: 'Communication', label: 'Social Profiles' },
  'footer-links': { group: 'Communication', label: 'Social Profiles' },
  'logo-management': { group: 'Portfolio Content', label: 'About Me & Bio' },
  'company-identity': { group: 'Portfolio Content', label: 'About Me & Bio' },
  'social-media': { group: 'Communication', label: 'Social Profiles' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onToggleSidebar,
  onBackToHome,
  userEmail,
  userAvatar,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const activeBreadcrumb = TAB_TITLES[currentTab] || { group: 'Portfolio Content', label: 'Dashboard' };

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
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Open navigation"
            className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb: Group / Label */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
            <span className="font-medium text-neutral-600 dark:text-neutral-400 truncate">
              {activeBreadcrumb.group}
            </span>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
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
        </div>
      </div>
    </header>
  );
};
