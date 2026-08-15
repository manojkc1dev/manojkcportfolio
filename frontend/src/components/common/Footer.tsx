import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CircleSocialIcon } from './CircleSocialIcon';
import {
  Terminal,
  Send,
  CheckCircle2,
  Download
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { hero, socials, addNewsletterSubscriber, setIsResumeModalOpen } = useCMS();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    const ok = addNewsletterSubscriber(newsletterEmail, 'Footer Form');
    if (ok) {
      setSubscribedMessage('Subscribed to architecture insights!');
      setNewsletterEmail('');
    } else {
      setSubscribedMessage('Email already subscribed.');
    }
    setTimeout(() => setSubscribedMessage(''), 4000);
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Clean, Balanced 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Col 1: Bio, Tech focus, Socials (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span>{hero.name}</span>
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">{hero.title}</span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
              Specialized in backend architecture, high-concurrency Python APIs, distributed systems, and PostgreSQL performance tuning.
            </p>

            {/* Social Links */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {socials.filter(s => s.enabled).map(social => {
                const p = (social.platform || '').toLowerCase();
                let resolvedUrl = social.url;
                if (p.includes('mail') || p.includes('email')) {
                  if (!resolvedUrl || resolvedUrl.includes('manojkc1dev')) {
                    resolvedUrl = 'mailto:contactmanojkhatri@gmail.com';
                  }
                } else if (p.includes('whatsapp')) {
                  resolvedUrl = 'https://wa.me/9779809807760';
                }

                return (
                  <CircleSocialIcon
                    key={social.id}
                    platform={social.iconName || social.platform}
                    url={resolvedUrl}
                    size="sm"
                    title={social.platform === 'WhatsApp' ? 'WhatsApp (+977 9809807760)' : social.platform}
                  />
                );
              })}
            </div>
          </div>

          {/* Col 2: Navigation & Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About & Experience
                </a>
              </li>
              <li>
                <a href="#techstack" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Tech Stack & Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Case Studies & Projects
                </a>
              </li>
              <li>
                <a href="#blogs" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Architecture Articles
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Newsletter (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Stay Connected
              </h4>
              
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Resume (PDF)</span>
              </button>
            </div>

            {/* Sleek Newsletter Subscription */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email for tech updates..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {subscribedMessage && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {subscribedMessage}
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Sleek, Minimal, WCAG Compliant */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div>
              © {new Date().getFullYear()} {hero.name}. All rights reserved.
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Python</span>
              <span>•</span>
              <span>Django REST</span>
              <span>•</span>
              <span>FastAPI</span>
              <span>•</span>
              <span>PostgreSQL</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
