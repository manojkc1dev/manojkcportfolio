import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  AlertCircle,
  FileText,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { ResumeContent, ResumeType } from '../../../../lib/resume/schema';
import { parsePdf } from '../../../../lib/resume/parse/parsePdf';
import { parseDocx } from '../../../../lib/resume/parse/parseDocx';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (content: ResumeContent, fileType: ResumeType, filename: string) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ResumeContent | null>(null);
  const [importType, setImportType] = useState<ResumeType>('resume');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setParsedPreview(null);
    setFile(selectedFile);

    const isPdf = selectedFile.name.toLowerCase().endsWith('.pdf');
    const isDocx = selectedFile.name.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      setError('Unsupported file type. Please upload a .pdf or .docx file.');
      return;
    }

    setIsParsing(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      let parsed: ResumeContent;
      if (isPdf) {
        parsed = await parsePdf(buffer);
      } else {
        parsed = await parseDocx(buffer);
      }

      setParsedPreview(parsed);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse resume document.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!parsedPreview) return;
    onConfirmImport(parsedPreview, importType, file?.name || 'imported-resume');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UploadCloud className="w-4 h-4" />
            </span>
            <div>
              <h3 id="import-dialog-title" className="text-sm font-bold text-neutral-900 dark:text-white">
                Import Existing Resume or CV
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Parses structure, experience bullets, and skills into editable ATS records.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* File Upload Zone */}
          {!parsedPreview && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-800/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              {isParsing ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Extracting ATS sections &amp; bullet points...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <UploadCloud className="w-10 h-10 text-neutral-400" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    Drag and drop your PDF or DOCX file here
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Supported formats: .pdf (text-layer), .docx (Word). Max 10MB.
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview Card */}
          {parsedPreview && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Document Parsed Successfully</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setParsedPreview(null);
                      setFile(null);
                    }}
                    className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Upload different file</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">Candidate: </span>
                    {parsedPreview.header.name || 'Not detected'}
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">Email: </span>
                    {parsedPreview.header.email || 'Not detected'}
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">Phone: </span>
                    {parsedPreview.header.phone || 'Not detected'}
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">Sections: </span>
                    {parsedPreview.sections.length} identified
                  </div>
                </div>
              </div>

              {/* Sections summary */}
              <div>
                <span className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Extracted Sections:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {parsedPreview.sections.map((sec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between"
                    >
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {sec.title}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {sec.entries?.length || 0} entries
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type target */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Save as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportType('resume')}
                    className={`py-1.5 px-3 rounded-xl border text-center font-semibold cursor-pointer ${
                      importType === 'resume'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600'
                    }`}
                  >
                    Resume Variant
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('cv')}
                    className={`py-1.5 px-3 rounded-xl border text-center font-semibold cursor-pointer ${
                      importType === 'cv'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600'
                    }`}
                  >
                    Curriculum Vitae (CV)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedPreview}
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold shadow-xs cursor-pointer text-xs"
          >
            Confirm &amp; Load into Editor
          </button>
        </div>
      </div>
    </div>
  );
};
