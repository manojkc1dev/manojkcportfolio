import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/requireAdmin';
import { Shield, User as UserIcon, ArrowLeft, LogOut, CheckCircle2, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const auth = await requireAuth('/account');
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {params.error === 'admin_required' && (
          <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs flex items-start gap-3">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Administrative Access Restricted</p>
              <p className="mt-1 text-muted">
                Your account is authenticated with the role &apos;{auth.role}&apos;. Only verified administrators (Manoj K.C.) have permission to access the CMS management panel.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  User Account
                </h1>
                <p className="text-xs text-muted">
                  Authenticated session details
                </p>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              auth.isAdmin
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-surface-2 text-muted-foreground border border-border'
            }`}>
              <Shield className="w-3.5 h-3.5" />
              <span>{auth.role}</span>
            </span>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="flex justify-between py-2.5 border-b border-border/70">
              <span className="text-muted">Account Email:</span>
              <span className="font-mono text-foreground font-medium">{auth.user?.email}</span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-border/70">
              <span className="text-muted">User ID:</span>
              <span className="font-mono text-muted text-[11px]">{auth.user?.id}</span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-border/70">
              <span className="text-muted">Authentication Status:</span>
              <span className="inline-flex items-center gap-1 text-success font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Session
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {auth.isAdmin && (
              <Link
                href="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Go to Admin Dashboard
              </Link>
            )}

            <form
              action="/api/auth/signout"
              method="POST"
              className="w-full sm:w-auto"
            >
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
