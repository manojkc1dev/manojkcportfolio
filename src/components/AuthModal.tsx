import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../firebase';
import { track } from '../lib/analytics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const { user, isConfigured, signIn, signUp, resetPassword, signOut } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Sync initial mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessNotice(null);
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setError('Please enter your email address.');
      return;
    }

    if (!isConfigured) {
      setError('Firebase is running in UI-only mode. Set VITE_FB_API_KEY and VITE_FB_PROJECT_ID in your .env file.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!password) {
          setError('Please enter your password.');
          setLoading(false);
          return;
        }
        await signIn(emailTrimmed, password);
        track('auth_action', { action: 'signin_success' });
        setSuccessNotice('Signed in successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else if (mode === 'signup') {
        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        await signUp(emailTrimmed, password, displayName.trim());
        track('auth_action', { action: 'signup_success' });
        setSuccessNotice('Account created and signed in!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else if (mode === 'reset') {
        await resetPassword(emailTrimmed);
        track('auth_action', { action: 'password_reset_sent' });
        setSuccessNotice(`Password reset instructions have been sent to ${emailTrimmed}.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication operation failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      await signOut();
      track('auth_action', { action: 'signout' });
      setSuccessNotice('You have been signed out.');
      setTimeout(() => onClose(), 600);
    } catch (err) {
      setError('Error signing out.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="auth-modal-title"
                    className="text-lg font-bold text-neutral-900 dark:text-white"
                  >
                    {user
                      ? 'Account Management'
                      : mode === 'signin'
                      ? 'Sign In to Portfolio'
                      : mode === 'signup'
                      ? 'Create Admin Account'
                      : 'Reset Your Password'}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user
                      ? `Signed in as ${user.email}`
                      : 'Firebase Email/Password Authentication'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close authentication modal"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* If already signed in, show profile & sign-out controls */}
              {user ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-900 dark:text-emerald-200">
                      <p className="font-semibold">Authentication Active</p>
                      <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">
                        You are signed in as <span className="font-mono">{user.email}</span>. You have full access to view incoming contact messages and manage settings.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={handleSignOutClick}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mode Tabs (Sign In / Register / Reset) */}
                  <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800/80 p-1 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'signin'
                          ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'signup'
                          ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'reset'
                          ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Reset
                    </button>
                  </div>

                  {/* Notice if Firebase env keys are missing */}
                  {!isConfigured && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <span className="font-semibold">Firebase Not Connected:</span> Make sure your Firebase project credentials are added to your <code className="font-mono">.env</code> file (<code className="font-mono">VITE_FB_API_KEY</code> &amp; <code className="font-mono">VITE_FB_PROJECT_ID</code>).
                      </div>
                    </div>
                  )}

                  {/* Feedback alerts */}
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successNotice && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{successNotice}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Display name field (Signup only) */}
                    {mode === 'signup' && (
                      <div>
                        <label
                          htmlFor="auth-displayName"
                          className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="auth-displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Manoj K.C."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="auth-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          ref={emailInputRef}
                          id="auth-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="manojkc1dev@gmail.com"
                          autoComplete="email"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Field (Signin & Signup) */}
                    {mode !== 'reset' && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="auth-password"
                            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400"
                          >
                            Password
                          </label>
                          {mode === 'signin' && (
                            <button
                              type="button"
                              onClick={() => {
                                setMode('reset');
                                setError(null);
                              }}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="auth-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      id="auth-submit-btn"
                      className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>
                            {mode === 'signin'
                              ? 'Sign In'
                              : mode === 'signup'
                              ? 'Create Account'
                              : 'Send Password Reset Email'}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
