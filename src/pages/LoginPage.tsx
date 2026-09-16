/**
 * src/pages/LoginPage.tsx
 *
 * Administrator Login page with zod validation, sonner notifications,
 * and automatic redirect to the intended destination.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { signInWithPassword } from '@/lib/auth/supabaseAuth';
import { useAuth } from '@/lib/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (!loading && user) {
      const next = searchParams.get('next') ?? '/admin';
      navigate(next, { replace: true });
    }
  }, [user, loading, navigate, searchParams]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signInWithPassword(data.email, data.password);
      toast.success('Signed in successfully.');
      const next = searchParams.get('next') ?? '/admin';
      navigate(next, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message.toLowerCase().includes('invalid')
          ? 'Invalid email or password. Please verify credentials.'
          : 'Authentication failed. Please check network connection and try again.';
      setError('root', { message });
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>
          <p className="text-xs text-[var(--fg-muted)] mt-1.5">
            Manoj K.C. · Portfolio Management System
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-5">
          {errors.root && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--fg)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[var(--surface-2)] border text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all ${
                    errors.email ? 'border-[var(--error)]' : 'border-[var(--border)]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-[var(--error)]">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--fg)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[var(--surface-2)] border text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all ${
                    errors.password ? 'border-[var(--error)]' : 'border-[var(--border)]'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-[var(--error)]">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-semibold gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In…</span>
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] underline underline-offset-4 transition-colors"
          >
            ← Return to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
