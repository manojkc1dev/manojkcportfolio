/**
 * src/pages/admin/SecurityPage.tsx
 *
 * Administrator Security Panel: identity overview, password change with
 * re-authentication verification, and security standards summary.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/useAuth';
import { signInWithPassword, updatePassword } from '@/lib/auth/supabaseAuth';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecurityPage() {
  const { user, profile } = useAuth();
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    const email = profile?.email || user?.email;
    if (!email) {
      toast.error('User email not found. Please re-login.');
      return;
    }

    try {
      // 1. Re-authenticate with current password to verify identity
      await signInWithPassword(email, data.currentPassword);

      // 2. Update to new password
      await updatePassword(data.newPassword);

      toast.success('Password successfully updated.');
      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message.toLowerCase().includes('invalid')
          ? 'Current password verification failed. Please try again.'
          : 'Could not update password. Please verify current credentials.';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--fg)]">
          Security & Access Control
        </h1>
        <p className="text-xs text-[var(--fg-muted)] mt-1">
          Manage administrator authentication credentials, session security, and access integrity.
        </p>
      </div>

      {/* Card 1: Active Administrator Identity */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--fg)]">Active Administrator Identity</h2>
            <p className="text-xs text-[var(--fg-muted)]">Verified Supabase database profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider block font-mono">
              Email Address
            </span>
            <span className="text-sm font-semibold text-[var(--fg)] mt-1 block">
              {profile?.email || user?.email}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider block font-mono">
              Privilege Level
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                Super Administrator (Full CMS Access)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Update Administrator Password */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--fg)]">Update Administrator Password</h2>
              <p className="text-xs text-[var(--fg-muted)]">
                Re-authenticates against Supabase Auth before updating credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[var(--fg)]">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none" />
              <input
                type={showPasswords ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter existing password"
                {...register('currentPassword')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-2)] border text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all ${
                  errors.currentPassword ? 'border-[var(--error)]' : 'border-[var(--border)]'
                }`}
              />
            </div>
            {errors.currentPassword && (
              <p className="text-[11px] text-[var(--error)]">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--fg)]">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none" />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  {...register('newPassword')}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-2)] border text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all ${
                    errors.newPassword ? 'border-[var(--error)]' : 'border-[var(--border)]'
                  }`}
                />
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-[var(--error)]">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--fg)]">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none" />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-2)] border text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all ${
                    errors.confirmPassword ? 'border-[var(--error)]' : 'border-[var(--border)]'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-[var(--error)]">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 text-xs font-semibold rounded-xl gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password…</span>
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Card 3: Enterprise Security Standards */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[var(--fg)]">Enterprise Security Standards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Row-Level Security</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Strict database isolation policies ensure unauthorized API requests cannot bypass role boundaries.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Session Persistence</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              JWT tokens are rotated automatically with secure encrypted storage in browser local context.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Service Key Leak</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Only public anon key is bundled in client code; elevated queries rely on auth tokens and RLS functions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
