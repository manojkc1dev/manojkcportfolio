import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { FileDropZone } from './FileDropZone';
import { UploadResumeInput, ResumeVersionType } from '../../../lib/admin/resumeTypes';

interface UploadVersionFormProps {
  type: ResumeVersionType;
  isOpen: boolean;
  onToggle: () => void;
  onUpload: (input: UploadResumeInput) => Promise<void>;
  isUploading: boolean;
}

export const UploadVersionForm: React.FC<UploadVersionFormProps> = ({
  type,
  isOpen,
  onToggle,
  onUpload,
  isUploading,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [ariaLiveStatus, setAriaLiveStatus] = useState<string>('');

  const typeDisplay = type === 'resume' ? 'Resume' : 'CV';

  // Auto-generate sensible label when file is selected
  useEffect(() => {
    if (file && !label) {
      const monthYear = new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      setLabel(`${typeDisplay} - ${monthYear}`);
    }
  }, [file, label, typeDisplay]);

  const handleFileSelect = (selected: File) => {
    setFormError(null);
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setFormError('Invalid file format. Please choose an application/pdf document.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFormError('File exceeds the 5 MB limit. Please select a smaller PDF.');
      return;
    }
    setFile(selected);
  };

  const handleClearFile = () => {
    setFile(null);
    setLabel('');
    setNotes('');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!file) {
      setFormError('Please select a PDF file to upload.');
      return;
    }

    if (!label.trim()) {
      setFormError('Please provide a label for this version.');
      return;
    }

    try {
      setAriaLiveStatus('Uploading new document version...');
      await onUpload({
        file,
        type,
        label: label.trim(),
        notes: notes.trim() || undefined,
        isActive,
        isPublic,
      });
      setAriaLiveStatus('Upload complete.');
      // Reset form
      handleClearFile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please check the file.';
      setFormError(msg);
      setAriaLiveStatus(`Upload failed: ${msg}`);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden transition-all">
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" role="status">
        {ariaLiveStatus}
      </div>

      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="upload-form-panel"
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Upload New {typeDisplay} Version
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Add a new PDF release with automatic deduplication check (Press <kbd className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 rounded">U</kbd> to toggle)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span>{isOpen ? 'Collapse' : 'Upload PDF'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <form
          id="upload-form-panel"
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 border-t border-neutral-100 dark:border-neutral-800 space-y-5"
        >
          {/* Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Select {typeDisplay} Document (PDF, max 5 MB) <span className="text-rose-500">*</span>
            </label>
            <FileDropZone
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
              selectedFile={file}
              error={formError}
              typeLabel={typeDisplay}
            />
          </div>

          {file && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              {/* Version Label */}
              <div>
                <label
                  htmlFor="version-label-input"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Version Label <span className="text-rose-500">*</span>
                </label>
                <input
                  id="version-label-input"
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={`e.g., Backend Engineer - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="version-notes-input"
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Internal Note (Optional)
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {notes.length}/200
                  </span>
                </div>
                <textarea
                  id="version-notes-input"
                  maxLength={200}
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Updated with high-throughput Redis metrics and microservices case study."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                      Set as active version
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Instantly served at /{type}.pdf
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                      Make publicly downloadable
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Accessible without admin credentials
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading & Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Upload {typeDisplay}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
