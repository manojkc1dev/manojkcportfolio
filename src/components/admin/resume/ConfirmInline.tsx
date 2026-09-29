import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmInlineProps {
  promptText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmInline: React.FC<ConfirmInlineProps> = ({
  promptText = 'Delete this version?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the cancel or confirm button when mounted
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      role="alert"
      className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in zoom-in-95 duration-150"
    >
      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
      <span className="font-medium">{promptText}</span>

      <button
        ref={confirmBtnRef}
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer text-xs"
        aria-label="Confirm deletion"
      >
        <Check className="w-3 h-3" />
        <span>{confirmText}</span>
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 font-medium transition-colors cursor-pointer text-xs"
        aria-label="Cancel deletion"
      >
        <X className="w-3 h-3" />
        <span>{cancelText}</span>
      </button>
    </div>
  );
};
