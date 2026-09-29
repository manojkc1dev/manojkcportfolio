import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sliders,
  ExternalLink,
  Edit3,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Save,
  RotateCcw,
} from 'lucide-react';
import type { ResumeDocument, ResumeContent, ResumeSection } from '../../../../lib/resume/schema';
import { toHtmlAts } from '../../../../lib/resume/renderers/toHtmlAts';
import { toDocxBlob } from '../../../../lib/resume/renderers/toDocx';
import { toText } from '../../../../lib/resume/renderers/toText';
import { printResumeToPdf, downloadAtsPdf } from '../../../../lib/resume/renderers/toPdf';
import { saveResume } from '../../../../lib/resume/storage';

interface ResumePreviewViewProps {
  resume: ResumeDocument;
  allResumes?: ResumeDocument[];
  onSelectResumeId?: (id: string) => void;
  onUpdateResume?: (updated: ResumeDocument) => void;
  onShowToast: (message: string) => void;
  onGoToEditor?: () => void;
}

export const ResumePreviewView: React.FC<ResumePreviewViewProps> = ({
  resume,
  allResumes = [],
  onSelectResumeId,
  onUpdateResume,
  onShowToast,
  onGoToEditor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [content, setContent] = useState<ResumeContent>(resume.content);
  const [paperFormat, setPaperFormat] = useState<'a4' | 'letter'>('a4');
  const [zoomMode, setZoomMode] = useState<'fit' | '75' | '100' | '125'>('fit');
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(false);
  const [showHiddenInspection, setShowHiddenInspection] = useState<boolean>(false);
  const [isHidePanelOpen, setIsHidePanelOpen] = useState<boolean>(true);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync content when selected resume changes
  useEffect(() => {
    setContent(resume.content);
    setHasUnsavedChanges(false);
  }, [resume.resumeId]);

  // Responsive container width measurement
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isA4 = paperFormat === 'a4';
  const baseSheetWidth = isA4 ? 794 : 816;
  const baseSheetHeight = isA4 ? 1123 : 1056;

  // Responsive scale computation
  const availableCanvasWidth = Math.max(300, containerWidth - 48);
  const fitScale = Math.min(1.15, Math.max(0.4, availableCanvasWidth / baseSheetWidth));
  const scale =
    zoomMode === 'fit'
      ? fitScale
      : zoomMode === '75'
      ? 0.75
      : zoomMode === '100'
      ? 1.0
      : 1.25;

  const scaledWidth = Math.round(baseSheetWidth * scale);
  const scaledHeight = Math.round(baseSheetHeight * scale);

  const htmlOutput = useMemo(() => {
    return toHtmlAts(content, `${content.header.name} - ${resume.type.toUpperCase()} Preview`, {
      paperFormat,
      showMarginGuides,
      showHidden: showHiddenInspection,
    });
  }, [content, paperFormat, showMarginGuides, showHiddenInspection, resume.type]);

  const hiddenFields = useMemo(() => new Set(content.header.hiddenFields || []), [content.header.hiddenFields]);

  // Count total hidden items across document
  const hiddenCounts = useMemo(() => {
    let count = hiddenFields.size;
    (content.sections || []).forEach((s) => {
      if (s.visible === false) count += 1;
      (s.entries || []).forEach((e) => {
        if (e.visible === false) count += 1;
        if (e.hiddenBullets && e.hiddenBullets.length > 0) {
          count += e.hiddenBullets.length;
        }
      });
    });
    return count;
  }, [content, hiddenFields]);

  // Save changes to persistence
  const handleSaveVisibility = async (updatedContent = content) => {
    setIsSaving(true);
    try {
      const updatedDoc: ResumeDocument = {
        ...resume,
        content: updatedContent,
        updatedAt: new Date().toISOString(),
      };
      if (onUpdateResume) onUpdateResume(updatedDoc);
      await saveResume(updatedDoc);
      setHasUnsavedChanges(false);
      onShowToast('Visibility settings saved successfully.');
    } catch {
      onShowToast('Failed to save visibility settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle header field
  const toggleHeaderField = (field: string) => {
    const next = new Set(hiddenFields);
    if (next.has(field)) {
      next.delete(field);
    } else {
      next.add(field);
    }
    const nextContent: ResumeContent = {
      ...content,
      header: {
        ...content.header,
        hiddenFields: Array.from(next),
      },
    };
    setContent(nextContent);
    setHasUnsavedChanges(true);
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const nextSections = (content.sections || []).map((s) => {
      if (s.id === sectionId) {
        return { ...s, visible: s.visible === false ? true : false };
      }
      return s;
    });
    const nextContent: ResumeContent = {
      ...content,
      sections: nextSections,
    };
    setContent(nextContent);
    setHasUnsavedChanges(true);
  };

  // Toggle entry visibility
  const toggleEntryVisibility = (sectionId: string, entryId: string) => {
    const nextSections = (content.sections || []).map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          entries: (s.entries || []).map((e) => {
            if (e.id === entryId) {
              return { ...e, visible: e.visible === false ? true : false };
            }
            return e;
          }),
        };
      }
      return s;
    });
    const nextContent: ResumeContent = {
      ...content,
      sections: nextSections,
    };
    setContent(nextContent);
    setHasUnsavedChanges(true);
  };

  // Show all elements
  const handleShowAll = () => {
    const nextSections = (content.sections || []).map((s) => ({
      ...s,
      visible: true,
      entries: (s.entries || []).map((e) => ({
        ...e,
        visible: true,
        hiddenBullets: [],
      })),
    }));
    const nextContent: ResumeContent = {
      ...content,
      header: {
        ...content.header,
        hiddenFields: [],
      },
      sections: nextSections,
    };
    setContent(nextContent);
    setHasUnsavedChanges(true);
    onShowToast('All sections, contact details, and entries set to visible.');
  };

  // Hide optional elements for a compact 1-page resume
  const handleHideOptional = () => {
    const nextHiddenFields = ['summary', 'website'];
    const nextSections = (content.sections || []).map((s) => {
      if (s.type === 'awards' || s.type === 'custom') {
        return { ...s, visible: false };
      }
      return s;
    });
    const nextContent: ResumeContent = {
      ...content,
      header: {
        ...content.header,
        hiddenFields: nextHiddenFields,
      },
      sections: nextSections,
    };
    setContent(nextContent);
    setHasUnsavedChanges(true);
    onShowToast('Applied compact preset: optional summary and extra sections hidden.');
  };

  const handleDownloadPdf = () => {
    downloadAtsPdf(content);
  };

  const handlePrint = () => {
    printResumeToPdf(content);
  };

  const handleDownloadDocx = async () => {
    try {
      const blob = await toDocxBlob(content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.header.name.replace(/\s+/g, '_')}_${resume.type.toUpperCase()}_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onShowToast('Word document downloaded.');
    } catch {
      onShowToast('Failed to export DOCX.');
    }
  };

  const handleCopyText = async () => {
    try {
      const text = toText(content);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Plain text copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Unable to copy text.');
    }
  };

  const toggleExpandSection = (secId: string) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(secId)) {
        next.delete(secId);
      } else {
        next.add(secId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Variant Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {resume.variant}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {resume.type.toUpperCase()}
              </span>
              {resume.isActive && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ★ Live Active
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Print-accurate ISO A4 layout (1 : 1.414 ratio) with live interactive visibility control.
            </p>
          </div>
        </div>

        {/* Variant selector dropdown & Public Page link */}
        <div className="flex items-center gap-2 flex-wrap">
          {allResumes.length > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
              <span className="text-neutral-500 font-medium">Switch Variant:</span>
              <select
                value={resume.resumeId}
                onChange={(e) => onSelectResumeId && onSelectResumeId(e.target.value)}
                className="font-bold text-neutral-900 dark:text-white bg-transparent border-0 cursor-pointer focus:outline-none"
              >
                {allResumes.map((r) => (
                  <option key={r.resumeId} value={r.resumeId} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                    {r.variant} ({r.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <a
            href={resume.type === 'cv' ? '/cv' : '/resume'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Open candidate public web view in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public URL</span>
          </a>

          {onGoToEditor && (
            <button
              type="button"
              onClick={onGoToEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Full Editor</span>
            </button>
          )}

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={() => handleSaveVisibility()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-colors cursor-pointer animate-pulse"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Visibility'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Controls & Export Actions Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Paper & Layout Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
            <span className="text-[11px] text-neutral-500 font-medium">Paper:</span>
            <select
              value={paperFormat}
              onChange={(e) => setPaperFormat(e.target.value as 'a4' | 'letter')}
              className="font-bold text-neutral-900 dark:text-white bg-transparent border-0 cursor-pointer focus:outline-none text-xs"
            >
              <option value="a4">ISO A4 (210×297mm · 1:1.414)</option>
              <option value="letter">US Letter (8.5×11in · 1:1.294)</option>
            </select>
          </div>

          {/* Margin Guides Toggle */}
          <button
            type="button"
            onClick={() => setShowMarginGuides(!showMarginGuides)}
            className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors cursor-pointer ${
              showMarginGuides
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
            }`}
            title="Show dashed lines indicating 15mm standard margins"
          >
            Margins: {showMarginGuides ? 'ON' : 'OFF'}
          </button>

          {/* Inspect Mode Toggle */}
          <button
            type="button"
            onClick={() => setShowHiddenInspection(!showHiddenInspection)}
            className={`px-2.5 py-1 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHiddenInspection
                ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
            }`}
            title="Highlight hidden fields and sections in the preview"
          >
            {showHiddenInspection ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
            <span>Inspect Mode ({showHiddenInspection ? 'Showing Hidden' : 'Print Clean'})</span>
          </button>

          {/* Toggle Hide/Unhide Panel */}
          <button
            type="button"
            onClick={() => setIsHidePanelOpen(!isHidePanelOpen)}
            className={`px-3 py-1 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isHidePanelOpen
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
            title="Toggle the Hide/Unhide manager drawer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hide / Unhide Panel</span>
            {hiddenCounts > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isHidePanelOpen ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
              }`}>
                {hiddenCounts} hidden
              </span>
            )}
          </button>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom controls */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setZoomMode('fit')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                zoomMode === 'fit'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Fit ({Math.round(scale * 100)}%)
            </button>
            {(['75', '100', '125'] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomMode(z)}
                className={`px-1.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                  zoomMode === z
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Download Word */}
          <button
            type="button"
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Download Word DOCX"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">Word</span>
          </button>

          {/* Print Dialog */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Copy Plain Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Copy plain text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Text'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: [ Hide/Unhide Manager Sidebar ] + [ Scaled A4 Paper Viewport ] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Hide / Unhide Manager Panel (4 columns when open) */}
        {isHidePanelOpen && (
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 space-y-4 shadow-xs max-h-[850px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Visibility Manager
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500">
                {hiddenCounts} hidden items
              </span>
            </div>

            {/* Quick Bulk Presets */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShowAll}
                className="flex-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3 text-emerald-500" />
                <span>Show All</span>
              </button>
              <button
                type="button"
                onClick={handleHideOptional}
                className="flex-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Hide summary and secondary sections for 1-page fit"
              >
                <EyeOff className="w-3 h-3 text-amber-500" />
                <span>1-Page Fit</span>
              </button>
            </div>

            {/* Header Contact Fields Checklist */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Header &amp; Contact Details
              </div>

              {[
                { key: 'summary', label: 'Professional Summary', val: content.header.summary },
                { key: 'title', label: 'Target Job Title', val: content.header.title },
                { key: 'email', label: 'Email Address', val: content.header.email },
                { key: 'phone', label: 'Phone Number', val: content.header.phone },
                { key: 'location', label: 'City & Country', val: content.header.location },
                { key: 'linkedin', label: 'LinkedIn URL', val: content.header.linkedin },
                { key: 'github', label: 'GitHub URL', val: content.header.github },
                { key: 'website', label: 'Portfolio Website', val: content.header.website },
              ].map((item) => {
                const isHidden = hiddenFields.has(item.key);
                if (!item.val) return null;

                return (
                  <div
                    key={item.key}
                    onClick={() => toggleHeaderField(item.key)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isHidden
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-neutral-400'
                        : 'bg-neutral-50/60 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-700/60 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span className={`truncate font-medium ${isHidden ? 'line-through' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isHidden
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sections & Entries Checklist */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Resume Sections &amp; Items
              </div>

              {(content.sections || []).map((sec) => {
                const isSecHidden = sec.visible === false;
                const isExpanded = expandedSectionIds.has(sec.id);
                const entryCount = (sec.entries || []).length;
                const hiddenEntriesCount = (sec.entries || []).filter((e) => e.visible === false).length;

                return (
                  <div
                    key={sec.id}
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      isSecHidden
                        ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                        : 'bg-neutral-50/60 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-700/60'
                    }`}
                  >
                    {/* Section Row */}
                    <div className="px-2.5 py-2 flex items-center justify-between gap-2">
                      <div
                        onClick={() => toggleSectionVisibility(sec.id)}
                        className="flex-1 flex items-center gap-2 cursor-pointer select-none"
                      >
                        {isSecHidden ? (
                          <EyeOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${isSecHidden ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                          {sec.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(sec.id)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase cursor-pointer ${
                            isSecHidden
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {isSecHidden ? 'Hidden' : 'Visible'}
                        </button>

                        {entryCount > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleExpandSection(sec.id)}
                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 cursor-pointer"
                            title="Expand section items"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub-entries if expanded */}
                    {isExpanded && entryCount > 0 && (
                      <div className="px-3 pb-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60 space-y-1.5">
                        {(sec.entries || []).map((entry) => {
                          const isEntryHidden = entry.visible === false;
                          return (
                            <div
                              key={entry.id}
                              onClick={() => toggleEntryVisibility(sec.id, entry.id)}
                              className={`px-2 py-1 rounded text-[11px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                isEntryHidden
                                  ? 'bg-rose-100/60 dark:bg-rose-950/40 text-neutral-400 line-through'
                                  : 'hover:bg-white dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {isEntryHidden ? (
                                  <EyeOff className="w-3 h-3 text-rose-400 shrink-0" />
                                ) : (
                                  <Eye className="w-3 h-3 text-neutral-400 shrink-0" />
                                )}
                                <span className="truncate">{entry.title}</span>
                              </div>
                              <span className="text-[9px] uppercase font-bold text-neutral-400 shrink-0">
                                {isEntryHidden ? 'Hidden' : 'On'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasUnsavedChanges && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveVisibility()}
                  disabled={isSaving}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Apply & Save Visibility'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scaled A4 Document Paper Canvas */}
        <div
          ref={containerRef}
          className={`${
            isHidePanelOpen ? 'lg:col-span-8' : 'lg:col-span-12'
          } rounded-2xl bg-neutral-200/70 dark:bg-neutral-950 border border-neutral-300/80 dark:border-neutral-800 p-4 sm:p-6 flex flex-col items-center justify-start min-h-[750px] overflow-auto`}
        >
          {/* Paper Sheet Representation */}
          <div
            className="bg-white rounded-sm shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden relative shrink-0 transition-all duration-150"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            {/* Ratio Watermark Header */}
            <div className="absolute top-1.5 right-2 pointer-events-none text-[9px] font-mono font-bold uppercase text-neutral-500/80 bg-white/95 dark:bg-neutral-900/90 px-1.5 py-0.5 rounded shadow-2xs select-none z-10 border border-neutral-200 dark:border-neutral-700">
              {isA4 ? 'ISO A4 (210×297mm · 1:1.414)' : 'US Letter (8.5×11in · 1:1.294)'}
            </div>

            <iframe
              srcDoc={htmlOutput}
              title="Full ATS Resume Paper Preview"
              className="border-none bg-white block"
              style={{
                width: `${baseSheetWidth}px`,
                height: `${baseSheetHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'auto',
              }}
              sandbox="allow-same-origin allow-scripts"
              aria-live="polite"
            />
          </div>

          <div className="mt-4 text-[11px] text-neutral-500 text-center">
            Exact ISO A4 printable ratio (210×297mm). Formatted for single-column applicant tracking systems (Workday, Greenhouse, Lever).
          </div>
        </div>
      </div>
    </div>
  );
};
