import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type Timestamp,
} from 'firebase/firestore';
import {
  useAuth,
  formatAuthError,
  db,
  isFirebaseConfigured,
} from '../firebase';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

import type {
  AdminTab,
  AdminProject,
  AdminService,
  AdminArticle,
  AdminInquiry,
  AdminSiteContent,
} from './admin/types';
import {
  initialProjects,
  initialServices,
  initialArticles,
  initialInquiries,
  initialSiteContent,
} from './admin/mockData';
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { DashboardView } from './admin/views/DashboardView';
import { ProjectsView } from './admin/views/ProjectsView';
import { SkillsView } from './admin/views/SkillsView';
import { ExperienceView } from './admin/views/ExperienceView';
import { AboutView } from './admin/views/AboutView';
import { SocialsView } from './admin/views/SocialsView';
import { InquiriesView } from './admin/views/InquiriesView';
import { SettingsView } from './admin/views/SettingsView';
import { skills as defaultSkills, currentFocus as defaultFocus } from '../data/skills';
import { experience as defaultExperience } from '../data/experience';
import { profile as defaultProfile } from '../data/profile';
import type { SkillCategory, SkillItem, Experience, Profile } from '../types';

interface AdminPortalProps {
  onBackToHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToHome }) => {
  const { user, signIn, signUp, resetPassword, signOut } = useAuth();
  const { theme } = useTheme();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Master demo session override: allows direct preview & testing even if Firebase Auth is not yet configured
  const [localAdminAuthenticated, setLocalAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('portfolio_admin_session') === 'active' ||
      localStorage.getItem('lightcode_admin_session') === 'active'
    );
  });

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // State: Projects
  const [projects, setProjects] = useState<AdminProject[]>(() => {
    try {
      const saved = localStorage.getItem('admin_cms_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Projects storage load error:', e);
    }
    return initialProjects;
  });

  const updateProjects = (newProjects: AdminProject[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('admin_cms_projects', JSON.stringify(newProjects));
      localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Projects storage save error:', e);
    }
  };

  // State: Skills & Current Focus
  const [skills, setSkills] = useState<SkillCategory[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_skills');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Skills storage load error:', e);
    }
    return defaultSkills;
  });

  const updateSkills = (newSkills: SkillCategory[]) => {
    setSkills(newSkills);
    try {
      localStorage.setItem('portfolio_skills', JSON.stringify(newSkills));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Skills storage save error:', e);
    }
  };

  const [currentFocus, setCurrentFocus] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_current_focus');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Current focus storage load error:', e);
    }
    return defaultFocus;
  });

  const updateCurrentFocus = (newFocus: SkillItem[]) => {
    setCurrentFocus(newFocus);
    try {
      localStorage.setItem('portfolio_current_focus', JSON.stringify(newFocus));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Current focus storage save error:', e);
    }
  };

  // State: Experience
  const [experienceList, setExperienceList] = useState<Experience[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_experience');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Experience storage load error:', e);
    }
    return defaultExperience;
  });

  const updateExperience = (newExp: Experience[]) => {
    setExperienceList(newExp);
    try {
      localStorage.setItem('portfolio_experience', JSON.stringify(newExp));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Experience storage save error:', e);
    }
  };

  // State: Profile (Bio, Headline, Stats, Socials)
  const [profileData, setProfileData] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem('portfolio_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Profile storage load error:', e);
    }
    return defaultProfile;
  });

  // State: Services
  const [services, setServices] = useState<AdminService[]>(() => {
    try {
      const saved = localStorage.getItem('admin_cms_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Services storage load error:', e);
    }
    return initialServices;
  });

  const updateServices = (newServices: AdminService[]) => {
    setServices(newServices);
    try {
      localStorage.setItem('admin_cms_services', JSON.stringify(newServices));
    } catch (e) {
      console.warn('Services storage save error:', e);
    }
  };

  // State: Articles
  const [articles, setArticles] = useState<AdminArticle[]>(() => {
    try {
      const saved = localStorage.getItem('admin_cms_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Articles storage load error:', e);
    }
    return initialArticles;
  });

  const updateArticles = (newArticles: AdminArticle[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem('admin_cms_articles', JSON.stringify(newArticles));
    } catch (e) {
      console.warn('Articles storage save error:', e);
    }
  };

  // State: Inquiries
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('admin_cms_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Inquiries storage load error:', e);
    }
    return initialInquiries;
  });

  const updateInquiries = (newInquiries: AdminInquiry[]) => {
    setInquiries(newInquiries);
    try {
      localStorage.setItem('admin_cms_inquiries', JSON.stringify(newInquiries));
      localStorage.setItem('portfolio_inquiries', JSON.stringify(newInquiries));
    } catch (e) {
      console.warn('Inquiries storage save error:', e);
    }
  };

  // State: Site Content
  const [siteContent, setSiteContent] = useState<AdminSiteContent>(() => {
    try {
      const saved = localStorage.getItem('admin_cms_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Content storage load error:', e);
    }
    return initialSiteContent;
  });

  const updateSiteContent = (newContent: AdminSiteContent) => {
    setSiteContent(newContent);
    try {
      localStorage.setItem('admin_cms_content', JSON.stringify(newContent));
    } catch (e) {
      console.warn('Content storage save error:', e);
    }
  };

  // Sync server API inquiries on load
  const syncServerInquiries = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          const mergedMap = new Map<string, AdminInquiry>();
          // Existing
          inquiries.forEach((inq) => mergedMap.set(inq.id, inq));
          // Server messages mapped to AdminInquiry
          data.messages.forEach((msg: any) => {
            const existing = mergedMap.get(msg.id);
            mergedMap.set(msg.id, {
              id: msg.id,
              name: msg.name || existing?.name || 'Anonymous Client',
              company: msg.company || existing?.company || '',
              email: msg.email || existing?.email || '',
              phone: msg.phone || existing?.phone || '',
              hasWhatsApp: msg.hasWhatsApp ?? existing?.hasWhatsApp ?? true,
              scopeTitle: msg.scopeTitle || existing?.scopeTitle || 'Custom Software Project',
              budgetRange: msg.budgetRange || existing?.budgetRange || 'NPR 100,000–200,000 (~US$750–1,500)',
              timeline: msg.timeline || existing?.timeline || '2–3 Months',
              message: msg.message || existing?.message || '',
              submittedAt: msg.createdAt
                ? typeof msg.createdAt === 'string'
                  ? msg.createdAt
                  : new Date((msg.createdAt.seconds || 0) * 1000).toLocaleString()
                : existing?.submittedAt || 'Recent',
              status: msg.status || existing?.status || 'New',
              read: msg.read ?? existing?.read ?? false,
              replied: msg.replied ?? existing?.replied ?? false,
            });
          });
          const mergedList = Array.from(mergedMap.values());
          updateInquiries(mergedList);
        }
      }
    } catch (err) {
      console.warn('Server messages fetch notice:', err);
    }
  };

  useEffect(() => {
    syncServerInquiries();
  }, []);

  // Quick Action Handlers
  const handleAddTestInquiry = async () => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          const newInq: AdminInquiry = {
            id: data.message.id,
            name: data.message.name,
            company: data.message.company || 'Kathmandu Enterprise Hub',
            email: data.message.email,
            phone: data.message.phone || '+977 9851099887',
            hasWhatsApp: true,
            scopeTitle: data.message.scopeTitle || 'Enterprise ERP & Inventory Platform',
            budgetRange: data.message.budgetRange || 'NPR 150,000–300,000 (~US$1,100–2,200)',
            timeline: data.message.timeline || '2 Months',
            message: data.message.message,
            submittedAt: 'Just now',
            status: 'New',
            read: false,
            replied: false,
          };
          updateInquiries([newInq, ...inquiries.filter((i) => i.id !== newInq.id)]);
          showToast('New simulated lead inquiry received in inbox!');
          return;
        }
      }
    } catch (err) {
      console.warn('Test inquiry fallback to local:', err);
    }

    // Local fallback
    const localTest: AdminInquiry = {
      id: `inq-${Date.now()}`,
      name: 'Rohan Shrestha',
      company: 'Himalayan Retail Group',
      email: 'rohan.shrestha@example.com',
      phone: '+977 9851234567',
      hasWhatsApp: true,
      scopeTitle: 'Multi-Branch ERP & POS System',
      budgetRange: 'NPR 200,000–300,000 (~US$1,500–2,250)',
      timeline: '2 Months',
      message: 'Looking for a unified inventory, billing, and accounting suite connecting 3 retail outlets in Kathmandu with offline sync support.',
      submittedAt: 'Just now',
      status: 'New',
      read: false,
      replied: false,
    };
    updateInquiries([localTest, ...inquiries]);
    showToast('New simulated lead inquiry received!');
  };

  const handleImportAllData = (imported: any) => {
    if (imported.projects && Array.isArray(imported.projects)) {
      updateProjects(imported.projects);
    }
    if (imported.services && Array.isArray(imported.services)) {
      updateServices(imported.services);
    }
    if (imported.articles && Array.isArray(imported.articles)) {
      updateArticles(imported.articles);
    }
    if (imported.inquiries && Array.isArray(imported.inquiries)) {
      updateInquiries(imported.inquiries);
    }
    if (imported.content && typeof imported.content === 'object') {
      updateSiteContent(imported.content);
    }
    showToast('Database restore complete: All modules updated.');
  };

  // Auth Submit Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setAuthError('Please enter both administrative email and password.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    // If Firebase is configured, authenticate via Firebase Auth
    if (isFirebaseConfigured) {
      try {
        await signIn(email.trim(), password);
        setLocalAdminAuthenticated(true);
        localStorage.setItem('portfolio_admin_session', 'active');
        showToast('Signed in to Portfolio Admin Console.');
      } catch (err: unknown) {
        setAuthError(formatAuthError(err));
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    // Default local demo admin credentials for Manoj Khatri's portfolio
    if (
      (email.trim().toLowerCase() === 'manojkc1dev@gmail.com' ||
        email.trim().toLowerCase() === 'teamlightcode@gmail.com' ||
        email.trim().toLowerCase() === 'manoj@manojkc1.com.np' ||
        email.trim().toLowerCase() === 'admin@manojkc1.com.np' ||
        email.trim().toLowerCase() === 'admin') &&
      (password === 'admin123' || password === 'manoj2026' || password === 'admin')
    ) {
      setLocalAdminAuthenticated(true);
      localStorage.setItem('portfolio_admin_session', 'active');
      setAuthLoading(false);
      showToast('Administrative portfolio session active.');
    } else {
      setAuthLoading(false);
      setAuthError('Invalid credentials. Use manojkc1dev@gmail.com / admin123, or click Instant Demo Access.');
    }
  };

  const handleQuickDemoAccess = () => {
    setLocalAdminAuthenticated(true);
    localStorage.setItem('portfolio_admin_session', 'active');
    showToast('Demo administrative console unlocked.');
  };

  const handleSignOut = () => {
    if (user) {
      signOut();
    }
    setLocalAdminAuthenticated(false);
    localStorage.removeItem('portfolio_admin_session');
    localStorage.removeItem('lightcode_admin_session');
    showToast('Signed out of administrative console.');
  };

  const isAuthenticated = !!user || localAdminAuthenticated;

  // Render: Not Authenticated (Login screen with full light & dark mode)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-200 selection:bg-blue-600 selection:text-white">
        {/* Top Minimal Bar */}
        <header className="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Login Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-6 sm:p-8"
            >
              {/* Shield Icon */}
              <div className="flex items-center justify-center mb-5">
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Manoj Khatri | Portfolio Admin Console
                </h1>
                <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Manage projects, services, engineering case studies, skills, and client inquiries.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                  <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>RESTRICTED ZONE · PORTFOLIO CONSOLE</span>
                </div>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="manojkc1dev@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Console'}
                </button>
              </form>

              {/* Quick Demo Access Bypass Button */}
              <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-xs transition-colors cursor-pointer w-full justify-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Demo Access (No Credentials Required)</span>
                </button>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Default credentials: <code className="font-mono">manojkc1dev@gmail.com</code> / <code className="font-mono">admin123</code>
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <footer className="text-center py-4 text-[11px] text-neutral-400">
          Manoj Khatri · Backend Software Engineer · Kathmandu, Nepal
        </footer>
      </div>
    );
  }

  // Render: Authenticated Master Admin Portal
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-md p-3.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <AdminHeader
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onBackToHome={onBackToHome}
        onSignOut={handleSignOut}
        userEmail={user?.email || 'manojkc1dev@gmail.com'}
      />

      {/* Main Body Layout: Sidebar + Active Content View */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          unreadInquiriesCount={inquiries.filter((i) => !i.read).length}
          userEmail={user?.email || 'manojkc1dev@gmail.com'}
          onSignOut={handleSignOut}
          onBackToHome={onBackToHome}
        />

        {/* Dynamic View Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              inquiries={inquiries}
              skillsCount={skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
              focusCount={currentFocus.length}
              experienceCount={experienceList.length}
              onSelectTab={setActiveTab}
              onAddProject={() => setActiveTab('projects')}
              onViewInquiry={() => setActiveTab('inquiries')}
              onBackToHome={onBackToHome}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onUpdateProjects={updateProjects}
              onShowToast={showToast}
            />
          )}

          {(activeTab === 'skills' || activeTab === 'services' || activeTab === 'services-catalog') && (
            <SkillsView
              skills={skills}
              currentFocus={currentFocus}
              onUpdateSkills={updateSkills}
              onUpdateCurrentFocus={updateCurrentFocus}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceView
              experience={experienceList}
              onUpdateExperience={updateExperience}
              onShowToast={showToast}
            />
          )}

          {(activeTab === 'about' ||
            activeTab === 'homepage' ||
            activeTab === 'logo-management' ||
            activeTab === 'company-identity') && (
            <AboutView
              profile={profileData}
              onUpdateProfile={setProfileData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesView
              inquiries={inquiries}
              onUpdateInquiries={updateInquiries}
              onShowToast={showToast}
              onRefresh={syncServerInquiries}
              onAddTestInquiry={handleAddTestInquiry}
            />
          )}

          {(activeTab === 'socials' ||
            activeTab === 'contact-pricing' ||
            activeTab === 'footer-links' ||
            activeTab === 'social-media') && (
            <SocialsView
              email={profileData.email}
              phone="+977 9842203976"
              location={profileData.location}
              socials={profileData.socials}
              onUpdateSocials={(data) => {
                const updated = {
                  ...profileData,
                  email: data.email,
                  location: data.location,
                  socials: data.socials,
                };
                setProfileData(updated);
                try {
                  localStorage.setItem('portfolio_profile', JSON.stringify(updated));
                } catch (e) {
                  console.warn('Profile save failed:', e);
                }
              }}
              onShowToast={showToast}
            />
          )}

          {(activeTab === 'settings' || activeTab === 'security' || (activeTab as string) === 'blog') && (
            <SettingsView
              onShowToast={showToast}
              allData={{
                projects,
                skills,
                currentFocus,
                experience: experienceList,
                profile: profileData,
                inquiries,
              }}
              onImportAllData={handleImportAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
};
