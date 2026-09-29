import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';

interface NotFoundProps {
  onBackToHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackToHome }) => {
  const handleReturnHome = (e: React.MouseEvent) => {
    if (onBackToHome) {
      e.preventDefault();
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <section
      aria-label="404 Page Not Found"
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-xl"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 font-mono uppercase tracking-wider mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>HTTP 404 &bull; Not Found</span>
          </div>

          {/* Large Monospace Error Code */}
          <div className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
            4<span className="text-indigo-600 dark:text-indigo-400">0</span>4
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            Route Not Registered
          </h1>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            The endpoint or resource you were looking for doesn&apos;t exist on this server. Check the URL for typographical errors or head back to the main portfolio.
          </p>

          {/* Terminal-styled path snippet */}
          <div className="mb-8 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 font-mono text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">
              GET {typeof window !== 'undefined' ? window.location.pathname : '/unknown'} &rarr; 404
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/"
              onClick={handleReturnHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
