import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-primary selection:text-white">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground transition-colors p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Centered Content */}
      <main className="w-full max-w-md mx-auto my-auto py-10">
        {children}
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-muted py-4 border-t border-border/40">
        <span>© 2026 Manoj K.C. · Secure Portfolio CMS Access</span>
      </footer>
    </div>
  );
}
