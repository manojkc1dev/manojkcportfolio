import React from 'react';

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  className?: string;
  badge?: string;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  active,
  onClick,
  children,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-neutral-950 cursor-pointer ${sizeClasses} ${
        active
          ? 'bg-indigo-600 text-white shadow-xs dark:bg-indigo-500 border border-indigo-600 dark:border-indigo-500'
          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
      } ${className}`}
    >
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
