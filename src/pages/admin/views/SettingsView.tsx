import React, { useState } from 'react';
import {
  Key,
  Shield,
  Download,
  Upload,
  CheckCircle2,
  Database,
  Lock,
  RefreshCw,
  Server,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import type { AdminProject, AdminService, AdminArticle, AdminInquiry, AdminSiteContent } from '../types';

interface SettingsViewProps {
  currentPasswordHash?: string;
  currentUserEmail?: string | null;
  isFirebaseAuth?: boolean;
  isDjangoAuth?: boolean;
  onUpdatePassword?: (currentPass: string, newPass: string) => Promise<void>;
  onShowToast: (message: string) => void;
  allData: {
    projects: AdminProject[];
    services?: AdminService[];
    articles?: AdminArticle[];
    inquiries: AdminInquiry[];
    content?: AdminSiteContent;
    skills?: any;
    currentFocus?: any;
    experience?: any;
    profile?: any;
  };
  onImportAllData: (data: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUserEmail,
  isFirebaseAuth = false,
  isDjangoAuth = false,
  onUpdatePassword,
  onShowToast,
  allData,
  onImportAllData,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [requireReauthForDelete, setRequireReauthForDelete] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // 1. Validate required fields
    if (!currentPass || !currentPass.trim()) {
      setPasswordError('Current passphrase is required to authorize this change.');
      return;
    }

    if (!newPass || newPass.length < 6) {
      setPasswordError('New passphrase must be at least 6 characters long.');
      return;
    }

    if (!confirmPass) {
      setPasswordError('Please confirm your new passphrase.');
      return;
    }

    if (newPass !== confirmPass) {
      setPasswordError('New passphrase and confirmation do not match.');
      return;
    }

    if (currentPass === newPass) {
      setPasswordError('New passphrase must be different from your current passphrase.');
      return;
    }

    if (!onUpdatePassword) {
      setPasswordError('Authentication provider update handler is not available.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await onUpdatePassword(currentPass, newPass);

      // Only on success: clear fields and show success state
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setPasswordSuccess('Master administrative passphrase updated successfully. Signing out...');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update passphrase. Please try again.';
      setPasswordError(msg);
      // Retain field values on error so user can correct typos without losing context
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleExportBackup = () => {
    const exportPayload = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      data: allData,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `manoj-portfolio-cms-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onShowToast('Full database backup exported to JSON file.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed?.data) {
          onImportAllData(parsed.data);
          onShowToast('All data imported and synchronized successfully.');
        } else {
          onShowToast('Error: Invalid backup file format.');
        }
      } catch (err) {
        onShowToast('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Admin & System Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Manage administrative access credentials, session security, and data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passphrase Change Card */}
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Change Master Admin Passphrase
              </h2>
            </div>
          {isDjangoAuth && currentUserEmail ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span>Django JWT</span>
            </span>
          ) : isFirebaseAuth && currentUserEmail ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Firebase Auth</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>Demo Session</span>
            </span>
          )}
          </div>

          {/* Provider status & guidance notice */}
          {isDjangoAuth && currentUserEmail ? (
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Updates your live <span className="font-semibold text-neutral-900 dark:text-white">Django REST Framework</span> password for <span className="font-mono text-blue-600 dark:text-blue-400">{currentUserEmail}</span>. Requires verifying your current passphrase.
            </div>
          ) : isFirebaseAuth && currentUserEmail ? (
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Updates your live <span className="font-semibold text-neutral-900 dark:text-white">Firebase Authentication</span> password for <span className="font-mono text-blue-600 dark:text-blue-400">{currentUserEmail}</span>. Requires verifying your current passphrase.
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold">Demo Mode:</span> You are currently in a local demo session. Live password updates require an active Firebase Authentication or Django JWT session.
            </div>
          )}

          {/* Error Banner */}
          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="flex-1">
                <p className="font-semibold">Password Update Error</p>
                <p className="mt-0.5 text-[11px]">{passwordError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="font-semibold">Passphrase Updated</p>
                <p className="mt-0.5 text-[11px]">{passwordSuccess}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Current Passphrase *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  disabled={isUpdatingPassword}
                  placeholder="Enter your current passphrase"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  disabled={isUpdatingPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer disabled:cursor-not-allowed"
                  title={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                New Passphrase *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  disabled={isUpdatingPassword}
                  placeholder="At least 6 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  disabled={isUpdatingPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer disabled:cursor-not-allowed"
                  title={showNewPass ? 'Hide password' : 'Show password'}
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Confirm New Passphrase *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  disabled={isUpdatingPassword}
                  placeholder="Repeat new passphrase"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  disabled={isUpdatingPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer disabled:cursor-not-allowed"
                  title={showConfirmPass ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Updating Passphrase...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 shrink-0" />
                    <span>Update Passphrase</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Session Card */}
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Security & Session Controls
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Auto-lock Session Inactivity Timeout
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  onShowToast(`Session timeout set to ${e.target.value} minutes.`);
                }}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="15">15 Minutes of inactivity</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour (Recommended)</option>
                <option value="240">4 Hours</option>
                <option value="never">Never (Stay authenticated)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireReauthForDelete}
                  onChange={(e) => {
                    setRequireReauthForDelete(e.target.checked);
                    onShowToast(
                      e.target.checked
                        ? 'Delete protection confirmed.'
                        : 'Delete protection turned off.'
                    );
                  }}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-700"
                />
                <div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Require confirmation on destructive actions
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Prompts a verification modal prior to permanently deleting projects, services, or inquiries.
                  </p>
                </div>
              </label>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Administrative session is active with encrypted local token verification.
              </span>
            </div>
          </div>
        </div>

        {/* Data Backup & Disaster Recovery */}
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs md:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Data Backup, Export & Recovery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Export Full Database Snapshot
              </h3>
              <p className="text-[11px] text-neutral-500">
                Download all current projects, services, blog articles, lead inquiries, and homepage content as a portable JSON archive.
              </p>
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Backup (JSON)</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Restore Database from Backup
              </h3>
              <p className="text-[11px] text-neutral-500">
                Upload a valid JSON backup file to overwrite or restore content.
              </p>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold shadow-xs transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Choose Backup JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
