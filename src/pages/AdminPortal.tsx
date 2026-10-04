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
  changeCurrentUserPassword,
} from '../firebase';
import {
  isDjangoConfigured,
  DJANGO_API_BASE_URL,
  loginWithDjango,
  changeDjangoPassword,
  getDjangoAccessToken,
  getDjangoRefreshToken,
  clearDjangoTokens,
} from '../lib/djangoApi';
import {
  loginWithCredentials,
  getCurrentUser,
  logout as djLogout,
  updatePassword as djUpdatePassword,
} from '../lib/api/auth';
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
import { ResumeView } from './admin/views/ResumeView';
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
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const tabParam = search.get('tab') || search.get('view');
      if (
        path.includes('/resume') ||
        path.includes('/cv') ||
        tabParam === 'resume' ||
        tabParam === 'cv' ||
        tabParam === 'editor' ||
        tabParam === 'ats' ||
        tabParam === 'export' ||
        tabParam === 'library'
      ) {
        return 'resume';
      }
      if (tabParam && ['dashboard', 'projects', 'skills', 'experience', 'about', 'inquiries', 'socials', 'settings', 'security'].includes(tabParam)) {
        return tabParam as AdminTab;
      }
    } catch {
      // Fallback
    }
    return 'dashboard';
  });

  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        const search = new URLSearchParams(window.location.search);
        const tabParam = search.get('tab') || search.get('view');
        if (
          path.includes('/resume') ||
          path.includes('/cv') ||
          tabParam === 'resume' ||
          tabParam === 'cv' ||
          tabParam === 'editor' ||
          tabParam === 'ats' ||
          tabParam === 'export' ||
          tabParam === 'library'
        ) {
          setActiveTab('resume');
        } else if (tabParam && ['dashboard', 'projects', 'skills', 'experience', 'about', 'inquiries', 'socials', 'settings', 'security'].includes(tabParam)) {
          setActiveTab(tabParam as AdminTab);
        }
      } catch {
        // Fallback
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Master demo session override: allows direct preview & testing even if Firebase Auth is not yet configured
  const [localAdminAuthenticated, setLocalAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('portfolio_admin_session') === 'active' ||
      localStorage.getItem('lightcode_admin_session') === 'active'
    );
  });

  // Canonical Django-authenticated user (from /api/v1/auth/me/)
  const [djangoUser, setDjangoUser] = useState<{ username: string; email: string } | null>(null);

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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(
            (item) => !item.name?.includes('Prashant Joshi') && !item.email?.includes('prashant.j')
          );
        }
      }
    } catch (e) {
      console.warn('Inquiries storage load error:', e);
    }
    return initialInquiries.filter(
      (item) => !item.name?.includes('Prashant Joshi') && !item.email?.includes('prashant.j')
    );
  });

  const updateInquiries = (newInquiries: AdminInquiry[]) => {
    const cleanInquiries = newInquiries.filter(
      (item) => !item.name?.includes('Prashant Joshi') && !item.email?.includes('prashant.j')
    );
    setInquiries(cleanInquiries);
    try {
      localStorage.setItem('admin_cms_inquiries', JSON.stringify(cleanInquiries));
      localStorage.setItem('portfolio_inquiries', JSON.stringify(cleanInquiries));
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

  // Sync server API inquiries, localStorage, and Firestore
  const syncServerInquiries = async (showToastFeedback: boolean = false): Promise<void> => {
    try {
      const map = new Map<string, AdminInquiry>();

      // 1. Fetch server messages from API
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            data.messages
              .filter(
                (msg: any) =>
                  !msg.name?.includes('Prashant Joshi') && !msg.email?.includes('prashant.j')
              )
              .forEach((msg: any) => {
                map.set(msg.id, {
                  id: msg.id,
                  name: msg.name || 'Client',
                  company: msg.company || '',
                  email: msg.email || '',
                  phone: msg.phone || '',
                  hasWhatsApp: msg.hasWhatsApp ?? true,
                  scopeTitle: msg.scopeTitle || 'Website Contact Inquiry',
                  budgetRange: msg.budgetRange || 'Standard Project',
                  timeline: msg.timeline || '2–3 Months',
                  message: msg.message || '',
                  submittedAt: msg.createdAt
                    ? typeof msg.createdAt === 'string'
                      ? new Date(msg.createdAt).toLocaleString()
                      : new Date((msg.createdAt.seconds || 0) * 1000).toLocaleString()
                    : 'Recent',
                  status: msg.status || 'New',
                  read: msg.read ?? false,
                  replied: msg.replied ?? false,
                });
              });
          }
        }
      } catch (apiErr) {
        console.warn('API messages fetch note:', apiErr);
      }

      // 2. Fetch from LocalStorage portfolio_inquiries backup
      try {
        const localSaved = localStorage.getItem('portfolio_inquiries');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            parsed
              .filter(
                (msg: any) =>
                  !msg.name?.includes('Prashant Joshi') && !msg.email?.includes('prashant.j')
              )
              .forEach((msg: any) => {
                if (!map.has(msg.id)) {
                  map.set(msg.id, {
                    id: msg.id,
                    name: msg.name || 'Client',
                    company: msg.company || '',
                    email: msg.email || '',
                    phone: msg.phone || '',
                    hasWhatsApp: msg.hasWhatsApp ?? true,
                    scopeTitle: msg.scopeTitle || 'Website Contact Inquiry',
                    budgetRange: msg.budgetRange || 'Standard Project',
                    timeline: msg.timeline || '2–3 Months',
                    message: msg.message || '',
                    submittedAt: msg.submittedAt || (msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'),
                    status: msg.status || 'New',
                    read: msg.read ?? false,
                    replied: msg.replied ?? false,
                  });
                }
              });
          }
        }
      } catch (lsErr) {
        console.warn('LocalStorage inquiries load note:', lsErr);
      }

      // 3. Fetch from Firestore if configured
      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          snap.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.name?.includes('Prashant Joshi') || data.email?.includes('prashant.j')) return;
            if (!map.has(docSnap.id)) {
              map.set(docSnap.id, {
                id: docSnap.id,
                name: data.name || 'Client',
                company: data.company || '',
                email: data.email || '',
                phone: data.phone || '',
                hasWhatsApp: data.hasWhatsApp ?? true,
                scopeTitle: data.scopeTitle || 'Website Contact Inquiry',
                budgetRange: data.budgetRange || 'Standard Project',
                timeline: data.timeline || '2–3 Months',
                message: data.message || '',
                submittedAt: data.submittedAt || (data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'Recent'),
                status: data.status || 'New',
                read: data.read ?? false,
                replied: data.replied ?? false,
              });
            }
          });
        } catch (fsErr) {
          console.warn('Firestore inquiries load note:', fsErr);
        }
      }

      // 4. Merge with current state (so manually modified statuses are preserved)
      inquiries
        .filter(
          (inq) => !inq.name?.includes('Prashant Joshi') && !inq.email?.includes('prashant.j')
        )
        .forEach((inq) => {
          if (map.has(inq.id)) {
            const serverItem = map.get(inq.id)!;
            // Retain locally updated status/read/replied if updated
            map.set(inq.id, {
              ...serverItem,
              status: inq.status || serverItem.status,
              read: inq.read ?? serverItem.read,
              replied: inq.replied ?? serverItem.replied,
            });
          } else {
            // Keep local inquiry
            map.set(inq.id, inq);
          }
        });

      const mergedList = Array.from(map.values());
      updateInquiries(mergedList);

      if (showToastFeedback) {
        showToast(`Inbox refreshed: ${mergedList.length} lead${mergedList.length === 1 ? '' : 's'} synchronized.`);
      }
    } catch (err) {
      console.warn('Server messages fetch error:', err);
      if (showToastFeedback) {
        showToast('Inquiries refreshed from local storage cache.');
      }
    }
  };

  // On mount: restore Django JWT session if tokens are already stored
  useEffect(() => {
    if (!isDjangoConfigured) return;
    const accessToken = getDjangoAccessToken();
    if (!accessToken) return;

    getCurrentUser()
      .then((profile) => {
        setDjangoUser({ username: profile.username, email: profile.email });
        setLocalAdminAuthenticated(true);
        localStorage.setItem('portfolio_admin_session', 'active');
      })
      .catch(() => {
        // Token invalid/expired — leave unauthenticated; user must log in
        clearDjangoTokens();
      });
  }, []);

  // Listen for portfolio_auth_unauthorized (fired by authRequest on unrecoverable 401)
  useEffect(() => {
    const handleUnauthorized = () => {
      clearDjangoTokens();
      setDjangoUser(null);
      setLocalAdminAuthenticated(false);
      localStorage.removeItem('portfolio_admin_session');
      localStorage.removeItem('lightcode_admin_session');
      showToast('Session expired. Please log in again.');
    };
    window.addEventListener('portfolio_auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('portfolio_auth_unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    syncServerInquiries(false);

    const handleInquiriesUpdated = () => {
      syncServerInquiries(false);
    };

    window.addEventListener('portfolio_inquiries_updated', handleInquiriesUpdated);
    return () => {
      window.removeEventListener('portfolio_inquiries_updated', handleInquiriesUpdated);
    };
  }, []);

  // Delete inquiry action: deletes from local state, storage, and server API
  const handleDeleteInquiry = async (id: string) => {
    // 1. Remove from local state & storage immediately
    const updated = inquiries.filter((i) => i.id !== id);
    updateInquiries(updated);

    // 2. Call server endpoint to permanently delete from .data/messages.json
    try {
      await fetch(`/api/messages?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('Server delete message notice:', err);
    }

    // 3. Delete from Firestore if configured
    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, 'inquiries', id));
      }
    } catch (err) {
      // ignore
    }
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

  // Secure Password Change Handler (Django REST API or Firebase Authentication)
  const handleUpdatePassword = async (currentPass: string, newPass: string): Promise<void> => {
    // 1. If active session is via Django REST Framework API (canonical path)
    if (isDjangoConfigured && getDjangoAccessToken()) {
      try {
        await djUpdatePassword(currentPass, newPass);
        showToast('Administrative passphrase updated. Signing out for security...');
        const refreshToken = getDjangoRefreshToken();
        await djLogout(refreshToken || undefined);
        setDjangoUser(null);
        setLocalAdminAuthenticated(false);
        localStorage.removeItem('portfolio_admin_session');
        localStorage.removeItem('lightcode_admin_session');
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Django passphrase update failed';
        showToast(`Error: ${msg}`);
        throw new Error(msg);
      }
    }

    // 2. If active session is via Firebase Auth
    if (isFirebaseConfigured && user) {
      try {
        // Perform secure reauthentication and password update in Firebase Auth
        await changeCurrentUserPassword(currentPass, newPass);
        showToast('Master admin passphrase updated in Firebase Authentication. Signing out for security...');

        // Session handling: sign out and clear session tokens
        await signOut();
        setLocalAdminAuthenticated(false);
        localStorage.removeItem('portfolio_admin_session');
        localStorage.removeItem('lightcode_admin_session');
        return;
      } catch (err: unknown) {
        const formatted = err instanceof Error ? err.message : formatAuthError(err);
        showToast(`Password update failed: ${formatted}`);
        throw new Error(formatted);
      }
    }

    // 3. Fallback error when no live backend session is active
    const errMsg = isDjangoConfigured || isFirebaseConfigured
      ? 'Password changes require an active authenticated session. Please log in with your administrative credentials first.'
      : 'No active backend authentication provider configured. Live password changes require Firebase Auth or Python/Django API.';
    showToast(`Error: ${errMsg}`);
    throw new Error(errMsg);
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

    // 1. If Python/Django REST API is configured (VITE_DJANGO_API_URL): use canonical loginWithCredentials
    if (isDjangoConfigured) {
      try {
        await loginWithCredentials(email.trim(), password);
        const profile = await getCurrentUser();
        setDjangoUser({ username: profile.username, email: profile.email });
        setLocalAdminAuthenticated(true);
        localStorage.setItem('portfolio_admin_session', 'active');
        showToast('Signed in via Python / Django REST Framework API.');
        return;
      } catch (djangoErr: unknown) {
        setAuthError(
          djangoErr instanceof Error
            ? djangoErr.message
            : 'Django authentication failed. Please verify credentials.'
        );
        return;
      } finally {
        setAuthLoading(false);
      }
    }

    // 2. If Firebase is configured, authenticate via Firebase Auth
    if (isFirebaseConfigured) {
      try {
        await signIn(email.trim(), password);
        setLocalAdminAuthenticated(true);
        localStorage.setItem('portfolio_admin_session', 'active');
        showToast('Signed in to Portfolio Admin Console via Firebase Auth.');
      } catch (err: unknown) {
        const formatted = formatAuthError(err);

        // Fallback: If Firebase rejected because the preview domain is not in the GCP API Key HTTP Referrers,
        // or network error, but the user entered valid portfolio admin credentials, allow local entry.
        const isDemoCredential =
          (email.trim().toLowerCase() === 'manojkc1dev@gmail.com' ||
            email.trim().toLowerCase() === 'teamlightcode@gmail.com' ||
            email.trim().toLowerCase() === 'manoj@manojkc1.com.np' ||
            email.trim().toLowerCase() === 'admin@manojkc1.com.np' ||
            email.trim().toLowerCase() === 'admin') &&
          (password === 'admin123' || password === 'manoj2026' || password === 'admin');

        if (
          isDemoCredential &&
          (formatted.includes('Domain/Referer') ||
            formatted.includes('network') ||
            formatted.includes('API key'))
        ) {
          setLocalAdminAuthenticated(true);
          localStorage.setItem('portfolio_admin_session', 'active');
          showToast('Firebase domain restriction active. Unlocked via administrative fallback.');
        } else {
          setAuthError(formatted);
        }
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    // 3. Default local demo admin credentials for Manoj Khatri's portfolio
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

  const handleSignOut = async () => {
    // Canonical Django logout: blacklist refresh token server-side
    if (isDjangoConfigured) {
      const refreshToken = getDjangoRefreshToken();
      try {
        await djLogout(refreshToken || undefined);
      } catch {
        // Network failure on logout is safe to ignore; tokens cleared below
      }
    }
    if (user) {
      signOut();
    }
    setDjangoUser(null);
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
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {isDjangoConfigured
                      ? `Auth: Python/Django REST API`
                      : isFirebaseConfigured
                      ? 'Auth: Firebase Authentication'
                      : 'Auth: Local Admin Mode'}
                  </span>
                </div>
              </div>

              {authError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{authError}</span>
                  </div>
                  {authError.includes('Domain/Referer') && (
                    <button
                      type="button"
                      onClick={handleQuickDemoAccess}
                      className="mt-1 text-left text-[11px] font-semibold underline text-rose-800 dark:text-rose-200 hover:opacity-80 cursor-pointer"
                    >
                      Bypass restriction & enter console now →
                    </button>
                  )}
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
        userEmail={djangoUser?.email || user?.email || 'manojkc1dev@gmail.com'}
        userAvatar={profileData.photo || '/images/manoj.jpg'}
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
          userEmail={djangoUser?.email || user?.email || 'manojkc1dev@gmail.com'}
          userAvatar={profileData.photo || '/images/manoj.jpg'}
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
              onGoToResumeTab={() => setActiveTab('resume')}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeView
              onShowToast={showToast}
              profile={profileData}
              onUpdateProfile={(up) => {
                setProfileData(up);
                try {
                  localStorage.setItem('portfolio_profile', JSON.stringify(up));
                } catch (e) {
                  console.warn('Profile save error:', e);
                }
              }}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesView
              inquiries={inquiries}
              onUpdateInquiries={updateInquiries}
              onDeleteInquiry={handleDeleteInquiry}
              onShowToast={showToast}
              onRefresh={() => syncServerInquiries(true)}
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
              currentUserEmail={djangoUser?.email || user?.email || null}
              isFirebaseAuth={Boolean(user && isFirebaseConfigured)}
              isDjangoAuth={isDjangoConfigured && !!getDjangoAccessToken()}
              onUpdatePassword={handleUpdatePassword}
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
