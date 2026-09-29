import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  meta?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  meta,
  className = '',
}) => {
  return (
    <div className={`pt-6 pb-8 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                {eyebrow}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
            {meta && (
              <p className="mt-2 text-xs font-mono text-neutral-500 dark:text-neutral-500">
                {meta}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
