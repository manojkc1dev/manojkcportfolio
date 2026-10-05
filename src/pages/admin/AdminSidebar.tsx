import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  User,
  FileText,
  Inbox,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { AdminTab } from './types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  unreadInquiriesCount?: number;
  userEmail?: string | null;
  userAvatar?: string;
  onSignOut?: () => void;
  onBackToHome: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  unreadInquiriesCount = 0,
  userEmail = 'manojkc1dev@gmail.com',
  userAvatar,
  onSignOut,
  onBackToHome,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [imgError, setImgError] = React.useState(false);
  const avatarUrl = userAvatar || '/images/manoj.jpg';

  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('admin_sidebar_collapsed', String(next));
        } catch {
          // Fallback for restricted storage environments
        }
        return next;
      });
    }
  };

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  const navItemClass = (active: boolean) =>
    `w-full flex items-center ${
      collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
    } rounded-lg text-xs font-medium transition-colors cursor-pointer relative ${
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
        data-testid="admin-sidebar"
        data-collapsed={collapsed ? 'true' : 'false'}
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-all duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-64 lg:w-16' : 'w-64'}`}
      >
        {/* Navigation Scrollable Area */}
        <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-3 space-y-3' : 'px-3 py-4 space-y-6'}`}>
          {/* Accessible Desktop Collapse/Expand Toggle Header */}
          <div
            className={`hidden lg:flex items-center pb-2 border-b border-neutral-100 dark:border-neutral-800/80 ${
              collapsed ? 'justify-center' : 'justify-between px-1'
            }`}
          >
            {!collapsed && (
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Navigation
              </span>
            )}
            <button
              type="button"
              id="admin-sidebar-collapse-toggle"
              data-testid="admin-sidebar-collapse-toggle"
              onClick={handleToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Section: OVERVIEW */}
          <div>
            {!collapsed ? (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Overview
              </div>
            ) : (
              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" role="separator" />
            )}
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              aria-label="Dashboard"
              title="Dashboard"
              aria-current={currentTab === 'dashboard' ? 'page' : undefined}
              className={navItemClass(currentTab === 'dashboard')}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Dashboard</span>}
              </div>
            </button>
          </div>

          {/* Section: PORTFOLIO CONTENT */}
          <div>
            {!collapsed ? (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Portfolio Content
              </div>
            ) : (
              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" role="separator" />
            )}
            <div className="space-y-1">
              {/* Projects & Demos */}
              <button
                type="button"
                onClick={() => handleNavClick('projects')}
                aria-label="Projects & Demos"
                title="Projects & Demos"
                aria-current={currentTab === 'projects' ? 'page' : undefined}
                className={navItemClass(currentTab === 'projects')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <FolderGit2 className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Projects &amp; Demos</span>}
                </div>
              </button>

              {/* Skills & Tech Stack */}
              <button
                type="button"
                onClick={() => handleNavClick('skills')}
                aria-label="Skills & Tech Stack"
                title="Skills & Tech Stack"
                aria-current={currentTab === 'skills' ? 'page' : undefined}
                className={navItemClass(currentTab === 'skills')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Cpu className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Skills &amp; Tech Stack</span>}
                </div>
              </button>

              {/* Experience & Timeline */}
              <button
                type="button"
                onClick={() => handleNavClick('experience')}
                aria-label="Experience & Timeline"
                title="Experience & Timeline"
                aria-current={currentTab === 'experience' ? 'page' : undefined}
                className={navItemClass(currentTab === 'experience')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Briefcase className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Experience &amp; Timeline</span>}
                </div>
              </button>

              {/* About & Profile Bio */}
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                aria-label="About Me & Bio"
                title="About Me & Bio"
                aria-current={currentTab === 'about' ? 'page' : undefined}
                className={navItemClass(currentTab === 'about')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <User className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>About Me &amp; Bio</span>}
                </div>
              </button>

              {/* Resume & Curriculum Vitae */}
              <button
                type="button"
                onClick={() => handleNavClick('resume')}
                aria-label="Resume & CV"
                title="Resume & CV"
                aria-current={currentTab === 'resume' ? 'page' : undefined}
                className={navItemClass(currentTab === 'resume')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <FileText className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Resume &amp; CV</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Section: COMMUNICATION */}
          <div>
            {!collapsed ? (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Communication
              </div>
            ) : (
              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" role="separator" />
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('inquiries')}
                aria-label="Contact Inquiries"
                title={unreadInquiriesCount > 0 ? `Contact Inquiries (${unreadInquiriesCount} unread)` : 'Contact Inquiries'}
                aria-current={currentTab === 'inquiries' ? 'page' : undefined}
                className={navItemClass(currentTab === 'inquiries')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <div className="relative">
                    <Inbox className="w-4 h-4 shrink-0" />
                    {collapsed && unreadInquiriesCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-bold bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        {unreadInquiriesCount > 9 ? '9+' : unreadInquiriesCount}
                      </span>
                    )}
                  </div>
                  {!collapsed && <span>Contact Inquiries</span>}
                </div>
                {!collapsed && unreadInquiriesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {unreadInquiriesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('socials')}
                aria-label="Socials & Direct Contact"
                title="Socials & Direct Contact"
                aria-current={currentTab === 'socials' ? 'page' : undefined}
                className={navItemClass(currentTab === 'socials')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Share2 className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Socials &amp; Direct Contact</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Section: SYSTEM */}
          <div>
            {!collapsed ? (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                System
              </div>
            ) : (
              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" role="separator" />
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('settings')}
                aria-label="Settings & Backup"
                title="Settings & Backup"
                aria-current={currentTab === 'settings' || currentTab === 'security' ? 'page' : undefined}
                className={navItemClass(currentTab === 'settings' || currentTab === 'security')}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Settings className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Settings &amp; Backup</span>}
                </div>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                aria-label="View Live Portfolio"
                title="View Live Portfolio"
                className={`w-full flex items-center ${
                  collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                } rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer`}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0" />
                  {!collapsed && <span>View Live Portfolio</span>}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile Footer */}
        <div className={`border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 ${
          collapsed ? 'p-2' : 'p-3'
        }`}>
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  {!imgError ? (
                    <img
                      src={avatarUrl}
                      alt="Manoj Khatri profile picture"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      M
                    </div>
                  )}
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
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0"
                title={`${userEmail || 'Manoj Khatri'}`}
              >
                {!imgError ? (
                  <img
                    src={avatarUrl}
                    alt="Manoj Khatri profile picture"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    M
                  </div>
                )}
              </div>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  aria-label="Sign out"
                  title="Sign out of Admin Portal"
                  className="p-1.5 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

