import React from 'react';
import {
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Palette,
  Type,
  BookOpen,
  Layers,
  Grid,
} from 'lucide-react';
import type {
  ResumeCustomization,
  ResumeTemplateStyle,
  ResumeFontFamily,
  ResumeAccentColor,
  ResumeSpacingDensity,
  ResumePaperFormat,
  ResumePageLayout,
} from '../types';

interface ResumeCustomizerToolbarProps {
  customization: ResumeCustomization;
  onUpdateCustomization: (c: ResumeCustomization) => void;
  zoomLevel: number;
  onZoomChange: (z: number) => void;
  onExportWord: () => void;
  onExportPlainText: () => void;
  onPrintPdf: () => void;
  onCopyMarkdown: () => void;
  copiedMarkdown: boolean;
}

export const ResumeCustomizerToolbar: React.FC<ResumeCustomizerToolbarProps> = ({
  customization,
  onUpdateCustomization,
  zoomLevel,
  onZoomChange,
  onExportWord,
  onExportPlainText,
  onPrintPdf,
  onCopyMarkdown,
  copiedMarkdown,
}) => {
  return (
    <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
      {/* Left: Template & Paper Sheet Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Paper Format (A4 Standard) */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Paper:</span>
          </span>
          <select
            value={customization.paperFormat || 'a4'}
            onChange={(e) =>
              onUpdateCustomization({
                ...customization,
                paperFormat: e.target.value as ResumePaperFormat,
              })
            }
            className="px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="a4">A4 Paper (210 × 297 mm)</option>
            <option value="letter">US Letter (8.5 × 11 in)</option>
          </select>
        </div>

        {/* Page Sheet Mode */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sheets:</span>
          </span>
          <select
            value={customization.pageLayout || 'two-page'}
            onChange={(e) =>
              onUpdateCustomization({
                ...customization,
                pageLayout: e.target.value as ResumePageLayout,
              })
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="two-page">2-Page A4 Sheets (Discrete P1 &amp; P2)</option>
            <option value="single-page">Fit to 1-Page A4 Guarantee</option>
            <option value="continuous">Continuous A4 View</option>
          </select>
        </div>

        {/* Margin Guides */}
        <button
          type="button"
          onClick={() =>
            onUpdateCustomization({
              ...customization,
              showMarginGuides: !customization.showMarginGuides,
            })
          }
          className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
            customization.showMarginGuides
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
              : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
          title="Toggle A4 Print Safety Margin Guides (12mm)"
        >
          <Grid className="w-3 h-3 text-indigo-500" />
          <span>Margins: {customization.showMarginGuides ? 'ON' : 'OFF'}</span>
        </button>

        {/* Template Style */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">Template:</span>
          <select
            value={customization.templateStyle || 'executive'}
            onChange={(e) =>
              onUpdateCustomization({
                ...customization,
                templateStyle: e.target.value as ResumeTemplateStyle,
              })
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="executive">Executive Classic (Serif)</option>
            <option value="modern-tech">Silicon Valley Tech (Clean)</option>
            <option value="minimalist">Swiss Minimalist (Sans)</option>
            <option value="compact">Compact Pro</option>
          </select>
        </div>

        {/* Font Family */}
        <div className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={customization.fontFamily || 'serif'}
            onChange={(e) =>
              onUpdateCustomization({
                ...customization,
                fontFamily: e.target.value as ResumeFontFamily,
              })
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="serif">Garamond / Serif</option>
            <option value="sans">Inter / Modern Sans</option>
            <option value="mono">JetBrains Mono / Tech</option>
          </select>
        </div>

        {/* Spacing Density */}
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={customization.spacingDensity || 'standard'}
            onChange={(e) =>
              onUpdateCustomization({
                ...customization,
                spacingDensity: e.target.value as ResumeSpacingDensity,
              })
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="compact">Compact (Dense)</option>
            <option value="standard">Standard (A4 Balanced)</option>
            <option value="relaxed">Relaxed (Spacious)</option>
          </select>
        </div>

        {/* Accent Color Palette */}
        <div className="flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-neutral-400 mr-0.5" />
          {(['slate', 'navy', 'indigo', 'emerald', 'burgundy'] as ResumeAccentColor[]).map((color) => {
            const bgClass =
              color === 'navy'
                ? 'bg-blue-900'
                : color === 'indigo'
                ? 'bg-indigo-600'
                : color === 'emerald'
                ? 'bg-emerald-600'
                : color === 'burgundy'
                ? 'bg-rose-900'
                : 'bg-neutral-900';

            const isActive = (customization.accentColor || 'slate') === color;

            return (
              <button
                key={color}
                type="button"
                onClick={() => onUpdateCustomization({ ...customization, accentColor: color })}
                className={`w-5 h-5 rounded-full ${bgClass} transition-transform cursor-pointer ${
                  isActive ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title={`Accent: ${color}`}
              />
            );
          })}
        </div>
      </div>

      {/* Right: Zoom & Export Suite */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Zoom Controls with Fit and 100% */}
        <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => onZoomChange(65)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              zoomLevel === 65
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Fit to Dual-Pane Width (65%)"
          >
            Fit
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(100)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              zoomLevel === 100
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="100% True A4 Print Size"
          >
            100%
          </button>
          <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-700 mx-0.5" />
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(40, zoomLevel - 10))}
            className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(130, zoomLevel + 10))}
            className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Word (.doc) Export */}
        <button
          type="button"
          onClick={onExportWord}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
          title="Download Microsoft Word (.doc) formatted for ATS"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Word</span>
          <span className="sm:hidden">Word</span>
        </button>

        {/* Print / Save Vector PDF */}
        <button
          type="button"
          onClick={onPrintPdf}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold transition-colors cursor-pointer"
          title="Print or Save as Vector A4 ATS PDF"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Print / A4 PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>

        {/* Plain Text (.txt) */}
        <button
          type="button"
          onClick={onExportPlainText}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold transition-colors cursor-pointer"
          title="Download plain text (.txt)"
        >
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Plain Text</span>
        </button>

        {/* Copy Markdown */}
        <button
          type="button"
          onClick={onCopyMarkdown}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold transition-colors cursor-pointer"
        >
          {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{copiedMarkdown ? 'Copied' : 'Copy MD'}</span>
        </button>
      </div>
    </div>
  );
};
