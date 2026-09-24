import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { AdminInboxModal } from './AdminInboxModal';

interface NavLinkItem {
  name: string;
  href: string;
  pageRoute: string;
}

const navLinks: NavLinkItem[] = [
  { name: 'About', href: '#about', pageRoute: '/' },
  { name: 'Projects', href: '#projects', pageRoute: '/projects' },
  { name: 'Skills', href: '#skills', pageRoute: '/skills' },
  { name: 'Experience', href: '#experience', pageRoute: '/experience' },
  { name: 'Contact', href: '#contact', pageRoute: '/' },
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  // Scroll listener for sticky header styling after 20px
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      if (scrollY < 80 && location.pathname === '/') {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleOpenAuth = () => setIsAuthModalOpen(true);
    const handleOpenInbox = () => setIsInboxOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    window.addEventListener('open-inbox-modal', handleOpenInbox);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
      window.removeEventListener('open-inbox-modal', handleOpenInbox);
    };
  }, [location.pathname]);

  // IntersectionObserver for robust active section highlighting on homepage
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionIds = ['about', 'projects', 'skills', 'experience', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const targetId = link.href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const topOffset = 76;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - topOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        setActiveSection(targetId);
      }
    } else {
      // On full pages, navigate to homepage with hash or to the page route
      navigate(`/${link.href}`);
    }
  };

  const handleWordmarkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('');
    } else {
      navigate('/');
    }
  };

  const isLinkActive = (link: NavLinkItem) => {
    if (location.pathname === '/projects' && link.name === 'Projects') return true;
    if (location.pathname === '/skills' && link.name === 'Skills') return true;
    if (location.pathname === '/experience' && link.name === 'Experience') return true;
    if (location.pathname === '/') {
      return activeSection === link.href.replace('#', '');
    }
    return false;
  };

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/85 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs py-3'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Left: Manoj Khatri wordmark with favicon (link to /) */}
        <a
          href="/"
          id="nav-wordmark"
          onClick={handleWordmarkClick}
          className="text-neutral-900 dark:text-white font-bold text-lg tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1 flex items-center gap-2.5"
          aria-label="Manoj Khatri - Home"
        >
          <img
            src="/icons/icon-192.png"
            alt="Favicon"
            className="w-7 h-7 rounded-lg object-contain shadow-xs"
          />
          <span>Manoj Khatri</span>
        </a>

        {/* Center (desktop): nav links */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-900/80 p-1.5 rounded-full border border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur-xs">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a
                key={link.name}
                id={`nav-link-${link.name.toLowerCase()}`}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`group relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden ${
                  active
                    ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                <span
                  className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-full transition-transform duration-300 origin-left ease-out ${
                    active
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-70 group-hover:scale-x-100 group-hover:opacity-100'
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        {/* Right: theme toggle + Hire Me button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Hire Me CTA */}
          <a
            href="mailto:manojkc1dev@gmail.com"
            id="nav-hire-me-btn"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-150 shadow-xs hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Panel with Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-[61px] bg-black/50 backdrop-blur-xs z-40"
              aria-hidden="true"
            />

            <motion.div
              id="mobile-slidein-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="md:hidden fixed right-0 top-[61px] bottom-0 w-72 max-w-[85vw] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 p-6 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 pb-2">
                  Navigation
                </div>

                {navLinks.map((link) => {
                  const active = isLinkActive(link);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`px-4 py-3 text-base font-medium rounded-xl transition-colors flex items-center justify-between ${
                        active
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </a>
                  );
                })}

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 pb-2">
                    Dedicated Catalogs
                  </div>
                  <Link
                    to="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    All Projects Catalog →
                  </Link>
                  <Link
                    to="/skills"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    All Skills Matrix →
                  </Link>
                  <Link
                    to="/experience"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Full Career Timeline →
                  </Link>
                </div>
              </div>

              {/* Mobile Panel Footer / Actions */}
              <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
                <a
                  href="mailto:manojkc1dev@gmail.com"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-center text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Hire Me</span>
                </a>

                <div className="text-center text-xs text-neutral-500 font-mono pt-2">
                  Kathmandu, Nepal &bull; Python/Django
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Global Admin Inbox Modal */}
      <AdminInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </header>
  );
};
