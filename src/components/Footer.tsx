import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Music2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Code2,
  Database,
  Server,
  FileText,
} from 'lucide-react';
import { track } from '../lib/analytics';

interface FooterSocial {
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
}

const footerSocials: FooterSocial[] = [
  {
    name: 'GitHub',
    handle: '@manojkc1dev',
    url: 'https://github.com/manojkc1dev/',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'in/manojkc1dev',
    url: 'https://linkedin.com/in/manojkc1dev/',
    icon: Linkedin,
  },
  {
    name: 'X',
    handle: '@manojkc1dev',
    url: 'https://twitter.com/manojkc1dev',
    icon: Twitter,
  },
  {
    name: 'Instagram',
    handle: '@manojkc1dev',
    url: 'https://instagram.com/manojkc1dev',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    handle: '@manojkc1dev',
    url: 'https://facebook.com/manojkc1dev',
    icon: Facebook,
  },
  {
    name: 'TikTok',
    handle: '@manojkc1dev',
    url: 'https://tiktok.com/@manojkc1dev',
    icon: Music2,
  },
];

const technicalStack = [
  'Python 3.12 & Django 5.x',
  'Django REST Framework',
  'PostgreSQL & Query Optimization',
  'Redis Caching & Celery Queues',
  'JWT & Role-Based Access Control',
  'Khalti & eSewa Payment Gateways',
  'Docker, Nginx & Linux Systems',
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
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
    <footer
      id="footer"
      aria-label="Site Footer"
      className="relative bg-neutral-950 text-neutral-300 border-t border-neutral-800/80 overflow-hidden"
    >
      {/* Top Gradient Inset Glow Line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Background Radial Atmosphere */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial from-indigo-900/10 via-transparent to-transparent pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* ============================================================== */}
        {/* 1. Enterprise Status Bar / Header Ribbon                        */}
        {/* ============================================================== */}
        <div className="pb-12 border-b border-neutral-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 p-1.5 shadow-inner">
              <img
                src="/icons/icon-192.png"
                alt="Favicon"
                className="w-full h-full rounded-lg object-contain"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Manoj Khatri
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                  manojkc1.com.np
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Backend Software Engineer · Scalable REST APIs & Distributed Architectures
              </p>
            </div>
          </div>

          {/* Operational & Availability Telemetry */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium text-emerald-400">All APIs Operational</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400">Available for Work</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kathmandu / Remote</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. Enterprise Four-Column Directory                             */}
        {/* ============================================================== */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 border-b border-neutral-800/80">
          {/* Column 1: Engineering Identity & Direct Dispatch (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Engineering Mission</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Designing reliable backend systems, production-grade REST APIs, and high-performance database architectures with Python, Django, DRF, and PostgreSQL. Focused on clean modularity, security, and developer productivity.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <a
                href="mailto:manojkc1dev@gmail.com"
                className="flex items-center gap-2 text-neutral-300 hover:text-indigo-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-mono">manojkc1dev@gmail.com</span>
              </a>
              <a
                href="tel:+9779842203976"
                className="flex items-center gap-2 text-neutral-300 hover:text-indigo-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-mono">+977 9842203976</span>
              </a>
            </div>
          </div>

          {/* Column 2: Tech Capabilities & Core Stack (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Stack</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {technicalStack.map((tech) => (
                <li key={tech} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Site Index & Quick Jump (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Navigation</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hover:text-white transition-colors"
                >
                  About Profile
                </a>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-white transition-colors"
                >
                  All Projects (/projects)
                </Link>
              </li>
              <li>
                <Link
                  to="/skills"
                  className="hover:text-white transition-colors"
                >
                  All Skills (/skills)
                </Link>
              </li>
              <li>
                <Link
                  to="/experience"
                  className="hover:text-white transition-colors"
                >
                  Experience Timeline (/experience)
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="hover:text-white transition-colors"
                >
                  Direct Contact
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>Official Resume</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Network & Social Handles (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified Profiles</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {footerSocials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('social_click', { platform: s.name })}
                    aria-label={`Manoj K.C. on ${s.name}`}
                    className="p-2 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all flex items-center gap-2 group"
                  >
                    <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-400 transition-colors shrink-0" />
                    <span className="font-medium text-[11px] truncate">{s.name}</span>
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="footer-back-to-top"
                onClick={scrollToTop}
                aria-label="Scroll back to top of page"
                className="w-full py-2.5 px-3 rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all text-xs font-medium flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Scroll to Top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. Bottom Legal & Domain Verification Strip                     */}
        {/* ============================================================== */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} Manoj Khatri</span>
            <span>·</span>
            <span className="text-neutral-400">All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:inline text-neutral-400">Kathmandu, Nepal</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
            <span>Engineered for Reliability</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-300 font-semibold">Python · Django · PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
