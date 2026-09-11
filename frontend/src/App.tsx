import React from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BackToTop } from './components/common/BackToTop';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { SeoInspectorModal } from './components/common/SeoInspectorModal';
import { ArchitectureDocsModal } from './components/common/ArchitectureDocsModal';

import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
import { TechStackSection } from './components/portfolio/TechStackSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ExperienceSection } from './components/portfolio/ExperienceSection';
import { CertificationsSection } from './components/portfolio/CertificationsSection';
import { BlogSection } from './components/portfolio/BlogSection';
import { ServicesSection } from './components/portfolio/ServicesSection';
import { TestimonialsSection } from './components/portfolio/TestimonialsSection';
import { ContactSection } from './components/portfolio/ContactSection';

import { CaseStudyModal } from './components/portfolio/CaseStudyModal';
import { BlogDetailModal } from './components/portfolio/BlogDetailModal';
import { ResumeModal } from './components/portfolio/ResumeModal';

export function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Public Showcase Main Layout */}
      <main>
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificationsSection />
        <BlogSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Modals Suite */}
      <CaseStudyModal />
      <BlogDetailModal />
      <ResumeModal />
      <GlobalSearchModal />
      <SeoInspectorModal />
      <ArchitectureDocsModal />
    </div>
  );
}

export default App;
