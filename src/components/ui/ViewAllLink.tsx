import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ViewAllLinkProps {
  to: string;
  label: string;
  count?: number;
  className?: string;
  onClick?: () => void;
}

export const ViewAllLink: React.FC<ViewAllLinkProps> = ({
  to,
  label,
  count,
  className = '',
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1 -mx-1 ${className}`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 font-normal">
          {count}
        </span>
      )}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
};
