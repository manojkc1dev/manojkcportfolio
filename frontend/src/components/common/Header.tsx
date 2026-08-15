import React, { useState } from 'react';
import {
  Search,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2.5 text-left group"
          >
            <img
              src="/avatar.jpg"
              alt="Manoj K.C."
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform"
            />
            <div className="whitespace-nowrap">
              <div className="font-extrabold text-slate-900 dark:text-white text-base leading-none tracking-tight">
                MANOJ K.C.
              </div>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium tracking-wide mt-0.5">
                Python & Django Backend Developer
              </p>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 whitespace-nowrap">
          <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </a>
          <a href="#techstack" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Tech Stack
          </a>
          <a href="#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Projects
          </a>
          <a href="#experience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Experience
          </a>
          <a href="#blogs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Blog
          </a>
          <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Contact
          </a>
        </nav>

        {/* Right: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Global Search Button */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800 transition-all whitespace-nowrap"
            title="Search Portfolio"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-500" /> : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 px-4 py-4 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xl">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            About
          </a>
          <a
            href="#techstack"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Tech Stack
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Projects
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Experience
          </a>
          <a
            href="#blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Blog
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
};
