import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  FileType,
  FileSpreadsheet,
  FileJson,
  FileCode2,
  Copy,
  Check,
  Printer,
  Globe,
  Download,
  Share2,
} from 'lucide-react';
import type { ResumeDocument, ResumeContent, ResumeType } from '../../../../lib/resume/schema';
import { ExportFormatCard } from './ExportFormatCard';
import { ImportDropZone } from './ImportDropZone';
import { toHtmlAts } from '../../../../lib/resume/renderers/toHtmlAts';
import { toText } from '../../../../lib/resume/renderers/toText';
import { toMarkdown } from '../../../../lib/resume/renderers/toMarkdown';
import { toDocxBlob } from '../../../../lib/resume/renderers/toDocx';
import { printResumeToPdf, getResumePdfFilename } from '../../../../lib/resume/renderers/toPdf';

interface ExportPanelProps {
  resume: ResumeDocument;
  onImportParsed: (content: ResumeContent, fileType: ResumeType, filename: string) => void;
  onShowToast: (msg: string) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  resume,
  onImportParsed,
  onShowToast,
}) => {
  const [copiedPlainText, setCopiedPlainText] = useState(false);

  const content = resume.content;
  const isCv = resume.type === 'cv';

  // 1. PDF
  const handlePdfDownload = () => {
    printResumeToPdf(content);
    onShowToast('Opened ATS-optimized print preview for PDF generation.');
  };

  // 2. DOCX
  const handleDocxDownload = async () => {
    try {
      const blob = await toDocxBlob(content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.header.name.replace(/\s+/g, '_')}_${isCv ? 'CV' : 'Resume'}_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onShowToast('Downloaded Word document (.docx).');
    } catch (e) {
      onShowToast('Failed to create DOCX file.');
    }
  };

  // 3. HTML
  const handleHtmlDownload = () => {
    const html = toHtmlAts(content, `${content.header.name} - Resume (ATS)`);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.header.name.replace(/\s+/g, '_')}_${isCv ? 'CV' : 'Resume'}_ATS.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded semantic ATS HTML file.');
  };

  // 4. TXT
  const handleTxtDownload = () => {
    const text = toText(content);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.header.name.replace(/\s+/g, '_')}_${isCv ? 'CV' : 'Resume'}_ATS.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded plain text ATS file.');
  };

  // 5. Markdown
  const handleMdDownload = () => {
    const md = toMarkdown(content);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.header.name.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Markdown document (.md).');
  };

  // 6. JSON
  const handleJsonDownload = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.variant || 'resume'}-schema-v${resume.version}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded JSON schema backup.');
  };

  // Copy Plain Text for pasting into job applications
  const handleCopyPlainText = async () => {
    try {
      const text = toText(content);
      await navigator.clipboard.writeText(text);
      setCopiedPlainText(true);
      setTimeout(() => setCopiedPlainText(false), 2500);
      onShowToast('Copied ATS plain text to clipboard for job portal pasting!');
    } catch {
      onShowToast('Failed to copy text.');
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      const md = toMarkdown(content);
      await navigator.clipboard.writeText(md);
      onShowToast('Copied Markdown to clipboard.');
    } catch {
      onShowToast('Failed to copy Markdown.');
    }
  };

  const publicBase = isCv ? '/cv' : '/resume';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Multi-Format ATS Export &amp; Public Serving
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Export candidate data across industry standard formats without formatting corruption, tables, or parsing blockers.
          </p>
        </div>

        {/* Quick Portal Copy CTA */}
        <button
          type="button"
          onClick={handleCopyPlainText}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
        >
          {copiedPlainText ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedPlainText ? 'Copied to Clipboard!' : 'Copy for Job Portals (TXT)'}</span>
        </button>
      </div>

      {/* Public Serving Status Indicator */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">
              Live Public Endpoints:
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 ml-1.5">
              Always dynamically rendered from the currently active {resume.type} variant.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[`${publicBase}.pdf`, `${publicBase}.docx`, `${publicBase}.html`, `${publicBase}.txt`].map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono text-[11px] font-medium transition-colors"
            >
              {url} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Grid of 6 Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. PDF */}
        <ExportFormatCard
          title="PDF Document"
          extension=".pdf"
          badge="ATS Safe"
          description="Single-column, selectable text, standard Inter fonts, no tables or background images. Rendered for Workday & Greenhouse."
          icon={FileText}
          iconColor="text-rose-500"
          onDownload={handlePdfDownload}
          onPreview={() => printResumeToPdf(content)}
          publicUrl={`${publicBase}.pdf`}
        />

        {/* 2. DOCX */}
        <ExportFormatCard
          title="Microsoft Word"
          extension=".docx"
          badge="Enterprise Standard"
          description="Standard heading hierarchy (Heading 1, Heading 2, List Paragraph) with zero floating text boxes or sidebars."
          icon={FileType}
          iconColor="text-blue-500"
          onDownload={handleDocxDownload}
          publicUrl={`${publicBase}.docx`}
        />

        {/* 3. HTML */}
        <ExportFormatCard
          title="Semantic HTML5"
          extension=".html"
          badge="Web Native"
          description="Ultra-clean inline semantic markup with H1, H2, UL, LI. Ideal for custom recruiter portals and embed frames."
          icon={FileCode}
          iconColor="text-emerald-500"
          onDownload={handleHtmlDownload}
          onPreview={() => window.open(`${publicBase}.html`, '_blank')}
          publicUrl={`${publicBase}.html`}
        />

        {/* 4. Plain Text */}
        <ExportFormatCard
          title="Plain Text Stream"
          extension=".txt"
          badge="100% Parse Proof"
          description="ASCII-clean text stream with hyphen bullets and uppercase section headers. Zero risk of encoding corruption."
          icon={FileSpreadsheet}
          iconColor="text-amber-500"
          onDownload={handleTxtDownload}
          onCopy={handleCopyPlainText}
          publicUrl={`${publicBase}.txt`}
        />

        {/* 5. Markdown */}
        <ExportFormatCard
          title="GitHub Markdown"
          extension=".md"
          badge="Developer Friendly"
          description="Structured markdown formatting ideal for pasting into GitHub profile READMEs, Gists, and developer wikis."
          icon={FileCode2}
          iconColor="text-purple-500"
          onDownload={handleMdDownload}
          onCopy={handleCopyMarkdown}
        />

        {/* 6. JSON */}
        <ExportFormatCard
          title="JSON Schema"
          extension=".json"
          badge="Data Model"
          description="Full structured JSON payload including computed ATS scores, issues audit history, and section orders for programmatic reuse."
          icon={FileJson}
          iconColor="text-indigo-500"
          onDownload={handleJsonDownload}
        />
      </div>

      {/* Import Existing Drop Zone */}
      <ImportDropZone
        onImportParsed={onImportParsed}
        onShowToast={onShowToast}
      />
    </div>
  );
};
