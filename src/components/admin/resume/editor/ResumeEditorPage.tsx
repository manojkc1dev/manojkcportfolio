import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save,
  Copy,
  Printer,
  FileDown,
  Undo2,
  Redo2,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import type { ResumeDocument, ResumeContent, ResumeSection, SectionType } from '../../../../lib/resume/schema';
import { generateId } from '../../../../lib/resume/schema';
import { saveResume, duplicateResume } from '../../../../lib/resume/storage';
import { SectionList } from './SectionList';
import { SectionEditor } from './SectionEditor';
import { HeaderEditor } from './HeaderEditor';
import { LivePreview } from './LivePreview';
import { AutosaveIndicator } from './AutosaveIndicator';
import { printResumeToPdf } from '../../../../lib/resume/renderers/toPdf';
import { toDocxBlob } from '../../../../lib/resume/renderers/toDocx';
import { toHtmlAts } from '../../../../lib/resume/renderers/toHtmlAts';
import { toText } from '../../../../lib/resume/renderers/toText';

interface ResumeEditorPageProps {
  resume: ResumeDocument;
  allResumes?: ResumeDocument[];
  onSelectResumeId?: (id: string) => void;
  onUpdateResume: (updated: ResumeDocument) => void;
  onShowToast: (message: string) => void;
  onGoToTab: (tab: 'library' | 'editor' | 'preview' | 'ats' | 'export') => void;
}

