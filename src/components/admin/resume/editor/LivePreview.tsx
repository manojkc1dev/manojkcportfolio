import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  FileCode,
  FileText,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  Eye,
  EyeOff,
  Sliders,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import type { ResumeContent } from '../../../../lib/resume/schema';
import { toHtmlAts } from '../../../../lib/resume/renderers/toHtmlAts';
import { toText } from '../../../../lib/resume/renderers/toText';
import { runAtsAudit } from '../../../../lib/resume/ats/rules';
import { downloadAtsPdf, printResumeToPdf } from '../../../../lib/resume/renderers/toPdf';

interface LivePreviewProps {
  content: ResumeContent;
  targetRole?: string;
  onGoToAtsCheck?: () => void;
  onGoToPreview?: () => void;
  onChangeContent?: (content: ResumeContent) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  content,
  targetRole = 'Backend Engineer',
  onGoToAtsCheck,
  onGoToPreview,
  onChangeContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(380);
  const [debouncedContent, setDebouncedContent] = useState<ResumeContent>(content);
  const [viewMode, setViewMode] = useState<'html' | 'parsed'>('html');
  const [copied, setCopied] = useState(false);

  // Paper & Ratio View Options
  const [paperFormat, setPaperFormat] = useState<'a4' | 'letter'>('a4');
  const [zoomMode, setZoomMode] = useState<'fit' | '50' | '75' | '100' | '125'>('fit');
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(false);
  const [showHiddenItems, setShowHiddenItems] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<'fit' | '75' | '100'>('fit');

  // Measure container width for accurate responsive fit
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

