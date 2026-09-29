import React, { useState } from 'react';
import {
  FileText,
  Layers,
  MoveRight,
  MoveLeft,
  Eye,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Grid,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import type { ResumeData, ResumeCustomization, ResumeSection, ResumeItem } from '../types';
import type { Profile } from '../../../types';

interface ResumeCanvasProps {
  resumeData: ResumeData;
  profile?: Profile;
  zoomLevel?: number;
  customization?: ResumeCustomization;
  onUpdateCustomization?: (c: ResumeCustomization) => void;
  onEditSection?: (sectionId: string) => void;
  onEditItem?: (sectionId: string, itemId: string) => void;
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({
  resumeData,
  profile,
  zoomLevel = 65,
  customization,
  onUpdateCustomization,
  onEditSection,
  onEditItem,
}) => {
  const paperFormat = customization?.paperFormat || 'a4';
  const pageLayout = customization?.pageLayout || 'two-page';
  const templateStyle = customization?.templateStyle || 'executive';
  const font = customization?.fontFamily || 'serif';
  const density = customization?.spacingDensity || 'standard';
  const accent = customization?.accentColor || 'slate';
  const showMarginGuides = customization?.showMarginGuides || false;

  // Local active page tab filter for quick inspection
  const [activeSheetTab, setActiveSheetTab] = useState<'all' | 'p1' | 'p2'>('all');

  // Paper Dimensions:
  // A4 standard at 96 DPI: 210mm x 297mm ≈ 794px × 1123px (aspect ratio 1 : 1.414)
  // US Letter at 96 DPI: 8.5in x 11.0in ≈ 816px × 1056px (aspect ratio 1 : 1.294)
  const isA4 = paperFormat === 'a4';
  const sheetWidthPx = isA4 ? 794 : 816;
  const sheetMinHeightPx = isA4 ? 1123 : 1056;

  // Scaled container width calculation
  const scaleFactor = zoomLevel / 100;
  const scaledWidthPx = Math.round(sheetWidthPx * scaleFactor);

  // Typography & Density Classes
  const fontClass =
    font === 'sans'
      ? 'font-sans'
      : font === 'mono'
      ? 'font-mono'
      : 'font-serif';

  const densitySpacing =
    density === 'compact'
      ? 'space-y-3 text-[11px]'
      : density === 'relaxed'
      ? 'space-y-5 text-sm'
      : 'space-y-4 text-xs';

  const bulletSpacing =
    density === 'compact'
      ? 'space-y-0.5 text-[10.5px]'
      : density === 'relaxed'
      ? 'space-y-1.5 text-xs'
      : 'space-y-1 text-[11px]';

  // Accent Colors
  const accentBorder =
    accent === 'navy'
      ? 'border-blue-900'
      : accent === 'indigo'
      ? 'border-indigo-600'
      : accent === 'emerald'
      ? 'border-emerald-700'
      : accent === 'burgundy'
      ? 'border-rose-900'
      : 'border-neutral-900';

  const accentHeadingColor =
    accent === 'navy'
      ? 'text-blue-950'
      : accent === 'indigo'
      ? 'text-indigo-900'
      : accent === 'emerald'
      ? 'text-emerald-950'
      : accent === 'burgundy'
      ? 'text-rose-950'
      : 'text-neutral-950';

  // Visible sections
  const visibleSections = resumeData.sections.filter(
    (s) =>
      !s.hidden &&
      (!customization?.hiddenSectionIds || !customization.hiddenSectionIds.includes(s.id))
  );

  // Section allocation between Page 1 and Page 2 in two-page mode
  let p1Sections: ResumeSection[] = [];
  let p2Sections: ResumeSection[] = [];

  if (pageLayout === 'two-page') {
    if (customization?.page1SectionIds && customization.page1SectionIds.length > 0) {
      p1Sections = visibleSections.filter((s) =>
        customization.page1SectionIds!.includes(s.id)
      );
      p2Sections = visibleSections.filter(
        (s) => !customization.page1SectionIds!.includes(s.id)
      );
    } else {
      // Intelligent enterprise default:
      // Page 1: Experience section(s)
      // Page 2: Skills, Education, Certifications, and custom sections
      p1Sections = visibleSections.filter((s) => s.category === 'experience');
      p2Sections = visibleSections.filter((s) => s.category !== 'experience');

      // Edge case: if no experience sections, split down middle
      if (p1Sections.length === 0 && visibleSections.length > 1) {
        const mid = Math.ceil(visibleSections.length / 2);
        p1Sections = visibleSections.slice(0, mid);
        p2Sections = visibleSections.slice(mid);
      }
    }
  } else {
    // Single page or continuous: all visible sections
    p1Sections = visibleSections;
    p2Sections = [];
  }

  // Shift section to Page 1 or Page 2
  const handleShiftSection = (sectionId: string, targetPage: 1 | 2) => {
    if (!onUpdateCustomization) return;
    const currentP1Ids = p1Sections.map((s) => s.id);
    let nextP1Ids: string[];

    if (targetPage === 1) {
      nextP1Ids = Array.from(new Set([...currentP1Ids, sectionId]));
    } else {
      nextP1Ids = currentP1Ids.filter((id) => id !== sectionId);
    }

    const nextP2Ids = visibleSections
      .map((s) => s.id)
      .filter((id) => !nextP1Ids.includes(id));

    onUpdateCustomization({
      ...customization,
      page1SectionIds: nextP1Ids,
      page2SectionIds: nextP2Ids,
    });
  };

  // Header Component (Page 1)
  const renderHeader = () => (
    <header
      className={`pb-3.5 border-b-2 ${accentBorder} ${
        templateStyle === 'modern-tech' ? 'text-left' : 'text-center'
      } space-y-1.5`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
        <h1
          className={`text-2xl sm:text-[26px] font-black tracking-tight ${accentHeadingColor} uppercase`}
        >
          {profile?.name || 'MANOJ KHATRI'}
        </h1>
        {templateStyle === 'modern-tech' && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold border border-neutral-300">
            ATS-COMPLIANT RESUME
          </span>
        )}
      </div>

      <p className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-700">
        {resumeData.targetHeadline}
      </p>

      <div className="text-[10.5px] text-neutral-600 flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-0.5 pt-0.5 font-sans">
        <span className="font-medium text-neutral-800">
          {profile?.location || 'Kathmandu, Nepal'}
        </span>
        <span className="text-neutral-400">•</span>
        <span className="font-medium text-neutral-800">
          {profile?.email || 'manojkc1dev@gmail.com'}
        </span>
        <span className="text-neutral-400">•</span>
        <span className="font-medium text-neutral-800">
          {profile?.phone || '+977 9842203976'}
        </span>
        <span className="text-neutral-400">•</span>
        <a
          href="https://manojkc1.com.np"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-900 font-semibold underline underline-offset-2"
        >
          manojkc1.com.np
        </a>
        <span className="text-neutral-400">•</span>
        <a
          href="https://github.com/manojkc1dev"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-900 font-semibold underline underline-offset-2"
        >
          github.com/manojkc1dev
        </a>
        <span className="text-neutral-400">•</span>
        <a
          href="https://linkedin.com/in/manojkc1dev"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-900 font-semibold underline underline-offset-2"
        >
          linkedin.com/in/manojkc1dev
        </a>
      </div>
    </header>
  );

  // Running Header (Page 2) - Clean, collision-free single-line layout
  const renderPage2RunningHeader = () => (
    <div className="pb-2.5 mb-2 border-b border-neutral-300 flex items-center justify-between gap-3 text-neutral-600 text-[10px] font-sans">
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="font-bold text-neutral-900 uppercase tracking-wider whitespace-nowrap">
          {profile?.name || 'MANOJ KHATRI'}
        </span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-600 font-medium truncate">
          {resumeData.targetHeadline}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 font-mono text-[9.5px]">
        <span className="hidden sm:inline text-neutral-500">{profile?.email || 'manojkc1dev@gmail.com'}</span>
        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 whitespace-nowrap">
          Page 2 of 2
        </span>
      </div>
    </div>
  );

  // Professional Summary Section
  const renderSummary = () => (
    <section className="space-y-1 pt-1 break-inside-avoid">
      <h2
        className={`text-[11px] font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 ${accentHeadingColor}`}
      >
        PROFESSIONAL SUMMARY
      </h2>
      <p className="leading-relaxed text-neutral-800 text-[11px]">
        {resumeData.summaryText}
      </p>
    </section>
  );

  // Single Section Renderer
  const renderSection = (section: ResumeSection, currentPage: 1 | 2) => {
    const visibleItems = section.items.filter((it) => !it.hidden);
    if (visibleItems.length === 0) return null;

    const isSkillsSection = section.category === 'skills';

    return (
      <section key={section.id} className="space-y-2 break-inside-avoid relative group">
        {/* Section Heading & Control Bar */}
        <div className="flex items-center justify-between border-b border-neutral-300 pb-0.5">
          <h2
            className={`text-[11px] font-bold uppercase tracking-wider ${accentHeadingColor}`}
          >
            {section.title.toUpperCase()}
          </h2>

          {/* Screen Only: Page Reallocation & Edit Triggers */}
          <div className="a4-interactive-ctrl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {pageLayout === 'two-page' && onUpdateCustomization && (
              <>
                {currentPage === 1 ? (
                  <button
                    type="button"
                    onClick={() => handleShiftSection(section.id, 2)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9.5px] font-semibold border border-indigo-200 cursor-pointer"
                    title="Send section to Sheet 2"
                  >
                    <span>Shift to Sheet 2</span>
                    <MoveRight className="w-2.5 h-2.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleShiftSection(section.id, 1)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9.5px] font-semibold border border-indigo-200 cursor-pointer"
                    title="Send section back to Sheet 1"
                  >
                    <MoveLeft className="w-2.5 h-2.5" />
                    <span>Shift to Sheet 1</span>
                  </button>
                )}
              </>
            )}

            {onEditSection && (
              <button
                type="button"
                onClick={() => onEditSection(section.id)}
                className="px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[9.5px] font-medium border border-neutral-300 cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Skills specialized clean matrix layout */}
        {isSkillsSection ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded border border-neutral-200/80 bg-neutral-50/50 space-y-0.5"
              >
                <div className="font-bold text-neutral-900 text-[11px] flex items-center justify-between">
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-medium px-1 rounded bg-neutral-200 text-neutral-700">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <div className="text-[10.5px] font-mono text-neutral-700 leading-snug">
                    {item.subtitle}
                  </div>
                )}
                {item.description && (
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* General Work Experience, Education, Certifications, etc. */
          <div className="space-y-2.5">
            {visibleItems.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-bold text-neutral-900 text-[11.5px] min-w-0">
                    <span>{item.title}</span>
                    {item.subtitle && (
                      <span className="font-semibold text-neutral-700">
                        {' '}
                        | {item.subtitle}
                      </span>
                    )}
                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase font-bold whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-medium text-neutral-500 font-sans shrink-0 whitespace-nowrap text-right">
                    {item.period}
                    {item.location && ` · ${item.location}`}
                  </div>
                </div>

                {item.description && (
                  <p className="text-neutral-700 text-[11px] leading-normal">
                    {item.description}
                  </p>
                )}

                {item.bullets && item.bullets.length > 0 && (
                  <ul className={`list-disc list-outside pl-4 text-neutral-800 ${bulletSpacing}`}>
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // Sheet Footer Component - Fully responsive and non-clipping
  const renderSheetFooter = (pageNumber: number, totalPages: number) => (
    <footer className="pt-2.5 mt-auto border-t border-neutral-200 flex items-center justify-between gap-2 text-[9.5px] text-neutral-500 font-sans">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-bold text-neutral-800 uppercase whitespace-nowrap">
          {profile?.name || 'MANOJ KHATRI'}
        </span>
        <span className="text-neutral-400">•</span>
        <span className="truncate text-neutral-600">{resumeData.targetHeadline}</span>
      </div>
      <div className="font-mono font-medium text-neutral-600 shrink-0 whitespace-nowrap text-right">
        Page {pageNumber} of {totalPages} · {isA4 ? 'A4 Standard' : 'Letter'}
      </div>
    </footer>
  );

  return (
    <div className="w-full max-w-full overflow-x-auto py-4 px-2 sm:px-4 bg-neutral-100/90 dark:bg-neutral-950 rounded-2xl flex flex-col items-center space-y-4">
      {/* Screen Control Strip: Sheet Nav & Display Mode */}
      <div className="a4-screen-only w-full flex flex-wrap items-center justify-between gap-2.5 text-xs pb-1">
        {/* Left: Sheet Switcher Tabs */}
        {pageLayout === 'two-page' ? (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveSheetTab('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                activeSheetTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All Sheets (1 &amp; 2)
            </button>
            <button
              type="button"
              onClick={() => setActiveSheetTab('p1')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                activeSheetTab === 'p1'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sheet 1 (P1)
            </button>
            <button
              type="button"
              onClick={() => setActiveSheetTab('p2')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                activeSheetTab === 'p2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sheet 2 (P2)
            </button>
          </div>
        ) : pageLayout === 'single-page' ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Strict 1-Page A4 Guarantee (210 × 297 mm)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
            <Scissors className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Continuous View with A4 Page Boundaries</span>
          </div>
        )}

        {/* Right: Format Badge & Margin Guidelines Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateCustomization?.({
                ...customization,
                showMarginGuides: !showMarginGuides,
              })
            }
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              showMarginGuides
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400'
            }`}
            title="Toggle print safe margin guides (12mm boundary)"
          >
            <Grid className="w-3 h-3 text-indigo-500" />
            <span>Margins: {showMarginGuides ? 'ON' : 'OFF'}</span>
          </button>

          <span className="px-2 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10.5px] font-semibold">
            {isA4 ? '210 × 297 mm' : '8.5 × 11 in'}
          </span>
        </div>
      </div>

      {/* Scaled Sizer Container - Ensures the layout space matches scaled visual width */}
      <div
        style={{
          width: `${scaledWidthPx}px`,
        }}
        className="flex flex-col items-center transition-all duration-150 overflow-visible mx-auto"
      >
        {/* Main Print Container Wrapper */}
        <div
          id="ats-print-container"
          style={{
            width: `${sheetWidthPx}px`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top center',
          }}
          className="flex flex-col items-center space-y-8 transition-transform duration-150"
        >
          {/* =========================================================================
              MODE 1: 2-PAGE A4 SHEETS (DISCRETE P1 & P2 SHEETS)
          ========================================================================== */}
          {pageLayout === 'two-page' && (
            <div className="w-full flex flex-col items-center space-y-8">
              {/* ----------------- SHEET 1 (PAGE 1 OF 2) ----------------- */}
              {(activeSheetTab === 'all' || activeSheetTab === 'p1') && (
                <div className="flex flex-col items-center" style={{ width: `${sheetWidthPx}px` }}>
                  {/* Screen Sheet Header Badge */}
                  <div
                    className="a4-sheet-badge mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs text-[11px]"
                    style={{ width: `${sheetWidthPx}px` }}
                  >
                    <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono">
                        SHEET 1 OF 2
                      </span>
                      <span>Executive Profile &amp; Senior Experience</span>
                    </div>
                    <span className="font-mono text-neutral-400 text-[10.5px]">
                      {isA4 ? 'A4 Paper (210 × 297 mm)' : 'Letter (8.5 × 11 in)'}
                    </span>
                  </div>

                  {/* Physical Sheet 1 */}
                  <div
                    className={`a4-page-sheet relative bg-white text-neutral-900 shadow-2xl rounded-sm border border-neutral-300/80 dark:border-neutral-700/60 transition-all ${fontClass} flex flex-col justify-between`}
                    style={{
                      width: `${sheetWidthPx}px`,
                      minHeight: `${sheetMinHeightPx}px`,
                      padding: '36px 44px',
                    }}
                  >
                    {/* Margin Guides Inset */}
                    {showMarginGuides && (
                      <div className="absolute inset-4 border border-dashed border-indigo-400/40 pointer-events-none rounded" />
                    )}

                    <div className={densitySpacing}>
                      {/* Header */}
                      {renderHeader()}

                      {/* Professional Summary */}
                      {renderSummary()}

                      {/* Page 1 Sections (Experience) */}
                      <div className="space-y-3.5">
                        {p1Sections.map((sec) => renderSection(sec, 1))}
                      </div>
                    </div>

                    {/* Sheet 1 Footer */}
                    {renderSheetFooter(1, 2)}
                  </div>
                </div>
              )}

              {/* Screen Page Break Line Separator (between P1 and P2) */}
              {activeSheetTab === 'all' && (
                <div
                  className="a4-page-divider my-2 flex items-center justify-center gap-3"
                  style={{ width: `${sheetWidthPx}px` }}
                >
                  <div className="flex-1 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                  <span className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10.5px] font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-xs">
                    <Scissors className="w-3.5 h-3.5 text-indigo-500" />
                    <span>PAGE BREAK · SHEET 2 BOUNDARY</span>
                  </span>
                  <div className="flex-1 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                </div>
              )}

              {/* ----------------- SHEET 2 (PAGE 2 OF 2) ----------------- */}
              {(activeSheetTab === 'all' || activeSheetTab === 'p2') && (
                <div className="flex flex-col items-center" style={{ width: `${sheetWidthPx}px` }}>
                  {/* Screen Sheet Header Badge */}
                  <div
                    className="a4-sheet-badge mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs text-[11px]"
                    style={{ width: `${sheetWidthPx}px` }}
                  >
                    <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200">
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono">
                        SHEET 2 OF 2
                      </span>
                      <span>Technical Arsenal, Education &amp; Credentials</span>
                    </div>
                    <span className="font-mono text-neutral-400 text-[10.5px]">
                      {isA4 ? 'A4 Paper (210 × 297 mm)' : 'Letter (8.5 × 11 in)'}
                    </span>
                  </div>

                  {/* Physical Sheet 2 */}
                  <div
                    className={`a4-page-sheet relative bg-white text-neutral-900 shadow-2xl rounded-sm border border-neutral-300/80 dark:border-neutral-700/60 transition-all ${fontClass} flex flex-col justify-between`}
                    style={{
                      width: `${sheetWidthPx}px`,
                      minHeight: `${sheetMinHeightPx}px`,
                      padding: '36px 44px',
                    }}
                  >
                    {/* Margin Guides Inset */}
                    {showMarginGuides && (
                      <div className="absolute inset-4 border border-dashed border-indigo-400/40 pointer-events-none rounded" />
                    )}

                    <div className={densitySpacing}>
                      {/* Running Header */}
                      {renderPage2RunningHeader()}

                      {/* Page 2 Sections */}
                      <div className="space-y-4 pt-1">
                        {p2Sections.length > 0 ? (
                          p2Sections.map((sec) => renderSection(sec, 2))
                        ) : (
                          <div className="text-center py-8 text-neutral-400 text-xs italic">
                            No sections currently placed on Sheet 2. Use the "Shift to Sheet 2" action on any section on Sheet 1 to balance your resume.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sheet 2 Footer */}
                    {renderSheetFooter(2, 2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MODE 2: SINGLE-PAGE A4 GUARANTEE
          ========================================================================== */}
          {pageLayout === 'single-page' && (
            <div className="flex flex-col items-center" style={{ width: `${sheetWidthPx}px` }}>
              {/* Sheet 1 with Smart Compacting */}
              <div
                className={`a4-page-sheet relative bg-white text-neutral-900 shadow-2xl rounded-sm border border-neutral-300/80 dark:border-neutral-700/60 transition-all ${fontClass} flex flex-col justify-between`}
                style={{
                  width: `${sheetWidthPx}px`,
                  minHeight: `${sheetMinHeightPx}px`,
                  padding: '30px 40px',
                }}
              >
                {showMarginGuides && (
                  <div className="absolute inset-4 border border-dashed border-indigo-400/40 pointer-events-none rounded" />
                )}

                <div className="space-y-2.5 text-[10.5px]">
                  {/* Header */}
                  {renderHeader()}

                  {/* Professional Summary */}
                  {renderSummary()}

                  {/* All Sections Compacted */}
                  <div className="space-y-2.5">
                    {visibleSections.map((sec) => renderSection(sec, 1))}
                  </div>
                </div>

                {/* Single Sheet Footer */}
                {renderSheetFooter(1, 1)}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 3: CONTINUOUS A4 VIEW (WITH PAGE BREAK GUIDELINES)
          ========================================================================== */}
          {pageLayout === 'continuous' && (
            <div className="flex flex-col items-center" style={{ width: `${sheetWidthPx}px` }}>
              <div
                className={`a4-page-sheet relative bg-white text-neutral-900 shadow-2xl rounded-sm border border-neutral-300/80 dark:border-neutral-700/60 transition-all ${fontClass} p-10`}
                style={{
                  width: `${sheetWidthPx}px`,
                  minHeight: `${sheetMinHeightPx}px`,
                }}
              >
                {showMarginGuides && (
                  <div className="absolute inset-4 border border-dashed border-indigo-400/40 pointer-events-none rounded" />
                )}

                {/* Visual Boundary Line at Page 1 Height */}
                <div
                  className="a4-screen-only absolute left-0 right-0 border-b-2 border-dashed border-indigo-300 dark:border-indigo-600 flex items-center justify-end pr-4 pointer-events-none"
                  style={{ top: `${sheetMinHeightPx}px` }}
                >
                  <span className="bg-indigo-600 text-white text-[9.5px] font-mono px-2 py-0.5 rounded-b font-bold tracking-wider">
                    ✂ A4 Page 1 / Page 2 Boundary (297mm)
                  </span>
                </div>

                <div className={densitySpacing}>
                  {renderHeader()}
                  {renderSummary()}
                  <div className="space-y-3.5">
                    {visibleSections.map((sec) => renderSection(sec, 1))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200">
                  {renderSheetFooter(1, 1)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
