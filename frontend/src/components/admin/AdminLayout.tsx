import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { DashboardOverview } from './DashboardOverview';
import { HeroEditor } from './HeroEditor';
import { TechStackManager } from './TechStackManager';
import { ProjectManager } from './ProjectManager';
import { BlogManager } from './BlogManager';
import { ContactInbox } from './ContactInbox';
import { MediaManager } from './MediaManager';
import { NewsletterManager } from './NewsletterManager';
import { AuditLogViewer } from './AuditLogViewer';
import { ResumeManager } from './ResumeManager';
import {
  LayoutDashboard,
  User,
  Code2,
  Folder,
  BookOpen,
  MessageSquare,
  Image,
  Mail,
  ShieldCheck,
  Globe,
  LogOut,
  ChevronRight,
  Terminal,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'hero'
  | 'resume'
  | 'techstack'
  | 'projects'
  | 'blogs'
  | 'inbox'
  | 'media'
  | 'newsletter'
  | 'audit';

export const AdminLayout: React.FC = () => {
  const { setViewMode, logoutJwt, messages } = useCMS();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const unreadCount = messages.filter((m) => m.status === 'Unread').length;

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'hero' as AdminTab, label: 'Hero Section', icon: User },
    { id: 'resume' as AdminTab, label: 'Resume & CV Manager', icon: FileText },
    { id: 'techstack' as AdminTab, label: 'Tech Stack & Skills', icon: Code2 },
    { id: 'projects' as AdminTab, label: 'Case Studies', icon: Folder },
    { id: 'blogs' as AdminTab, label: 'Blog Articles', icon: BookOpen },
    { id: 'inbox' as AdminTab, label: 'Inquiries Inbox', icon: MessageSquare, badge: unreadCount },
    { id: 'media' as AdminTab, label: 'Media Assets', icon: Image },
    { id: 'newsletter' as AdminTab, label: 'Subscribers', icon: Mail },
    { id: 'audit' as AdminTab, label: 'Security & Audit Logs', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 sm:p-6 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/40">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white">MANOJ K.C. CMS</h2>
                <span className="text-[10px] font-mono text-indigo-400 block">Admin Session Active</span>
              </div>
            </div>

            <button
              onClick={() => setViewMode('PUBLIC_PORTFOLIO')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Return to Public Portfolio"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Active Auth Badge */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
              </span>
              <span className="text-[9px] font-mono bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300 border border-indigo-800">
                JWT Auth
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">contactmanojkhatri@gmail.com</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Quick Return & Logout Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setViewMode('PUBLIC_PORTFOLIO')}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> Live Portfolio View
          </button>
          <button
            onClick={logoutJwt}
            className="w-full py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout JWT Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'resume' && <ResumeManager />}
        {activeTab === 'techstack' && <TechStackManager />}
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'blogs' && <BlogManager />}
        {activeTab === 'inbox' && <ContactInbox />}
        {activeTab === 'media' && <MediaManager />}
        {activeTab === 'newsletter' && <NewsletterManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
      </main>

    </div>
  );
};
