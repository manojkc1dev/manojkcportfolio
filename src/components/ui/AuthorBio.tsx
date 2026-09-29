import React from 'react';
import { Github, Linkedin, Calendar, CheckCircle2 } from 'lucide-react';

interface AuthorBioProps {
  lastUpdated?: string;
  className?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({
  lastUpdated = 'September 2026',
  className = '',
}) => {
  return (
    <aside
      aria-label="About the Author"
      className={`mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      <div className="p-6 sm:p-7 rounded-3xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src="/images/manoj.jpg"
            alt="Manoj K.C., Backend Software Engineer in Kathmandu"
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-indigo-500/20 dark:border-indigo-400/30 shrink-0 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                Written &amp; Curated by
              </span>
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Author</span>
              </div>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Manoj K.C. <span className="text-neutral-400 font-normal text-sm font-sans">(Manoj Khatri)</span>
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mt-0.5 leading-relaxed">
              Backend Software Engineer in Kathmandu, Nepal. Architecting high-throughput REST APIs with Python 3.12, Django 5.x, DRF, and PostgreSQL.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2.5 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Last updated: {lastUpdated}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/manojkc1dev/"
              target="_blank"
              rel="noopener noreferrer author"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/manojkc1dev/"
              target="_blank"
              rel="noopener noreferrer author"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
