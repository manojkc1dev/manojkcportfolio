import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'border-transparent bg-[var(--primary)] text-white',
    secondary: 'border-transparent bg-[#1F1F23] text-[var(--fg)]',
    destructive: 'border-transparent bg-[var(--error)] text-white',
    outline: 'border border-[var(--border)] text-[var(--fg)]',
    success: 'border border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
