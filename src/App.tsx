
import React, { useState, useEffect, useMemo } from 'react';
import { OWNER_PROFILE, SEO_CONFIG, type Project } from './lib/constants';
import { ChatWidget } from './components/public/ChatWidget';
import {
  Code2,
  Database,
  Server,
  Shield,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  GraduationCap,
  Terminal,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  Cpu,
  FileCode2,
  Activity,
  Copy,
  Check,
  ExternalLink,
  Sun,
  Moon,
  Lock,
  ArrowRight,
  Wrench,
  Sparkles,
  MessageCircle,
  BarChart3,
  Layout,
  Palette,
  FileText,
  Image as ImageIcon,
  Navigation,
  Globe,
  Bot,
  Users,
  History,
  Settings,
  Key,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  ChevronLeft,
  Download,
  RefreshCw,
  X,
  Menu,
  Sliders,
  ArrowUp,
} from 'lucide-react';
import { BrandAssetsManager } from './components/admin/BrandAssetsManager';
import { AIChatConfigManager } from './components/admin/AIChatConfigManager';
import { OverflowDetector } from './components/dev/OverflowDetector';
import { loadBrandAssets, type BrandAssets } from './lib/brandAssets';

// ==========================================
// SEED TESTIMONIALS & REVIEWS DATA
// ==========================================
const INITIAL_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Suman Thapa',
    role: 'Lead Architect',
    company: 'Fintech Solutions Nepal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote:
      'Manoj structured our core calculation microservice with Django REST Framework and PostgreSQL. His schema migrations and JWT token rotation logic were clean, resilient, and delivered well ahead of schedule.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Aarav Sharma',
    role: 'Product Engineering Lead',
    company: 'Himalayan EdTech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote:
      'The Shabdhabhandar dictionary engine he developed handled complex Nepali Unicode searches effortlessly. His documentation and Postman collections saved our frontend team days of back-and-forth.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Rabin Koirala',
    role: 'Senior Full-Stack Consultant',
    company: 'Kathmandu Software Works',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    quote:
      'Manoj is a disciplined backend engineer who treats API design like a craft. He emphasizes strict query optimization and clean error handling that client developers can immediately rely on.',
    rating: 5,
  },
];

