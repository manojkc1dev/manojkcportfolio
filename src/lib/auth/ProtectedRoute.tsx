/**
 * src/lib/auth/ProtectedRoute.tsx
 *
 * Route guard component ensuring the user is authenticated and has the required role.
 */

import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'viewer';
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 1. Loading state (prevents flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          <p className="text-sm text-[var(--fg-muted)] font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> redirect to login
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // 3. Unauthorized role -> 403 Forbidden page
  if (requireRole && role !== requireRole) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[var(--error)]/15 text-[var(--error)] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">403 — Access Denied</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2">
              You are signed in as{' '}
              <span className="font-mono text-[var(--fg)]">{user.email}</span> with role{' '}
              <span className="font-mono text-[var(--primary)] font-semibold">{role ?? 'none'}</span>.
              This area requires <span className="font-mono font-semibold">{requireRole}</span> privileges.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-sm font-medium transition-colors"
            >
              Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized
  return <>{children}</>;
}
