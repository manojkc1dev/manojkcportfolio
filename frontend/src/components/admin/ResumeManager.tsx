import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  FileCheck,
  HardDrive,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const ResumeManager: React.FC = () => {
  const { resume, updateResume, incrementResumeDownloads, addMediaFile, hero } = useCMS();

  const [pdfUrl, setPdfUrl] = useState(resume.pdfUrl || '');
  const [docxUrl, setDocxUrl] = useState(resume.docxUrl || '');
  const [version, setVersion] = useState(resume.version || 'v2026.3.1');
  const [lastUpdated, setLastUpdated] = useState(
    resume.lastUpdated || new Date().toISOString().split('T')[0]
  );
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingFormat, setUploadingFormat] = useState<'pdf' | 'docx' | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, format: 'pdf' | 'docx') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFormat(format);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (format === 'pdf') {
        setPdfUrl(result);
        updateResume({ pdfUrl: result, lastUpdated: new Date().toISOString().split('T')[0] });
      } else {
        setDocxUrl(result);
        updateResume({ docxUrl: result, lastUpdated: new Date().toISOString().split('T')[0] });
      }

      // Add to media library as asset reference
      addMediaFile({
        name: file.name,
        url: result,
        folder: 'avatars',
        fileType: format === 'pdf' ? 'document' : 'document',
        sizeBytes: file.size,
        altText: `${hero.name} Resume (${format.toUpperCase()})`
      });

      setUploadingFormat(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    updateResume({
      pdfUrl,
      docxUrl,
      version,
      lastUpdated
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleTestDownload = (format: 'pdf' | 'docx') => {
    incrementResumeDownloads();
    const targetUrl = format === 'pdf' ? pdfUrl : docxUrl;

    if (targetUrl && (targetUrl.startsWith('http') || targetUrl.startsWith('data:'))) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = `${hero.name.toLowerCase().replace(/\s+/g, '_')}_resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Fallback generator
      const element = document.createElement('a');
      const file = new Blob([
        `CURRICULUM VITAE - ${hero.name}\n${hero.title}\nContact: ${hero.emailUrl}\n\nVersion: ${version}\nLast Updated: ${lastUpdated}`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${hero.name.toLowerCase().replace(/\s+/g, '_')}_resume.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Resume & CV CMS Manager
          </h2>
          <p className="text-xs text-slate-500">
            Upload new PDF/DOCX resume files, configure versioning, and track public download analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Active Version: {resume.version}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Resume files and metadata updated successfully across public portfolio!</span>
        </div>
      )}

      {/* Grid Layout: Upload Cards + Config Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Direct File Drag & Drop / Uploaders */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: PDF Resume Uploader */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">PDF Resume File</h3>
                  <p className="text-[11px] text-slate-400">Primary document format for recruiter downloads</p>
                </div>
              </div>

              {pdfUrl && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold font-mono border border-emerald-500/20 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/50 group"
            >
              <input
                type="file"
                ref={pdfInputRef}
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'pdf')}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {uploadingFormat === 'pdf' ? 'Processing PDF File...' : 'Click to Upload or Drag & Drop PDF Resume'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF format up to 15 MB</p>
            </div>

            {/* Direct URL Fallback */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-slate-400">Or Paste External PDF URL:</label>
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://domain.com/path/to/resume.pdf"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleTestDownload('pdf')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" /> Test Download PDF
              </button>
            </div>
          </div>

          {/* Card 2: DOCX Resume Uploader */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                  DOCX
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">DOCX Editable Resume File</h3>
                  <p className="text-[11px] text-slate-400">Editable Word format for ATS parsing and enterprise portals</p>
                </div>
              </div>

              {docxUrl && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold font-mono border border-emerald-500/20 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => docxInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/50 group"
            >
              <input
                type="file"
                ref={docxInputRef}
                accept=".doc,.docx"
                onChange={(e) => handleFileUpload(e, 'docx')}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {uploadingFormat === 'docx' ? 'Processing DOCX File...' : 'Click to Upload or Drag & Drop DOCX Resume'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports DOC and DOCX formats up to 15 MB</p>
            </div>

            {/* Direct URL Fallback */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-slate-400">Or Paste External DOCX URL:</label>
              <input
                type="text"
                value={docxUrl}
                onChange={(e) => setDocxUrl(e.target.value)}
                placeholder="https://domain.com/path/to/resume.docx"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleTestDownload('docx')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" /> Test Download DOCX
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Versioning Form & Download Analytics */}
        <div className="space-y-6">
          
          {/* Metadata & Config Card */}
          <form onSubmit={handleSaveMetadata} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" /> Resume Version Settings
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Version Identifier Tag
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v2026.3.1"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Last Updated Date
                </label>
                <input
                  type="date"
                  value={lastUpdated}
                  onChange={(e) => setLastUpdated(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Save Metadata & Publish
            </button>
          </form>

          {/* Analytics Stats Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Download Analytics
              </span>
              <Download className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {resume.downloadsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total recruiter downloads logged</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Security Hash</span>
              <span className="font-mono text-indigo-400">{resume.id}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
