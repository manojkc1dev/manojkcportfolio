import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Music2,
} from 'lucide-react';
import { track } from '../lib/analytics';

const taglines: string[] = [
  'Backend systems engineered for scale, security, and long-term reliability.',
  'I build the backend layer your business can grow on.',
  'Secure by design. Scalable by default. Reliable in production.',
  "Production-grade APIs built for businesses that can't afford downtime.",
];

interface SocialItem {
  name: string;
  url: string;
  icon: React.ElementType;
  handle: string;
}

const socials: SocialItem[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/manojkc1dev',
    icon: Github,
    handle: '@manojkc1dev',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/manojkc1dev',
    icon: Linkedin,
    handle: '@manojkc1dev',
  },
  {
    name: 'X (Twitter)',
    url: 'https://twitter.com/manojkc1dev',
    icon: Twitter,
    handle: '@manojkc1dev',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/manojkc1dev',
    icon: Instagram,
    handle: '@manojkc1dev',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/manojkc1dev',
    icon: Facebook,
    handle: '@manojkc1dev',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@manojkc1dev',
    icon: Music2,
    handle: '@manojkc1dev',
  },
];

export const Hero: React.FC = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const [spotlightPos, setSpotlightPos] = useState({ x: -1000, y: -1000 });
  const [canSpotlight, setCanSpotlight] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isFine = window.matchMedia('(pointer: fine)').matches;
      setCanSpotlight(isFine && !shouldReduceMotion);
    }
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canSpotlight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Rotate tagline every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const nameWords = ['Manoj', 'Khatri'];

  // Word-by-word entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center pt-8 sm:pt-12 pb-10 overflow-hidden"
    >
      {/* Hero Cursor Spotlight (disabled on touch & prefers-reduced-motion) */}
      {canSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(99, 102, 241, 0.08), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Animated Gradient Background with prefers-reduced-motion fallback */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Glow 1 (Indigo / Blue) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 45, -35, 0],
                  y: [0, -45, 35, 0],
                  scale: [1, 1.12, 0.96, 1],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[12%] left-1/4 w-[540px] h-[540px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] will-change-transform"
        />

        {/* Soft Radial Glow 2 (Violet / Purple) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -50, 45, 0],
                  y: [0, 40, -45, 0],
                  scale: [1, 1.08, 0.94, 1],
                }
          }
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -right-[8%] w-[580px] h-[580px] rounded-full bg-violet-500/15 dark:bg-violet-700/20 blur-[140px] will-change-transform"
        />

        {/* Soft Center Subtle Glow */}
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[120px]" />

        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_75%,transparent_100%)]" />
      </div>

      {/* Main Centered Content */}
      <div className="my-auto w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        {/* Floating Badge: Green Pulsing Dot + "Available for work | Kathmandu / Remote" */}
        <motion.div
          id="hero-availability-badge"
          aria-label="Current availability status: Available for work"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-xs backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span>Available for work · Kathmandu / Remote</span>
        </motion.div>

        {/* Big Headline: "Manoj K.C. - Backend Software Engineer" */}
        <motion.h1
          id="hero-headline-name"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.08] text-center"
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-5">
            {['Manoj', 'K.C.'].map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                className="inline-block bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 dark:from-white dark:via-indigo-100 dark:to-neutral-100 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="sr-only"> - </span>
          <span className="block mt-3 text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 tracking-normal font-sans">
            Backend Software Engineer
          </span>
        </motion.h1>

        {/* Sub-headline rotating through 3 taglines (auto-rotate every 4s) */}
        <div className="mt-6 min-h-[3.5rem] sm:min-h-[3rem] py-1 flex items-center justify-center overflow-hidden w-full max-w-2xl px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTaglineIndex}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-300 dark:to-purple-300 bg-clip-text text-transparent text-center leading-normal py-1.5 overflow-visible"
            >
              &ldquo;{taglines[currentTaglineIndex]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Short one-line pitch below */}
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed"
        >
          Python/Django backend developer shipping REST APIs, JWT auth, RBAC, and payment integrations (Khalti, eSewa) for production web apps.
        </motion.p>

        {/* CTA Buttons & Action Links */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Primary CTA: "View Work" -> #projects */}
          <a
            id="hero-cta-view-work"
            href="#projects"
            onClick={(e) => scrollToSection(e, 'projects')}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <span>View Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Secondary CTA: "Download Resume" -> /resume.pdf (new tab) */}
          <a
            id="hero-cta-download-resume"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Manoj_KC_Backend_Engineer_Resume.pdf"
            onClick={() => track('resume_download')}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Download Resume</span>
          </a>
        </motion.div>

        {/* Social Icon Row: GitHub, LinkedIn, X, Instagram, Facebook, TikTok */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          aria-label="Social media profiles"
        >
          {socials.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.name}
                id={`hero-social-${social.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('social_click', { platform: social.name })}
                aria-label={`${social.name}: ${social.handle}`}
                title={`${social.name} (${social.handle})`}
                className="group p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform" />
              </a>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll-down Chevron with Bounce Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full flex flex-col items-center justify-center pt-4 z-10"
      >
        <a
          id="hero-scroll-chevron"
          href="#about"
          onClick={(e) => scrollToSection(e, 'about')}
          aria-label="Scroll down to About section"
          className="group flex flex-col items-center gap-1 text-neutral-400 hover:text-indigo-500 dark:text-neutral-500 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer p-2"
        >
          <span className="text-[11px] font-mono tracking-wider uppercase opacity-75 group-hover:opacity-100">
            Scroll
          </span>
          <ArrowDown className={`w-4 h-4 ${shouldReduceMotion ? '' : 'animate-bounce'}`} />
        </a>
      </motion.div>
    </section>
  );
};
