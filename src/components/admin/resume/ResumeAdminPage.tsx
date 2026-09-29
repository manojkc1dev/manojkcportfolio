import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FolderKanban,
  Edit3,
  Eye,
  ShieldCheck,
  FileDown,
  Sparkles,
  ExternalLink,
  History,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import type {
  ResumeDocument,
  ResumeType,
  ResumeTheme,
  ResumeContent,
  AtsIssue,
} from '../../../lib/resume/schema';
import {
  listResumes,
  saveResume,
  deleteResume,
  duplicateResume,
  setActiveResume,
  togglePublicResume,
  getActiveResume,
} from '../../../lib/resume/storage';
import { ResumeLibrary } from './library/ResumeLibrary';
import { ResumeEditorPage } from './editor/ResumeEditorPage';
import { ResumePreviewView } from './preview/ResumePreviewView';
import { AtsCheckPage } from './ats/AtsCheckPage';
import { ExportPanel } from './export/ExportPanel';
import { createDefaultResume, generateId } from '../../../lib/resume/schema';

type TabType = 'library' | 'editor' | 'preview' | 'ats' | 'export';

interface ResumeAdminPageProps {
  onShowToast?: (message: string) => void;
  adminEmail?: string;
}

export const ResumeAdminPage: React.FC<ResumeAdminPageProps> = ({
  onShowToast,
  adminEmail = 'manojkc1dev@gmail.com',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state from URL param or default to 'library'
  const validTabs: TabType[] = ['library', 'editor', 'preview', 'ats', 'export'];
  const urlSubTab = (searchParams.get('subtab') ||
    (searchParams.get('tab') !== 'resume' && searchParams.get('tab') !== 'cv'
      ? searchParams.get('tab')
      : null)) as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(
    validTabs.includes(urlSubTab) ? urlSubTab : 'library'
  );

  // Resume list & active selected resume for editing/checking
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    searchParams.get('id') || null
  );
  const [loading, setLoading] = useState(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = useCallback(
    (message: string) => {
      setToastMessage(message);
      if (onShowToast) onShowToast(message);
      setTimeout(() => {
        setToastMessage((cur) => (cur === message ? null : cur));
      }, 4000);
    },
    [onShowToast]
  );

  // Load all resumes
  const refreshResumes = useCallback(async () => {
    try {
      const data = await listResumes();
      setResumes(data);
      if (!selectedResumeId && data.length > 0) {
        // default to active resume or first
        const active = data.find((r) => r.isActive) || data[0];
        setSelectedResumeId(active.resumeId);
      }
    } catch {
      showNotification('Failed to load resume database.');
    } finally {
      setLoading(false);
    }
  }, [selectedResumeId, showNotification]);

  useEffect(() => {
    refreshResumes();
  }, [refreshResumes]);

  // Sync state if searchParams change externally
  useEffect(() => {
    const sub = (searchParams.get('subtab') ||
      (searchParams.get('tab') !== 'resume' && searchParams.get('tab') !== 'cv'
        ? searchParams.get('tab')
        : null)) as TabType;
    if (sub && validTabs.includes(sub)) {
      setActiveTab(sub);
    }
    const id = searchParams.get('id');
    if (id && id !== selectedResumeId) {
      setSelectedResumeId(id);
    }
  }, [searchParams]);

  // Tab change handler
  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'resume');
      next.set('subtab', tab);
      if (selectedResumeId) {
        next.set('id', selectedResumeId);
      }
      return next;
    });
  };

  const selectedResume = useMemo(() => {
    return (
      resumes.find((r) => r.resumeId === selectedResumeId) ||
      resumes.find((r) => r.isActive) ||
      resumes[0] ||
      null
    );
  }, [resumes, selectedResumeId]);

  // Actions from library
  const handleSelectToEdit = (resume: ResumeDocument) => {
    setSelectedResumeId(resume.resumeId);
    handleSelectTab('editor');
  };

  const handleSelectToExport = (resume: ResumeDocument) => {
    setSelectedResumeId(resume.resumeId);
    handleSelectTab('export');
  };

  const handleSetActive = async (resume: ResumeDocument) => {
    try {
      await setActiveResume(resume.resumeId, resume.type);
      showNotification(`Set "${resume.variant}" as active live ${resume.type}.`);
      await refreshResumes();
    } catch {
      showNotification('Failed to update active resume.');
    }
  };

  const handleDuplicate = async (resume: ResumeDocument) => {
    try {
      const copy = await duplicateResume(resume.resumeId);
      showNotification(`Created duplicate copy: "${copy.variant}".`);
      await refreshResumes();
      setSelectedResumeId(copy.resumeId);
      handleSelectTab('editor');
    } catch {
      showNotification('Failed to duplicate resume.');
    }
  };

  const handleTogglePublic = async (resume: ResumeDocument) => {
    try {
      await togglePublicResume(resume.resumeId, !resume.isPublic);
      showNotification(
        `Variant "${resume.variant}" is now ${!resume.isPublic ? 'Public' : 'Private'}.`
      );
      await refreshResumes();
    } catch {
      showNotification('Failed to toggle public visibility.');
    }
  };

  const handleDelete = async (resume: ResumeDocument) => {
    try {
      await deleteResume(resume.resumeId);
      showNotification(`Deleted resume variant "${resume.variant}".`);
      await refreshResumes();
      if (selectedResumeId === resume.resumeId) {
        setSelectedResumeId(null);
      }
    } catch {
      showNotification('Failed to delete resume.');
    }
  };

  const handleCreateNew = async (options: {
    type: ResumeType;
    variant: string;
    title: string;
    theme: ResumeTheme;
  }) => {
    try {
      const newResume = createDefaultResume(options.type, options.variant);
      newResume.content.header.title = options.title;
      newResume.theme = options.theme;
      newResume.isActive = false;

      const saved = await saveResume(newResume);
      showNotification(`Created new ${options.type} variant "${options.variant}".`);
      await refreshResumes();
      setSelectedResumeId(saved.resumeId);
      handleSelectTab('editor');
    } catch {
      showNotification('Failed to create new resume.');
    }
  };

  const handleImportParsed = async (
    parsedContent: ResumeContent,
    fileType: ResumeType,
    filename: string
  ) => {
    try {
      const newResume = createDefaultResume(fileType, `imported-${Date.now().toString(36)}`);
      newResume.content = parsedContent;
      newResume.isActive = false;

      const saved = await saveResume(newResume);
      showNotification(`Successfully imported and structured ${filename}.`);
      await refreshResumes();
      setSelectedResumeId(saved.resumeId);
      handleSelectTab('editor');
    } catch {
      showNotification('Failed to store imported resume.');
    }
  };

  const handleUpdateResume = (updated: ResumeDocument) => {
    setResumes((prev) => prev.map((r) => (r.resumeId === updated.resumeId ? updated : r)));
  };

  // Deep link "Fix now" from ATS check tab straight to editor
  const handleFixNowFromAts = (issue: AtsIssue) => {
    handleSelectTab('editor');
    showNotification(`Navigated to editor for ${issue.section} issue.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-neutral-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Resume &amp; CV Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Enterprise ATS resume builder, in-browser editor, multi-format export, and live candidate serving.
          </p>
        </div>

        {/* Selected resume quick indicator & variant switcher */}
        {selectedResume && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-xs">
            <span className="text-neutral-400 font-medium">Selected:</span>
            {resumes.length > 1 ? (
              <select
                value={selectedResume.resumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('id', e.target.value);
                    return next;
                  });
                }}
                className="font-bold text-neutral-900 dark:text-white bg-transparent border-0 cursor-pointer focus:outline-none"
                aria-label="Select active variant"
              >
                {resumes.map((r) => (
                  <option key={r.resumeId} value={r.resumeId} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                    {r.variant} ({r.type.toUpperCase()}){r.isActive ? ' ★ Active' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[140px]">
                {selectedResume.variant}
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {selectedResume.atsScore || 90} ATS
            </span>
          </div>
        )}
      </div>

      {/* 5 Main Tabs: [ Library ] [ Editor ] [ A4 Preview ] [ ATS Check ] [ Export ] */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0">
        {[
          { id: 'library' as TabType, label: 'Library', icon: FolderKanban },
          { id: 'editor' as TabType, label: 'Editor', icon: Edit3 },
          { id: 'preview' as TabType, label: 'A4 Preview & Visibility', icon: Eye },
          {
            id: 'ats' as TabType,
            label: 'ATS Check',
            icon: ShieldCheck,
            badge: selectedResume ? `${selectedResume.atsScore || 90}/100` : undefined,
          },
          { id: 'export' as TabType, label: 'Export & Serve', icon: FileDown },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">
          Loading resume records...
        </div>
      ) : activeTab === 'library' ? (
        <ResumeLibrary
          resumes={resumes}
          onSelectResume={handleSelectToEdit}
          onExportResume={handleSelectToExport}
          onSetActive={handleSetActive}
          onDuplicate={handleDuplicate}
          onTogglePublic={handleTogglePublic}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
          onImportResume={handleImportParsed}
        />
      ) : activeTab === 'editor' && selectedResume ? (
        <ResumeEditorPage
          resume={selectedResume}
          allResumes={resumes}
          onSelectResumeId={(id) => {
            setSelectedResumeId(id);
            setSearchParams((prev) => {
              const n = new URLSearchParams(prev);
              n.set('id', id);
              return n;
            });
          }}
          onUpdateResume={handleUpdateResume}
          onShowToast={showNotification}
          onGoToTab={handleSelectTab}
        />
      ) : activeTab === 'preview' && selectedResume ? (
        <ResumePreviewView
          resume={selectedResume}
          allResumes={resumes}
          onSelectResumeId={(id) => {
            setSelectedResumeId(id);
            setSearchParams((prev) => {
              const n = new URLSearchParams(prev);
              n.set('id', id);
              return n;
            });
          }}
          onUpdateResume={handleUpdateResume}
          onShowToast={showNotification}
          onGoToEditor={() => handleSelectTab('editor')}
        />
      ) : activeTab === 'ats' && selectedResume ? (
        <AtsCheckPage
          resume={selectedResume}
          onUpdateResume={handleUpdateResume}
          onFixNow={handleFixNowFromAts}
          onShowToast={showNotification}
        />
      ) : activeTab === 'export' && selectedResume ? (
        <ExportPanel
          resume={selectedResume}
          onImportParsed={handleImportParsed}
          onShowToast={showNotification}
        />
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">
            No resume variant selected. Choose a resume from the Library to begin.
          </p>
          <button
            type="button"
            onClick={() => handleSelectTab('library')}
            className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white cursor-pointer"
          >
            Go to Library
          </button>
        </div>
      )}
    </div>
  );
};