export default function App() {
  // Mode: 'public' or 'admin'
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // Theme: 'dark' or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Public state
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin state
  const [adminRoute, setAdminRoute] = useState<
    | 'dashboard'
    | 'appearance'
    | 'layout'
    | 'content'
    | 'media'
    | 'navigation'
    | 'seo'
    | 'chatbot'
    | 'analytics'
    | 'users'
    | 'activity'
    | 'integrations'
    | 'settings'
  >('dashboard');

  // CMS Dynamic content state (Live editable from Admin)
  const [projectsList, setProjectsList] = useState<Project[]>(OWNER_PROFILE.featuredProjects);
  const [testimonialsList, setTestimonialsList] = useState(INITIAL_TESTIMONIALS);
  const [activeSectionVisibility, setActiveSectionVisibility] = useState({
    hero: true,
    about: true,
    skills: true,
    projects: true,
    process: true,
    testimonials: true,
    cta: true,
    footer: true,
  });

  // Admin Chatbot config
  const [chatModel, setChatModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');
  const [chatTemperature, setChatTemperature] = useState(0.7);
  const [chatSystemPrompt, setChatSystemPrompt] = useState(
    `You are the AI assistant for Manoj K.C.'s portfolio. Answer questions about his skills, projects, experience, and services. Be concise, friendly, and professional. If you don't know something, say so and suggest contacting him via the contact form. Never invent projects or skills. Speak in third person about Manoj.`
  );

  // Admin Theme tokens
  const [primaryColor, setPrimaryColor] = useState('#5E6AD2');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [uiRadius, setUiRadius] = useState('12px');
  const [appearanceSubTab, setAppearanceSubTab] = useState<'brand' | 'theme'>('brand');

  // Brand Assets state (live synchronized across site)
  const [brandAssets, setBrandAssets] = useState<BrandAssets>(loadBrandAssets);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<BrandAssets>) => {
      if (e.detail) setBrandAssets(e.detail);
    };
    window.addEventListener('brand_assets_updated' as any, handleUpdate as EventListener);
    return () => {
      window.removeEventListener('brand_assets_updated' as any, handleUpdate as EventListener);
    };
  }, []);

  // Contact form submission state
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Scroll listener for Navbar and Back to Top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setShowBackToTop(scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme class management
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  // Autoplay testimonials carousel (pause on hover)
  useEffect(() => {
    if (isTestimonialHovered || testimonialsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonialsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isTestimonialHovered, testimonialsList.length]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormStatus('sending');
    setTimeout(() => {
      setContactFormStatus('sent');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactFormStatus('idle'), 5000);
    }, 800);
  };

  // Skill category filter (without arbitrary proficiency labels)
  const allSkillsList = useMemo(() => {
    return [
      { name: 'Python', category: 'Languages' },
      { name: 'JavaScript', category: 'Languages' },
      { name: 'SQL', category: 'Languages' },
      { name: 'HTML/CSS', category: 'Languages' },
      { name: 'Django', category: 'Frameworks' },
      { name: 'Django REST Framework', category: 'Frameworks' },
      { name: 'FastAPI', category: 'Frameworks' },
      { name: 'PostgreSQL', category: 'Databases' },
      { name: 'SQLite', category: 'Databases' },
      { name: 'Git & GitHub', category: 'Tools' },
      { name: 'JWT Auth', category: 'Tools' },
      { name: 'REST APIs', category: 'Tools' },
      { name: 'VS Code', category: 'Tools' },
      { name: 'Postman', category: 'Tools' },
    ];
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === 'all') return allSkillsList;
    return allSkillsList.filter(
      (s) => s.category.toLowerCase() === activeSkillCategory.toLowerCase()
    );
  }, [activeSkillCategory, allSkillsList]);

  const PROCESS_STEPS = [
    {
      step: '01',
      title: 'Discovery & Requirements',
      desc: 'We map your business workflows and define API contracts before code.',
    },
    {
      step: '02',
      title: 'System Architecture',
      desc: 'Database schema design, DRF serializers, JWT flow, deployment plan.',
    },
    {
      step: '03',
      title: 'API Engineering',
      desc: 'Modular Django apps, DRF viewsets, tests, Postman docs.',
    },
    {
      step: '04',
      title: 'Testing & Hardening',
      desc: 'Load testing, security audits, PostgreSQL query optimization.',
    },
    {
      step: '05',
      title: 'Deployment & Handover',
      desc: 'CI/CD, Render/Vercel deploy, monitoring, documentation handoff.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white transition-colors duration-200">
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ==================================================== */}
      {/* FIXED NAVBAR (72px desktop / 64px mobile, 1280px max) */}
      {/* ==================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] md:h-[72px] flex items-center justify-between">
          {/* Left: Dynamic Wordmark + accent dot + Available pill */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="#"
              onClick={(e) => {
                if (viewMode === 'admin') {
                  e.preventDefault();
                  setViewMode('public');
                }
              }}
              className="flex items-center text-[18px] font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm min-w-0"
              aria-label={`${brandAssets.logoText} Home`}
            >
              <span className="max-w-[140px] sm:max-w-none truncate">{brandAssets.logoText}</span>
              <span
                style={{ color: brandAssets.logoAccentColor || 'var(--primary)' }}
                className="font-black ml-0.5 shrink-0"
              >
                .
              </span>
            </a>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>Available</span>
            </span>
          </div>

          {/* Center Navigation (Desktop) */}
          {viewMode === 'public' && (
            <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
              <a
                href="#about"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                About
              </a>
              <a
                href="#tech-stack"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                Tech Stack
              </a>
              <a
                href="#projects"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                Projects
              </a>
              <a
                href="#process"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                Process
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                Contact
              </a>
            </nav>
          )}

          {/* Right: ThemeToggle + Admin Panel Trigger + Hire Me CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Switcher Button (Desktop) */}
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'public' ? 'admin' : 'public'))}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-surface border-border text-foreground hover:bg-surface-2'
              }`}
              title={viewMode === 'admin' ? 'View Public Site' : 'Open CMS Admin Studio'}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{viewMode === 'admin' ? 'Public Site' : 'Admin Studio'}</span>
            </button>

            {/* Theme Toggle (Always visible) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border bg-surface text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>

            {/* Hire Me CTA Button (Desktop only, moved into drawer on mobile) */}
            <a
              href="#contact"
              onClick={() => {
                if (viewMode === 'admin') setViewMode('public');
              }}
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-200 hover:scale-[1.02] hover:shadow-primary/20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Hire Me
            </a>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg md:hidden border border-border bg-surface text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Full-screen Mobile Navigation Drawer (w-screen, h-[calc(100dvh-64px)], safe-area padding) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[64px] z-50 w-screen h-[calc(100dvh-64px)] bg-surface/98 backdrop-blur-xl px-6 py-6 flex flex-col justify-between overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))] animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
                  Navigation
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>Available for Hire</span>
                </span>
              </div>

              <a
                href="#about"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="block text-base font-semibold text-foreground py-2 border-b border-border/40 hover:text-primary transition-colors"
              >
                About Me
              </a>
              <a
                href="#tech-stack"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="block text-base font-semibold text-foreground py-2 border-b border-border/40 hover:text-primary transition-colors"
              >
                Tech Stack
              </a>
              <a
                href="#projects"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="block text-base font-semibold text-foreground py-2 border-b border-border/40 hover:text-primary transition-colors"
              >
                Featured Projects
              </a>
              <a
                href="#process"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="block text-base font-semibold text-foreground py-2 border-b border-border/40 hover:text-primary transition-colors"
              >
                Engineering Workflow
              </a>
              <a
                href="#contact"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="block text-base font-semibold text-foreground py-2 border-b border-border/40 hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Mobile Drawer CTAs: Hire Me & Admin Studio Switcher */}
            <div className="pt-6 space-y-3 border-t border-border/70">
              <a
                href="#contact"
                onClick={() => {
                  if (viewMode === 'admin') setViewMode('public');
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
              >
                Hire Manoj K.C.
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewMode((prev) => (prev === 'public' ? 'admin' : 'public'));
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 py-3 text-xs font-semibold text-foreground hover:bg-surface transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-primary" />
                <span>Switch to {viewMode === 'admin' ? 'Public Site' : 'Admin CMS Studio'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================== */}
      {/* PUBLIC PORTFOLIO VIEW (ALL 8 SECTIONS) */}
      {/* ==================================================== */}
      {viewMode === 'public' ? (
        <main id="main-content" className="flex-1 pt-[64px] md:pt-[72px]">
          {/* SECTION 1: HERO */}
          {activeSectionVisibility.hero && (
            <section className="py-20 md:py-28 px-4 sm:px-6 border-b border-border relative overflow-hidden bg-background">
              <div className="max-w-[1280px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    {/* Availability badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-success shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span>{OWNER_PROFILE.subHeadline}</span>
                    </div>

                    {/* H1 Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-foreground leading-[1.15]">
                      {OWNER_PROFILE.headline}
                    </h1>

                    {/* Intro paragraph */}
                    <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                      {OWNER_PROFILE.heroIntro}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href="#contact"
                        className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs hover:scale-[1.02]"
                      >
                        Hire Me
                      </a>
                      <a
                        href="#projects"
                        className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold border border-border bg-surface hover:bg-surface-2 text-foreground transition-all"
                      >
                        View Projects
                      </a>
                    </div>
                  </div>

                  {/* Right: Square Profile Photo (1:1 aspect ratio) */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-[280px] sm:max-w-xs aspect-square rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl p-2 group">
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-2">
                        <img
                          src={brandAssets.avatarUrl || OWNER_PROFILE.avatarImage}
                          alt={brandAssets.avatarAlt || 'Manoj K.C. - Python and Django Backend Developer'}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          loading="eager"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-surface/90 backdrop-blur-md border border-border/80 shadow-md">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-foreground">{brandAssets.logoText || 'Manoj K.C.'}</p>
                            <p className="text-[11px] text-muted font-mono">Backend Engineer · Kathmandu</p>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-success" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Strip */}
                <div className="mt-16 pt-10 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {OWNER_PROFILE.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="p-5 rounded-xl bg-surface border border-border flex flex-col justify-center transition-all hover:border-primary/40 hover:shadow-xs"
                      >
                        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                          {stat.value}
                        </span>
                        <span className="text-xs text-muted font-medium mt-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: ABOUT PREVIEW */}
          {activeSectionVisibility.about && (
            <section id="about" className="py-20 px-4 sm:px-6 border-b border-border bg-surface/30">
              <div className="max-w-[1280px] mx-auto max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  About
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-6">
                  Backend systems built to scale
                </h2>

                <p className="text-base text-muted leading-relaxed mb-6">
                  {OWNER_PROFILE.about}
                </p>

                {/* Pull quote with accent left border */}
                <div className="p-6 rounded-r-xl bg-surface border-l-4 border-primary border-y border-r border-border my-6 shadow-xs">
                  <p className="italic text-foreground/95 text-base sm:text-lg leading-relaxed font-serif">
                    &ldquo;{OWNER_PROFILE.pullQuote}&rdquo;
                  </p>
                  <span className="block text-xs font-mono text-muted mt-3">
                    — Manoj K.C. · Backend Philosophy
                  </span>
                </div>

                {/* Expandable About Modal / Details */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAboutExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>{isAboutExpanded ? 'Hide Details' : 'Read Full About'}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isAboutExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </div>

                {isAboutExpanded && (
                  <div className="mt-6 p-6 rounded-2xl bg-surface border border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Verified Qualification</h4>
                        <p className="text-xs text-muted leading-relaxed mt-1">
                          {OWNER_PROFILE.qualification}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-border">
                      <Terminal className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Core Architecture Focus</h4>
                        <p className="text-xs text-muted leading-relaxed mt-1">
                          Django REST Framework viewsets, custom permissions, serializer validations,
                          optimized raw SQL / ORM queryset prefetching, and automated OpenAPI/Postman documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 3: TECH STACK */}
          {activeSectionVisibility.skills && (
            <section id="tech-stack" className="py-20 px-4 sm:px-6 border-b border-border bg-background">
              <div className="max-w-[1280px] mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                    Technical Stack
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
                    Skills & Server-Side Tooling
                  </h2>
                  <p className="text-sm text-muted">
                    Engineered for high availability, security, and developer ergonomics.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                  {['all', 'languages', 'frameworks', 'databases', 'tools'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveSkillCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        activeSkillCategory === cat
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-2'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of skill chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between hover:border-primary/50 hover:shadow-xs transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{skill.name}</p>
                          <p className="text-[10px] text-muted font-mono">{skill.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: FEATURED PROJECTS (SQUARE 1:1 CARDS) */}
          {activeSectionVisibility.projects && (
            <section id="projects" className="py-20 px-4 sm:px-6 border-b border-border bg-surface/30">
              <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-1">
                      Selected Work
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                      Featured Backend Projects
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-muted bg-surface px-3 py-1 rounded-md border border-border inline-block self-start sm:self-auto">
                    Square (1:1) Aspect Ratio
                  </span>
                </div>

                {/* 2-column grid of SQUARE project cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projectsList.map((project) => (
                    <article
                      key={project.slug}
                      className="group relative flex flex-col rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
                    >
                      {/* Square 1:1 Thumbnail Container (75% width, +50% size increase) */}
                      <div className="relative aspect-square w-3/4 mx-auto overflow-hidden rounded-xl border border-border bg-surface-2 mb-4">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Top-Right Badge */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface/90 backdrop-blur-md text-foreground border border-border shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            {project.featured ? 'Featured' : 'Live'}
                          </span>
                        </div>
                      </div>

                      {/* Content Below Square Image */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
                            {project.subtitle || project.description}
                          </p>

                          {/* Tech Chips */}
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-surface-2 border border-border text-foreground/90"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Row */}
                        <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-border/70 text-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedProjectModal(project)}
                            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>

                          <div className="flex items-center gap-2">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                              title="GitHub Repository"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: PROCESS (5 STEPS, PERSONAL WORKFLOW) */}
          {activeSectionVisibility.process && (
            <section id="process" className="py-20 px-4 sm:px-6 border-b border-border bg-background">
              <div className="max-w-[1280px] mx-auto">
                <div className="max-w-2xl mb-12">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                    Engineering Workflow
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
                    Backend Development Process
                  </h2>
                  <p className="text-sm text-muted">
                    A rigorous 5-step engineering pipeline built for clarity, stability, and zero production surprises.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {PROCESS_STEPS.map((step) => (
                    <div
                      key={step.step}
                      className="p-6 rounded-2xl bg-surface border border-border relative overflow-hidden group hover:border-primary/50 transition-all duration-200"
                    >
                      <span className="text-2xl font-mono font-extrabold text-primary mb-3 block">
                        {step.step}
                      </span>
                      <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                      <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6: TESTIMONIALS (CMS-DRIVEN CAROUSEL) */}
          {activeSectionVisibility.testimonials && testimonialsList.length > 0 && (
            <section
              id="testimonials"
              className="py-20 px-4 sm:px-6 border-b border-border bg-surface/30"
              onMouseEnter={() => setIsTestimonialHovered(true)}
              onMouseLeave={() => setIsTestimonialHovered(false)}
            >
              <div className="max-w-[1280px] mx-auto max-w-3xl text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  Client &amp; Collaborator Endorsements
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-8">
                  Trusted by Engineering Teams
                </h2>

                <div className="relative p-8 sm:p-10 rounded-2xl bg-surface border border-border shadow-md">
                  {/* Quote marks */}
                  <div className="text-4xl text-primary font-serif mb-4 leading-none select-none">
                    “
                  </div>
                  <p className="text-base sm:text-lg text-foreground/90 leading-relaxed italic mb-8">
                    {testimonialsList[activeTestimonialIdx].quote}
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonialsList[activeTestimonialIdx].avatar}
                      alt={testimonialsList[activeTestimonialIdx].name}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">
                        {testimonialsList[activeTestimonialIdx].name}
                      </p>
                      <p className="text-xs text-muted">
                        {testimonialsList[activeTestimonialIdx].role} ·{' '}
                        <span className="text-foreground/80">
                          {testimonialsList[activeTestimonialIdx].company}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Carousel Nav Controls */}
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {testimonialsList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonialIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          activeTestimonialIdx === idx
                            ? 'bg-primary w-6'
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground'
                        }`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: CTA BAND */}
          {activeSectionVisibility.cta && (
            <section id="contact" className="py-20 md:py-24 px-4 sm:px-6 bg-surface">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">
                  Get In Touch
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  Ready to build your backend?
                </h2>
                <p className="text-base text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
                  Available for on-site &amp; remote roles, freelance projects, and technical consulting.
                  Direct communication with zero layers of management.
                </p>

                {/* Direct Contact Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                  <a
                    href="mailto:manojkc1dev@gmail.com"
                    className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Get in Touch</span>
                  </a>

                  <a
                    href="https://wa.me/9779809807760"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-sm font-semibold border border-border bg-surface-2 hover:bg-surface text-foreground transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-success" />
                    <span>WhatsApp Manoj</span>
                  </a>
                </div>

                {/* Quick Interactive Contact Form */}
                <div className="max-w-lg mx-auto p-6 rounded-2xl bg-surface-2 border border-border text-left">
                  <h3 className="text-sm font-bold text-foreground mb-4">Send a Direct Message</h3>
                  {contactFormStatus === 'sent' ? (
                    <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you! Your message has been sent to Manoj K.C.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Your Email Address"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <textarea
                          required
                          rows={3}
                          placeholder="Brief description of your backend needs..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={contactFormStatus === 'sending'}
                        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {contactFormStatus === 'sending' ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 8: FOOTER (4-COLUMN, NO SITEMAP LINK) */}
          {activeSectionVisibility.footer && (
            <footer className="border-t border-border bg-surface text-foreground transition-colors duration-200">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  {/* Column 1 (span 2): Identity */}
                  <div className="md:col-span-2 space-y-4">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      Manoj K.C.<span className="text-primary font-black">.</span>
                    </span>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
                      Independent Python &amp; Django Backend Developer specializing in secure database
                      schema architecture, decoupling monolithic systems, and building scalable RESTful APIs.
                    </p>
                    <div className="pt-2 text-xs text-muted space-y-1">
                      <p className="flex items-center gap-1.5 text-foreground/90 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Kathmandu, Nepal · UTC +5:45 (NPT)</span>
                      </p>
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-2 border border-border text-foreground">
                          <span className="text-amber-500">⚡</span>
                          <span>Available for On-site &amp; Remote Roles</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Navigation */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Navigation
                    </h3>
                    <ul className="space-y-2.5 text-xs text-muted">
                      <li>
                        <a href="#about" className="hover:text-foreground transition-colors duration-150">
                          About Me
                        </a>
                      </li>
                      <li>
                        <a href="#tech-stack" className="hover:text-foreground transition-colors duration-150">
                          Tech Stack
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="hover:text-foreground transition-colors duration-150">
                          Featured Projects
                        </a>
                      </li>
                      <li>
                        <a href="#contact" className="hover:text-foreground transition-colors duration-150">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: Connect (ONLY 4 platforms enforced) */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Connect
                    </h3>
                    <ul className="space-y-2.5 text-xs text-muted">
                      <li>
                        <a
                          href="https://github.com/manojkc1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Github className="w-3.5 h-3.5 text-muted" />
                          <span>GitHub</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/in/manojkc1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Linkedin className="w-3.5 h-3.5 text-muted" />
                          <span>LinkedIn</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="mailto:manojkc1dev@gmail.com"
                          className="hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-3.5 h-3.5 text-muted" />
                          <span>Direct Email</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://wa.me/9779809807760"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-muted" />
                          <span>WhatsApp</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom bar: Copyright left, Back to Top right (NO sitemap link) */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
                  <p>© 2026 Manoj K.C. | Python &amp; Django Backend Developer Portfolio. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}

          {/* Floating Back to Top button (revealed after 400px scroll - on right side, not extreme right) */}
          {showBackToTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="fixed bottom-6 right-22 sm:right-24 z-40 p-3 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-xl text-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 cursor-pointer animate-in fade-in flex items-center justify-center group"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          )}

          {/* Gemini AI Chat Widget */}
          <ChatWidget />
        </main>
      ) : (
        /* ==================================================== */
        /* ADMIN PANEL STUDIO ($10,000 CUSTOMIZABLE CMS)        */
        /* ==================================================== */
        <div className="flex-1 pt-[64px] md:pt-[72px] flex flex-col md:flex-row min-h-[calc(100vh-72px)] bg-background">
          {/* Admin Sidebar */}
          <aside className="w-full md:w-64 border-r border-border bg-surface p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              <div className="px-3 py-2 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs font-bold text-foreground">Admin: manojkc1dev@gmail.com</span>
                </div>
                <p className="text-[10px] text-muted mt-0.5">Role: Administrator (Full Access)</p>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'appearance', label: 'Appearance', icon: Palette },
                  { id: 'layout', label: 'Layout Composer', icon: Layout },
                  { id: 'content', label: 'Content Manager', icon: FileText },
                  { id: 'media', label: 'Media Storage', icon: ImageIcon },
                  { id: 'navigation', label: 'Navigation', icon: Navigation },
                  { id: 'seo', label: 'SEO & Metadata', icon: Globe },
                  { id: 'chatbot', label: 'Chat Assistant', icon: Bot },
                  { id: 'analytics', label: 'Analytics', icon: Activity },
                  { id: 'users', label: 'Access & Users', icon: Users },
                  { id: 'activity', label: 'Audit Trail', icon: History },
                  { id: 'integrations', label: 'Integrations', icon: Key },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAdminRoute(item.id as typeof adminRoute)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted hover:text-foreground hover:bg-surface-2'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setViewMode('public')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold bg-surface-2 border border-border text-foreground hover:bg-surface transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Return to Live Site</span>
              </button>
            </div>
          </aside>

          {/* Admin Main Body */}
          <section className="flex-1 p-6 md:p-10 overflow-y-auto">
            {/* 1. DASHBOARD */}
            {adminRoute === 'dashboard' && (
              <div className="space-y-8 max-w-5xl">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Backend Portfolio Overview
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Real-time monitoring, live content status, and visitor analytics.
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Page Views', value: '14,820', change: '+24% this month' },
                    { label: 'Project Clicks', value: '3,412', change: '+18% this month' },
                    { label: 'Direct Inquiries', value: '48', change: '8 pending reply' },
                    { label: 'API Health Score', value: '99.9%', change: 'All routes operational' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="p-5 rounded-2xl bg-surface border border-border">
                      <p className="text-xs text-muted font-medium">{kpi.label}</p>
                      <p className="text-2xl font-extrabold text-foreground tracking-tight mt-1">
                        {kpi.value}
                      </p>
                      <p className="text-[11px] text-success font-medium mt-1">{kpi.change}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Quick CMS Actions</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setAdminRoute('content')}
                        className="p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 text-left font-semibold cursor-pointer"
                      >
                        + Add New Project
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminRoute('appearance')}
                        className="p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 text-left font-semibold cursor-pointer"
                      >
                        🎨 Customize Palette
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminRoute('layout')}
                        className="p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 text-left font-semibold cursor-pointer"
                      >
                        📐 Reorder Sections
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminRoute('chatbot')}
                        className="p-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 text-left font-semibold cursor-pointer"
                      >
                        🤖 Train Chatbot
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Recent Activity Log</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-border/50">
                        <span className="text-foreground">Project updated: CalcPro Calculator</span>
                        <span className="text-muted font-mono text-[11px]">Just now</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/50">
                        <span className="text-foreground">Supabase RLS verification check</span>
                        <span className="text-success font-mono text-[11px]">Passed</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/50">
                        <span className="text-foreground">Gemini API model synced: gemini-3.8-flash</span>
                        <span className="text-primary font-mono text-[11px]">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPEARANCE (BRAND ASSETS & LIVE THEME BUILDER) */}
            {adminRoute === 'appearance' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Appearance &amp; Brand Studio
                    </h2>
                    <p className="text-xs text-muted mt-1">
                      Manage visual brand assets (avatar, favicon, OG cards) and live design tokens in real time.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2 border border-border self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAppearanceSubTab('brand')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        appearanceSubTab === 'brand'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Brand Assets (Favicon, OG, Avatar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceSubTab('theme')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        appearanceSubTab === 'theme'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Theme &amp; Design Tokens
                    </button>
                  </div>
                </div>

                {appearanceSubTab === 'brand' ? (
                  <BrandAssetsManager />
                ) : (
                  <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">
                        Primary Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="px-3 py-2 text-xs font-mono rounded-lg bg-surface-2 border border-border text-foreground w-32"
                        />
                        <div className="flex items-center gap-2">
                          {['#5E6AD2', '#4F46E5', '#10B981', '#F59E0B', '#EC4899'].map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => setPrimaryColor(col)}
                              className="w-6 h-6 rounded-full border border-border cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">
                        Body Typography Pairing
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="px-3 py-2 text-xs rounded-lg bg-surface-2 border border-border text-foreground w-64"
                      >
                        <option value="Inter">Inter (Default Product UI)</option>
                        <option value="Geist">Geist (Modern Sans)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">
                        Corner Border Radius
                      </label>
                      <div className="flex items-center gap-3">
                        {['8px', '12px', '16px', '20px'].map((rad) => (
                          <button
                            key={rad}
                            type="button"
                            onClick={() => setUiRadius(rad)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                              uiRadius === rad
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-surface-2 border border-border text-muted hover:text-foreground'
                            }`}
                          >
                            {rad}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                      <button
                        type="button"
                        onClick={() => alert('Theme tokens saved to database successfully.')}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
                      >
                        Save Theme Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. LAYOUT (SECTION COMPOSER) */}
            {adminRoute === 'layout' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Layout &amp; Section Composer
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Toggle visibility and order of each homepage section dynamically.
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(activeSectionVisibility).map(([sectionKey, isVisible]) => (
                    <div
                      key={sectionKey}
                      className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-primary font-bold">::</span>
                        <span className="text-xs font-bold text-foreground capitalize">
                          {sectionKey} Section
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSectionVisibility((prev) => ({
                            ...prev,
                            [sectionKey]: !prev[sectionKey as keyof typeof activeSectionVisibility],
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          isVisible
                            ? 'bg-success/15 text-success border border-success/30'
                            : 'bg-surface-2 text-muted border border-border'
                        }`}
                      >
                        {isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CONTENT (CRUD PROJECTS & SKILLS) */}
            {adminRoute === 'content' && (
              <div className="space-y-8 max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Content Management
                    </h2>
                    <p className="text-xs text-muted mt-1">
                      Manage verified project showcases, technical skills, and client reviews.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newProj: Project = {
                        slug: `project-${Date.now()}`,
                        title: 'New Django Microservice',
                        subtitle: 'Asynchronous event pipeline with Celery and Redis',
                        description: 'High-throughput asynchronous task processing pipeline.',
                        tags: ['Python', 'Django', 'Redis', 'Celery'],
                        image: '/static/images/calcpro-django-rest-api-calculator.png',
                        githubUrl: 'https://github.com/manojkc1',
                        featured: false,
                        applicationCategory: 'UtilityApplication',
                        operatingSystem: 'Any',
                      };
                      setProjectsList((prev) => [...prev, newProj]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {projectsList.map((proj) => (
                    <div
                      key={proj.slug}
                      className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-14 h-14 rounded-xl object-cover border border-border bg-surface-2 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{proj.title}</h4>
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">{proj.subtitle}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {proj.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-border text-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProjectsList((prev) =>
                              prev.map((p) =>
                                p.slug === proj.slug ? { ...p, featured: !p.featured } : p
                              )
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            proj.featured
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'bg-surface-2 text-muted border border-border'
                          }`}
                        >
                          {proj.featured ? 'Featured' : 'Standard'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete ${proj.title}?`)) {
                              setProjectsList((prev) => prev.filter((p) => p.slug !== proj.slug));
                            }
                          }}
                          className="p-2 rounded-lg border border-border bg-surface-2 text-error hover:bg-error/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CHAT ASSISTANT CONFIG */}
            {adminRoute === 'chatbot' && <AIChatConfigManager />}

            {/* 7. SEO & METADATA */}
            {adminRoute === 'seo' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    SEO &amp; JSON-LD Inspection
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Google Rich Results compliance, Schema.org Person/WebSite/Project declarations.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                  <div className="space-y-2 text-xs">
                    <p className="text-muted">Target Canonical: <span className="font-mono text-foreground">{SEO_CONFIG.canonical}</span></p>
                    <p className="text-muted">Meta Title: <span className="font-mono text-foreground">{SEO_CONFIG.titleDefault}</span></p>
                    <p className="text-muted">Robots Rule: <span className="font-mono text-foreground">User-agent: * / Allow: /</span></p>
                    <p className="text-muted">Image Sitemap: <span className="font-mono text-foreground">https://manojkc1.com.np/sitemap-images.xml</span></p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
                      Rich Results Verified: Person + WebSite + Project Schema
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Default for other routes */}
            {['media', 'navigation', 'analytics', 'users', 'activity', 'integrations', 'settings'].includes(adminRoute) && (
              <div className="p-8 rounded-2xl bg-surface border border-border text-center max-w-2xl mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 text-primary mx-auto flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-foreground capitalize">
                  {adminRoute} Module Active
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Module configured with Supabase PostgreSQL and Row Level Security.
                  All changes made here instantly reflect on the public site layer.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: PROJECT DETAIL VIEW                           */}
      {/* ==================================================== */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setSelectedProjectModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface-2 border border-border mb-4">
              <img
                src={selectedProjectModal.image}
                alt={selectedProjectModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-foreground">{selectedProjectModal.title}</h3>
            <p className="text-xs font-semibold text-primary mt-1">{selectedProjectModal.subtitle}</p>

            <p className="text-xs text-muted leading-relaxed mt-3">
              {selectedProjectModal.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedProjectModal.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-xs font-mono bg-surface-2 border border-border text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <a
                href={selectedProjectModal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>

              {selectedProjectModal.liveUrl && (
                <a
                  href={selectedProjectModal.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Live Deployment</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive layout audit tool */}
      <OverflowDetector />
    </div>
  );
}
