import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { parsePdf } from '../../../../lib/resume/parse/parsePdf';
import { parseDocx } from '../../../../lib/resume/parse/parseDocx';
import type { ResumeContent, ResumeType } from '../../../../lib/resume/schema';

interface ImportDropZoneProps {
  onImportParsed: (content: ResumeContent, fileType: ResumeType, filename: string) => void;
  onShowToast: (msg: string) => void;
}

export const ImportDropZone: React.FC<ImportDropZoneProps> = ({
  onImportParsed,
  onShowToast,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setError(null);
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.name.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      setError('Unsupported file type. Please upload a .pdf or .docx document.');
      return;
    }

    setIsParsing(true);
    try {
      const buffer = await file.arrayBuffer();
      let parsed: ResumeContent;
      if (isPdf) {
        parsed = await parsePdf(buffer);
      } else {
        parsed = await parseDocx(buffer);
      }

      onImportParsed(parsed, 'resume', file.name);
      onShowToast(`Successfully parsed and extracted ${file.name}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to extract text from document.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            Import Existing Resume / CV
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Automatically extracts headers, roles, education, and action-verb bullets.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-800/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />

        {isParsing ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Parsing PDF/DOCX text stream...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
            <UploadCloud className="w-8 h-8 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Click or drag &amp; drop to import (.pdf, .docx)
            </span>
            <span className="text-[10px] text-neutral-400">
              Extracts sections, titles, and metrics into editable fields
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
