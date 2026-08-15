import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      if (window.scrollY > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
      {/* Sleek Minimalist Floating Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 dark:bg-slate-900/95 hover:bg-slate-900 border border-slate-700/60 hover:border-indigo-400 text-slate-300 hover:text-white shadow-lg shadow-black/20 hover:shadow-indigo-500/15 backdrop-blur-md transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-3 pointer-events-none scale-90'
        }`}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Minimalist Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-150 ease-out origin-right z-50">
          <div className="relative px-3 py-1.5 rounded-lg bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 text-white shadow-xl backdrop-blur-md whitespace-nowrap text-right">
            <span className="text-xs font-medium text-slate-200 block">
              Back to top
            </span>
            {/* Tooltip Caret */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-slate-900 border-t border-r border-slate-800 rotate-45" />
          </div>
        </div>
      </button>
    </div>
  );
};
