import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Activity,
  Database,
  GraduationCap,
  MapPin,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { profile } from '../data/profile';

interface StatItem {
  value: string;
  label: string;
  subtext?: string;
  icon: React.ElementType;
}

const quickStats: StatItem[] = [
  {
    value: '3+',
    label: 'Production Projects',
    subtext: 'Django, DRF & PostgreSQL',
    icon: Code2,
  },
  {
    value: '30%',
    label: 'Avg. API Speedup',
    subtext: 'Query & DB optimization',
    icon: Activity,
  },
  {
    value: '10K+',
    label: 'Records Handled',
    subtext: 'Robust PostgreSQL schemas',
    icon: Database,
  },
  {
    value: '2025',
    label: 'BIT Graduate',
    subtext: 'Tribhuvan University',
    icon: GraduationCap,
  },
];

export const About: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('projects');
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

  return (
    <section
      id="about"
      aria-label="About Manoj Khatri"
      className="py-20 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two Columns: Photo Left, Content & Stats Right on Desktop; Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Photo with rounded subtle border + info badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start"
          >
            {/* Photo Card with Rounded Subtle Border */}
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
              {/* Subtle ambient glow behind photo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-purple-500/20 rounded-3xl blur-xl opacity-70" />

              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-lg">
                <div className="aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={imgError ? '/images/manoj_passport.png' : '/images/manoj.jpg'}
                    alt="Manoj Khatri - Backend Software Engineer"
                    onError={() => setImgError(true)}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Subtle caption bar on bottom of card */}
                <div className="p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Manoj Khatri
                    </span>
                  </div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                    Python &amp; Django
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Quick Contact Cards */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto lg:mx-0 mt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{profile.location}</span>
                <span className="ml-auto text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  NPT (UTC+5:45)
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                id="about-copy-email-btn"
                aria-label="Copy email address to clipboard"
                className="w-full flex items-center justify-between gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/90 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </span>
                {copiedEmail ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-semibold text-[11px] shrink-0">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-neutral-400 hover:text-indigo-500 font-sans text-[11px] shrink-0">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Eyebrow, Headline, Bio Narrative, Quick Stats, CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>About Me</span>
            </div>

            {/* Headline */}
            <h2
              id="about-headline"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]"
            >
              Backend-first engineer.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Production-minded.
              </span>
            </h2>

            {/* Bio Paragraphs */}
            <div className="mt-6 space-y-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              <p>
                I&apos;m a Python/Django backend developer based in Kathmandu, Nepal,
                focused on building secure server-side systems that power real products.
                My work centers on Django REST Framework, PostgreSQL, JWT authentication,
                role-based access control, and payment gateway integrations like Khalti and eSewa.
              </p>
              <p>
                I&apos;ve shipped REST APIs for marketplace platforms and data-driven
                apps, designing schemas, optimizing queries, and documenting
                endpoints for clean handoff. At Sajha Infotech, I cut average API
                response times by ~30% through query optimization on a student
                management system.
              </p>
              <p>
                I hold a BIT from Tribhuvan University (2025) and completed CS50&apos;s
                Web Programming with Python and JavaScript. Currently deepening
                Celery, Docker, and API architecture for larger systems.
              </p>
            </div>

            {/* Quick Stats Row (4 cards) */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                At A Glance
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {quickStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-colors group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono">
                          {stat.value}
                        </div>
                        <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1 leading-snug">
                          {stat.label}
                        </div>
                        {stat.subtext && (
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
                            {stat.subtext}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Small CTA at bottom: "See what I'm building →" scrolling to #projects */}
            <div className="mt-8 pt-2">
              <a
                id="about-cta-see-projects"
                href="#projects"
                onClick={scrollToProjects}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1"
              >
                <span>See what I&apos;m building</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
