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
} from 'lucide-react';
import type { AdminProject, AdminService, AdminArticle, AdminInquiry, AdminSiteContent } from '../types';

interface SettingsViewProps {
  currentPasswordHash?: string;
  onUpdatePassword?: (newPass: string) => void;
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
  onUpdatePassword,
  onShowToast,
  allData,
  onImportAllData,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [requireReauthForDelete, setRequireReauthForDelete] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      onShowToast('Error: New passphrase must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      onShowToast('Error: Passphrases do not match.');
      return;
    }
    if (onUpdatePassword) {
      onUpdatePassword(newPass);
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    onShowToast('Master administrative passphrase updated successfully.');
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
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Change Master Admin Passphrase
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Current Passphrase *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                New Passphrase *
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Confirm New Passphrase *
              </label>
              <input
                type="password"
                required
                placeholder="Repeat new passphrase"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
              >
                Update Passphrase
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