  // Debounce 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContent(content);
    }, 250);
    return () => clearTimeout(timer);
  }, [content]);

  const audit = useMemo(() => {
    return runAtsAudit(debouncedContent, targetRole);
  }, [debouncedContent, targetRole]);

  const htmlOutput = useMemo(() => {
    return toHtmlAts(debouncedContent, `${debouncedContent.header.name} - ATS Paper Preview`, {
      paperFormat,
      showMarginGuides,
      showHidden: showHiddenItems,
    });
  }, [debouncedContent, paperFormat, showMarginGuides, showHiddenItems]);

  const textOutput = useMemo(() => {
    return toText(debouncedContent);
  }, [debouncedContent]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handlePrint = () => {
    printResumeToPdf(debouncedContent);
  };

  const handleDownloadPdf = () => {
    downloadAtsPdf(debouncedContent);
  };

  const errorCount = audit.issues.filter((i) => i.severity === 'error').length;
  const warningCount = audit.issues.filter((i) => i.severity === 'warning').length;

  // Exact A4 dimensions in pixels at 96 DPI:
  // A4: 210mm x 297mm ≈ 794px x 1123px (aspect ratio 1 : 1.414)
  // US Letter: 8.5in x 11in ≈ 816px x 1056px (aspect ratio 1 : 1.294)
  const isA4 = paperFormat === 'a4';
  const baseSheetWidth = isA4 ? 794 : 816;
  const baseSheetHeight = isA4 ? 1123 : 1056;

  // Responsive scale computation
  const availableWidth = Math.max(260, containerWidth - 32);
  const fitScale = Math.min(1.2, Math.max(0.35, availableWidth / baseSheetWidth));
  const scale =
    zoomMode === 'fit'
      ? fitScale
      : zoomMode === '50'
      ? 0.5
      : zoomMode === '75'
      ? 0.75
      : zoomMode === '100'
      ? 1.0
      : 1.25;

  const scaledWidth = Math.round(baseSheetWidth * scale);
  const scaledHeight = Math.round(baseSheetHeight * scale);

  // Quick toggle helper for header fields
  const handleToggleField = (fieldName: string) => {
    if (!onChangeContent) return;
    const hidden = new Set(debouncedContent.header.hiddenFields || []);
    if (hidden.has(fieldName)) {
      hidden.delete(fieldName);
    } else {
      hidden.add(fieldName);
    }
    onChangeContent({
      ...debouncedContent,
      header: {
        ...debouncedContent.header,
        hiddenFields: Array.from(hidden),
      },
    });
  };

  const hiddenFieldsSet = new Set(debouncedContent.header.hiddenFields || []);

  return (
    <>
      <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-3 bg-neutral-50/80 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {/* ATS Score chip */}
            <button
              type="button"
              onClick={onGoToAtsCheck}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 cursor-pointer ${
                audit.score >= 85
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : audit.score >= 70
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}
              title="Click to view ATS Audit breakdown"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS {audit.score}/100</span>
            </button>

            {(errorCount > 0 || warningCount > 0) && (
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden xl:inline">
                {errorCount > 0 && <span className="text-rose-600 font-semibold">{errorCount} errors </span>}
                {warningCount > 0 && <span className="text-amber-600 font-semibold">{warningCount} warnings</span>}
              </span>
            )}
          </div>

          {/* View mode toggle & Fullscreen preview */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-700/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode('html')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'html'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                <FileCode className="w-3 h-3 text-indigo-500" />
                <span>A4 Layout</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('parsed')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'parsed'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                <FileText className="w-3 h-3 text-amber-500" />
                <span>ATS Parser</span>
              </button>
            </div>

            {/* Expand / Modal Preview button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Open Full Page Preview View (A4 Paper View)"
              aria-label="Expand preview modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Paper Ratio & Inspection Sub-Toolbar */}
        {viewMode === 'html' && (
          <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Paper format & margins */}
            <div className="flex items-center gap-2">
              <select
                value={paperFormat}
                onChange={(e) => setPaperFormat(e.target.value as 'a4' | 'letter')}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                title="Select print paper standard"
              >
                <option value="a4">ISO A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
              </select>

              {/* Margin guides toggle */}
              <button
                type="button"
                onClick={() => setShowMarginGuides(!showMarginGuides)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                  showMarginGuides
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
                title="Toggle dashed lines showing standard 15mm ATS margins"
              >
                Margins: {showMarginGuides ? 'ON' : 'OFF'}
              </button>

              {/* Show / Hide Hidden Items toggle */}
              <button
                type="button"
                onClick={() => setShowHiddenItems(!showHiddenItems)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                  showHiddenItems
                    ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
                title="Toggle inspection of hidden sections/bullets"
              >
                {showHiddenItems ? <Eye className="w-3 h-3 text-amber-600" /> : <EyeOff className="w-3 h-3 text-neutral-400" />}
                <span>{showHiddenItems ? 'Showing Hidden' : 'Hide Excluded'}</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setZoomMode('fit')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  zoomMode === 'fit'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Fit automatically to preview container width"
              >
                Fit ({Math.round(scale * 100)}%)
              </button>
              {(['50', '75', '100'] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoomMode(z)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    zoomMode === z
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Content Canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-neutral-200/60 dark:bg-neutral-950 p-4 flex flex-col items-center justify-start min-h-[450px]"
        >
          {viewMode === 'html' ? (
            <div className="flex flex-col items-center">
              {/* Paper Sheet Representation with Pixel-Perfect Aspect Ratio */}
              <div
                className="bg-white rounded-sm shadow-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden relative shrink-0"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
              >
                {/* Paper Ratio Header Watermark */}
                <div className="absolute top-1.5 right-2 pointer-events-none text-[9px] font-mono font-bold uppercase text-neutral-500/80 bg-white/90 dark:bg-neutral-900/90 px-1.5 py-0.5 rounded shadow-2xs select-none z-10 border border-neutral-200 dark:border-neutral-700">
                  {isA4 ? 'ISO A4 (1 : 1.414)' : 'US Letter (1 : 1.294)'}
                </div>

                <iframe
                  srcDoc={htmlOutput}
                  title="ATS Resume Paper Preview"
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

              {/* Bottom Action Toolbar */}
              <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
                {onGoToPreview && (
                  <button
                    type="button"
                    onClick={onGoToPreview}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white shadow-xs transition-colors cursor-pointer"
                    title="Open full page dedicated Preview view"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Full Preview View</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer"
                  title="Download clean A4 PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download A4 PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                  title="Open native browser print / save dialog"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dialog</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-neutral-900 text-neutral-100 rounded-xl p-4 font-mono text-xs leading-relaxed border border-neutral-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <span className="text-neutral-400 text-[11px]">
                  // Plain text stream as parsed by Workday, Greenhouse &amp; Lever ATS systems
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Plain Text'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap selection:bg-indigo-600 selection:text-white">
                {textOutput}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Page Preview Modal (Modal View) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
        >
          {/* Modal Header Bar */}
          <div className="w-full max-w-5xl bg-neutral-900 text-white rounded-t-2xl px-4 py-3 flex items-center justify-between gap-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400">
                <FileCode className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  Full Page Preview — {debouncedContent.header.name}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Exact ISO A4 printable ratio (210×297mm) with ATS layout verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-neutral-800 p-0.5 rounded-lg border border-neutral-700 text-xs">
                {(['fit', '75', '100'] as const).map((mz) => (
                  <button
                    key={mz}
                    type="button"
                    onClick={() => setModalZoom(mz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      modalZoom === mz
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mz === 'fit' ? 'Fit Window' : `${mz}%`}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Paper Viewer */}
          <div className="w-full max-w-5xl flex-1 bg-neutral-900/90 rounded-b-2xl p-4 sm:p-6 overflow-auto flex justify-center items-start">
            {(() => {
              const modalScale =
                modalZoom === 'fit'
                  ? Math.min(1.0, Math.max(0.4, 760 / baseSheetWidth))
                  : modalZoom === '75'
                  ? 0.75
                  : 1.0;
              const modalW = Math.round(baseSheetWidth * modalScale);
              const modalH = Math.round(baseSheetHeight * modalScale);

              return (
                <div
                  className="bg-white rounded-md shadow-2xl overflow-hidden relative shrink-0"
                  style={{
                    width: `${modalW}px`,
                    height: `${modalH}px`,
                  }}
                >
                  <iframe
                    srcDoc={htmlOutput}
                    title="Full Screen ATS Resume Preview"
                    className="border-none bg-white block"
                    style={{
                      width: `${baseSheetWidth}px`,
                      height: `${baseSheetHeight}px`,
                      transform: `scale(${modalScale})`,
                      transformOrigin: 'top left',
                    }}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};
