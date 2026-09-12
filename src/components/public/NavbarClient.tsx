'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export interface NavItem {
  id?: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavbarClientProps {
  navItems: NavItem[];
  availabilityBadge?: string;
}

export function NavbarClient({
  navItems,
  availabilityBadge = 'Available',
}: NavbarClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] md:h-[72px] flex items-center justify-between">
          {/* Left Side: Wordmark + Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center text-[18px] font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              aria-label="Manoj K.C. Home"
            >
              <span>Manoj K.C</span>
              <span className="text-primary font-black ml-0.5">.</span>
            </Link>

            {availabilityBadge && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/30">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                {availabilityBadge}
              </span>
            )}
          </div>

          {/* Center (Desktop only Navigation) */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isAnchor = item.href.startsWith('#') || item.href.includes('/#');
              const isActive =
                pathname === item.href ||
                (!isAnchor && pathname.startsWith(item.href) && item.href !== '/');

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs ${
                    isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: ThemeToggle + CTA */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-200 hover:scale-[1.02] hover:shadow-primary/20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Hire Me
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-surface border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Sheet) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface border-l border-border p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  <span>Manoj K.C</span>
                  <span className="text-primary">.</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 border border-border cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-3" aria-label="Mobile Navigation Links">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-surface-2 hover:text-primary transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Interface Theme</span>
                <ThemeToggle />
              </div>

              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
              >
                Hire Me
              </Link>

              <div className="text-center">
                <span className="text-[11px] text-muted-foreground">
                  Kathmandu, Nepal · UTC +5:45
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
