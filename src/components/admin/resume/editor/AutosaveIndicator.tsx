import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AutosaveIndicatorProps {
  status: 'saved' | 'saving' | 'dirty' | 'error';
  lastSavedAt: Date | null;
}

export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({ status, lastSavedAt }) => {
  const [timeAgo, setTimeAgo] = React.useState('just now');

  React.useEffect(() => {
    if (!lastSavedAt) return;
    const update = () => {
      const seconds = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
      if (seconds < 5) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        const mins = Math.floor(seconds / 60);
        setTimeAgo(`${mins}m ago`);
      }
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
        <Clock className="w-3.5 h-3.5 animate-spin" />
        <span>Saving changes...</span>
      </div>
    );
  }

  if (status === 'dirty') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>Unsaved edits</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Save failed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>Saved {timeAgo}</span>
    </div>
  );
};
