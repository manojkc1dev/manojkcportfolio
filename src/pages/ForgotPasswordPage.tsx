/**
 * src/pages/ForgotPasswordPage.tsx
 *
 * Minimal placeholder page for password reset.
 */

import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] mx-auto flex items-center justify-center border border-[var(--primary)]/20">
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Password Reset</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-2">
            Administrator password recovery is managed via Supabase Auth.
            Please reach out to the system administrator or check your recovery email.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
