import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleChatToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail) {
        setIsChatOpen(customEvent.detail.open);
      }
    };
    window.addEventListener('portfolio:chat-toggle', handleChatToggle);
    return () => window.removeEventListener('portfolio:chat-toggle', handleChatToggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hide if chat is open or not scrolled enough
  if (isChatOpen) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          id="back-to-top-button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top of page"
          className="fixed bottom-[84px] right-[30px] sm:bottom-[90px] sm:right-[30px] z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/95 text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-indigo-500/80 shadow-lg shadow-black/40 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer transition-all flex items-center justify-center group"
        >
          <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-300 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-900/95 border border-neutral-800 text-xs font-medium text-neutral-200 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            Scroll to top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
