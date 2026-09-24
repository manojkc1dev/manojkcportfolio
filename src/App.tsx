import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, MotionConfig } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { QABot } from './components/QABot';
import { NoiseOverlay } from './components/NoiseOverlay';
import { ScrollToTop } from './components/ScrollToTop';
import { init as initAnalytics, track } from './lib/analytics';

// Lazy load page components
const HomePage = React.lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const ProjectsPage = React.lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const SkillsPage = React.lazy(() =>
  import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage }))
);
const ExperiencePage = React.lazy(() =>
  import('./pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage }))
);
const NotFound = React.lazy(() =>
  import('./components/NotFound').then((m) => ({ default: m.NotFound }))
);
const AdminPortal = React.lazy(() =>
  import('./pages/AdminPortal').then((m) => ({ default: m.AdminPortal }))
);

const SectionSkeleton: React.FC = () => (
  <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
    <div className="h-8 w-48 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl animate-pulse mb-4" />
    <div className="h-4 w-72 bg-neutral-200/40 dark:bg-neutral-800/40 rounded-lg animate-pulse mb-10" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-56 bg-neutral-200/30 dark:bg-neutral-800/30 rounded-2xl animate-pulse" />
      <div className="h-56 bg-neutral-200/30 dark:bg-neutral-800/30 rounded-2xl animate-pulse" />
      <div className="h-56 bg-neutral-200/30 dark:bg-neutral-800/30 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const isAdminRoute =
    location.pathname === '/admin' ||
    location.pathname === '/mkc-zadmin-cc' ||
    location.pathname === '/lc-zadmin-cc';

  // Analytics on mount and path change
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    track('page_view', { path: location.pathname });
  }, [location.pathname]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<SectionSkeleton />}>
        <Routes>
          <Route path="/admin" element={<AdminPortal onBackToHome={() => navigate('/')} />} />
          <Route path="/mkc-zadmin-cc" element={<AdminPortal onBackToHome={() => navigate('/')} />} />
          <Route path="/lc-zadmin-cc" element={<AdminPortal onBackToHome={() => navigate('/')} />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400 font-sans transition-colors duration-300">
      {/* Accessibility: Skip-to-content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Skip to content
      </a>

      {/* Progress Bar (at top on home page) */}
      {location.pathname === '/' && (
        <motion.div
          id="scroll-progress-bar"
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50 pointer-events-none"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
      )}

      {/* Subtle Noise Texture Overlay */}
      <NoiseOverlay />

      {/* Primary Sticky Header */}
      <Navbar />

      {/* Route Views inside Suspense */}
      <Suspense fallback={<SectionSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="*" element={<NotFound onBackToHome={() => navigate('/')} />} />
        </Routes>
      </Suspense>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities */}
      <BackToTop />
      <QABot />
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </HelmetProvider>
  );
}
