import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`text-center py-16 px-4 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 max-w-lg mx-auto my-12 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
        <SearchX className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
