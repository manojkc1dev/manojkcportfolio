import React from 'react';
import { CheckCircle2, Globe, EyeOff, Archive } from 'lucide-react';

export type StatusPillVariant = 'active' | 'public' | 'private' | 'archived';

interface StatusPillProps {
  variant: StatusPillVariant;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ variant, className = '' }) => {
  switch (variant) {
    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </span>
      );
    case 'public':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${className}`}
        >
          <Globe className="w-3 h-3" />
          <span>Public</span>
        </span>
      );
    case 'private':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 ${className}`}
        >
          <EyeOff className="w-3 h-3" />
          <span>Private</span>
        </span>
      );
    case 'archived':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 ${className}`}
        >
          <Archive className="w-3 h-3" />
          <span>Archived</span>
        </span>
      );
    default:
      return null;
  }
};
