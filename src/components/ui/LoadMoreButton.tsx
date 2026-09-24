import React from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  remaining?: number;
  loading?: boolean;
  total?: number;
  label?: string;
  disabled?: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  remaining,
  loading = false,
  total,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 font-medium text-sm shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" aria-hidden="true" />
          <span>Loading more...</span>
        </>
      ) : (
        <>
          <span>
            {label || (remaining !== undefined ? `Load More (${remaining} remaining)` : 'Load More')}
          </span>
          <ArrowDown className="w-4 h-4 text-neutral-500 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
        </>
      )}
    </button>
  );
};
