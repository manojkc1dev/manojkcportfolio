import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  User,
  Inbox,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import type { AdminTab } from './types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  unreadInquiriesCount?: number;
  userEmail?: string | null;
  onSignOut?: () => void;
  onBackToHome: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  unreadInquiriesCount = 0,
  userEmail = 'manojkc1dev@gmail.com',
  onSignOut,
  onBackToHome,
}) => {
  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  const navItemClass = (active: boolean) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
      active
        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section: OVERVIEW */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Overview
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={navItemClass(currentTab === 'dashboard')}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
          </div>

          {/* Section: PORTFOLIO CONTENT */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Portfolio Content
            </div>
            <div className="space-y-1">
              {/* Projects & Demos */}
              <button
                type="button"
                onClick={() => handleNavClick('projects')}
                className={navItemClass(currentTab === 'projects')}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects &amp; Demos</span>
                </div>
              </button>

              {/* Skills & Tech Stack */}
              <button
                type="button"
                onClick={() => handleNavClick('skills')}
                className={navItemClass(currentTab === 'skills')}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4" />
                  <span>Skills &amp; Tech Stack</span>
                </div>
              </button>

              {/* Experience & Timeline */}
              <button
                type="button"
                onClick={() => handleNavClick('experience')}
                className={navItemClass(currentTab === 'experience')}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Experience &amp; Timeline</span>
                </div>
              </button>

              {/* About & Profile Bio */}
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className={navItemClass(currentTab === 'about')}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>About Me &amp; Bio</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: COMMUNICATION */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Communication
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('inquiries')}
                className={navItemClass(currentTab === 'inquiries')}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Contact Inquiries</span>
                </div>
                {unreadInquiriesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {unreadInquiriesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('socials')}
                className={navItemClass(currentTab === 'socials')}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4" />
                  <span>Socials &amp; Direct Contact</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: SYSTEM */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              System
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('settings')}
                className={navItemClass(currentTab === 'settings' || currentTab === 'security')}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Settings &amp; Backup</span>
                </div>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span>View Live Portfolio</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                M
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  Manoj Khatri
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {userEmail || 'manojkc1dev@gmail.com'}
                </div>
              </div>
            </div>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                title="Sign out of Admin Portal"
                className="p-1.5 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
