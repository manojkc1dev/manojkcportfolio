import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`sticky top-[64px] sm:top-[72px] z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-y border-neutral-200 dark:border-neutral-800/80 py-4 px-4 sm:px-6 lg:px-8 shadow-xs transition-colors duration-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};