export const ResumeEditorPage: React.FC<ResumeEditorPageProps> = ({
  resume,
  allResumes,
  onSelectResumeId,
  onUpdateResume,
  onShowToast,
  onGoToTab,
}) => {
  const [content, setContent] = useState<ResumeContent>(resume.content);
  const [activeSectionId, setActiveSectionId] = useState<string>('header');
  const [mobilePane, setMobilePane] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty' | 'error'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date(resume.updatedAt || Date.now()));
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Sync content whenever selected resume changes
  useEffect(() => {
    setContent(resume.content);
    historyRef.current = [resume.content];
    historyIndexRef.current = 0;
    setSaveStatus('saved');
    setLastSavedAt(new Date(resume.updatedAt || Date.now()));
  }, [resume.resumeId]);

  // Undo / Redo history
  const historyRef = useRef<ResumeContent[]>([resume.content]);
  const historyIndexRef = useRef<number>(0);
  const isPerformingHistoryActionRef = useRef<boolean>(false);

  const pushHistory = useCallback((nextContent: ResumeContent) => {
    if (isPerformingHistoryActionRef.current) return;
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(nextContent);
    if (history.length > 30) history.shift();
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
  }, []);

  const handleContentChange = (nextContent: ResumeContent) => {
    setContent(nextContent);
    setSaveStatus('dirty');
    pushHistory(nextContent);
  };

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isPerformingHistoryActionRef.current = true;
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      setContent(prev);
      setSaveStatus('dirty');
      isPerformingHistoryActionRef.current = false;
      onShowToast('Undo applied.');
    }
  }, [onShowToast]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isPerformingHistoryActionRef.current = true;
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      setContent(next);
      setSaveStatus('dirty');
      isPerformingHistoryActionRef.current = false;
      onShowToast('Redo applied.');
    }
  }, [onShowToast]);

  // Save implementation
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const updated = await saveResume({
        ...resume,
        content,
      });
      onUpdateResume(updated);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      onShowToast('Resume saved and ATS score re-calculated.');
    } catch (err) {
      setSaveStatus('error');
      onShowToast('Failed to save resume changes.');
    }
  }, [resume, content, onUpdateResume, onShowToast]);

  // Save as variant
  const handleSaveAsVariant = async () => {
    try {
      const copy = await duplicateResume(resume.resumeId);
      onShowToast(`Created variant copy: "${copy.variant}".`);
      onGoToTab('library');
    } catch (err) {
      onShowToast('Failed to clone variant.');
    }
  };

  // Autosave timer: every 20 seconds if dirty
  useEffect(() => {
    if (saveStatus !== 'dirty') return;
    const timer = setTimeout(() => {
      handleSave();
    }, 20000);
    return () => clearTimeout(timer);
  }, [saveStatus, handleSave]);

  // Keyboard shortcuts: Ctrl/Cmd+S (save), Ctrl/Cmd+E (export), Ctrl+Z / Ctrl+Shift+Z (undo/redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if (modifier && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setExportMenuOpen((prev) => !prev);
      } else if (modifier && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleUndo, handleRedo]);

  // Section operations
  const sections = content.sections || [];

  const handleSectionChange = (updatedSection: ResumeSection) => {
    const nextSections = sections.map((s) => (s.id === updatedSection.id ? updatedSection : s));
    handleContentChange({
      ...content,
      sections: nextSections,
    });
  };

  const handleAddSection = (type: SectionType, title: string) => {
    const newSection: ResumeSection = {
      id: generateId('sec'),
      type,
      title,
      visible: true,
      order: sections.length,
      entries: [
        {
          id: generateId('entry'),
          title: type === 'skills' ? 'Core Skills' : 'Role / Item Title',
          organization: '',
          bullets: ['Action bullet detailing measurable technical outcomes.'],
          visible: true,
        },
      ],
    };
    handleContentChange({
      ...content,
      sections: [...sections, newSection],
    });
    setActiveSectionId(newSection.id);
    onShowToast(`Added section "${title}".`);
  };

  const handleReorderSections = (newSections: ResumeSection[]) => {
    handleContentChange({
      ...content,
      sections: newSections,
    });
  };

  const handleToggleSectionVisible = (id: string) => {
    const nextSections = sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    handleContentChange({
      ...content,
      sections: nextSections,
    });
  };

  const handleDeleteSection = (id: string) => {
    const target = sections.find((s) => s.id === id);
    const nextSections = sections.filter((s) => s.id !== id);
    handleContentChange({
      ...content,
      sections: nextSections,
    });
    if (activeSectionId === id) {
      setActiveSectionId('header');
    }
    onShowToast(`Removed section "${target?.title || ''}".`);
  };

  // Quick export handlers
  const handleDownloadDocx = async () => {
    try {
      const blob = await toDocxBlob(content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.header.name.replace(/\s+/g, '_')}_Resume_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExportMenuOpen(false);
      onShowToast('Downloaded ATS-formatted DOCX file.');
    } catch (e) {
      onShowToast('Failed to generate DOCX file.');
    }
  };

  const handleDownloadHtml = () => {
    const html = toHtmlAts(content, `${content.header.name} - Resume (ATS)`);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.header.name.replace(/\s+/g, '_')}_Resume_ATS.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
    onShowToast('Downloaded ATS-safe HTML file.');
  };

  const handleDownloadTxt = () => {
    const txt = toText(content);
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.header.name.replace(/\s+/g, '_')}_Resume_ATS.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
    onShowToast('Downloaded plain text ATS resume.');
  };

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {resume.variant || 'Resume Editor'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {resume.type}
              </span>

              {allResumes && allResumes.length > 1 && onSelectResumeId && (
                <select
                  value={resume.resumeId}
                  onChange={(e) => onSelectResumeId(e.target.value)}
                  className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label="Switch resume or CV variant"
                >
                  {allResumes.map((r) => (
                    <option key={r.resumeId} value={r.resumeId}>
                      {r.variant} ({r.type.toUpperCase()}){r.isActive ? ' ★ Active' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mt-0.5">
              <AutosaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
            </div>
          </div>
        </div>

        {/* Undo / Redo & Actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndexRef.current <= 0}
              className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndexRef.current >= historyRef.current.length - 1}
              className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print / PDF Preview */}
          <button
            type="button"
            onClick={() => printResumeToPdf(content)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Preview and print directly to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview PDF</span>
          </button>

          {/* Full A4 Preview Tab Button */}
          <button
            type="button"
            onClick={() => onGoToTab('preview')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Open Dedicated Full A4 Preview & Visibility Manager"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">A4 Preview</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              aria-label="Export options"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      printResumeToPdf(content);
                      setExportMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    Export as PDF (.pdf)
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDocx}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    Export as Word (.docx)
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadHtml}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    Export as HTML (.html)
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    Export as Plain Text (.txt)
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setExportMenuOpen(false);
                      onGoToTab('export');
                    }}
                    className="w-full px-3 py-2 text-left text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Open Full Export Hub ↗
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Save as variant copy */}
          <button
            type="button"
            onClick={handleSaveAsVariant}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Save as Variant</span>
          </button>

          {/* Primary Save */}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Mobile Switcher (Editor / Preview) */}
      <div className="lg:hidden flex rounded-xl border border-neutral-200 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mobilePane === 'editor'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Section Editor
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mobilePane === 'preview'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Live ATS Preview
        </button>
      </div>

      {/* Main Layout (Desktop: Structure list + Entry Editor + Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Structure Column (3 cols) */}
        <div className={`lg:col-span-3 ${mobilePane === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <SectionList
            sections={sections}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
            onReorderSections={handleReorderSections}
            onAddSection={handleAddSection}
            onToggleVisible={handleToggleSectionVisible}
            onDeleteSection={handleDeleteSection}
          />
        </div>

        {/* Center Active Section Column (5 cols) */}
        <div className={`lg:col-span-5 ${mobilePane === 'editor' ? 'block' : 'hidden lg:block'}`}>
          {activeSectionId === 'header' ? (
            <HeaderEditor
              header={content.header}
              onChange={(nextHeader) => handleContentChange({ ...content, header: nextHeader })}
            />
          ) : activeSection ? (
            <SectionEditor section={activeSection} onChange={handleSectionChange} />
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
              Select a section from the structure panel to edit entries.
            </div>
          )}
        </div>

        {/* Right Live Preview Column (4 cols) */}
        <div
          className={`lg:col-span-4 sticky top-20 ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <LivePreview
            content={content}
            targetRole={resume.targetRole || 'Backend Engineer'}
            onGoToAtsCheck={() => onGoToTab('ats')}
            onGoToPreview={() => onGoToTab('preview')}
            onChangeContent={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
};
