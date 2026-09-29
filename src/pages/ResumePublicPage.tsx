import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  Download,
  Copy,
  Printer,
  ArrowLeft,
  Check,
  Share2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import type { ResumeDocument, ResumeType } from '../lib/resume/schema';
import { getActiveResume } from '../lib/resume/storage';
import { toDocxBlob } from '../lib/resume/renderers/toDocx';
import { toText } from '../lib/resume/renderers/toText';
import { printResumeToPdf } from '../lib/resume/renderers/toPdf';
import { Helmet } from 'react-helmet-async';

interface ResumePublicPageProps {
  type?: ResumeType;
}

export const ResumePublicPage: React.FC<ResumePublicPageProps> = ({ type: propType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCv = propType === 'cv' || location.pathname.toLowerCase().includes('/cv');
  const targetType: ResumeType = isCv ? 'cv' : 'resume';

  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const found = await getActiveResume(targetType);
        if (mounted) {
          setResume(found);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    }
    load();

    const handleUpdate = () => {
      load();
    };
    window.addEventListener('portfolio_resume_updated', handleUpdate);
    window.addEventListener('portfolio_data_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('portfolio_resume_updated', handleUpdate);
      window.removeEventListener('portfolio_data_updated', handleUpdate);
    };
  }, [targetType]);

  const handleDownloadDocx = async () => {
    if (!resume) return;
    try {
      const blob = await toDocxBlob(resume.content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.content.header.name.replace(/\s+/g, '_')}_${isCv ? 'CV' : 'Resume'}_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Downloaded Word (.docx) version.');
    } catch {
      showToast('Failed to generate DOCX file.');
    }
  };

  const handleCopyText = async () => {
    if (!resume) return;
    try {
      const text = toText(resume.content);
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      showToast('Copied plain text resume to clipboard.');
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      showToast('Unable to copy to clipboard.');
    }
  };

  const handlePrint = () => {
    if (!resume) return;
    printResumeToPdf(resume.content);
  };

  const content = resume?.content;
  const header = content?.header;
  const hiddenFields = new Set(header?.hiddenFields || []);
  const sections = (content?.sections || [])
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  const pageTitle = `${header?.name || 'Manoj Khatri'} - ${isCv ? 'Curriculum Vitae (CV)' : 'Resume'} | Backend Software Engineer`;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-6 px-3 sm:px-6 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Official ATS-optimized ${isCv ? 'Curriculum Vitae' : 'Resume'} of ${header?.name || 'Manoj Khatri'}, Backend Software Engineer.`}
        />
      </Helmet>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white shadow-xl flex items-center gap-2 text-xs font-semibold border border-neutral-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>

            <span className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {isCv ? 'Official CV' : 'Official Resume'}
              </span>
              <span className="text-[11px] text-neutral-500 hidden md:inline">
                ATS-Compliant &bull; Single-Column &bull; Clean Typography
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download PDF */}
            <a
              href={isCv ? '/cv.pdf' : '/resume.pdf'}
              download={`${(header?.name || 'Manoj_KC').replace(/\s+/g, '_')}_${isCv ? 'CV' : 'Resume'}.pdf`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            {/* Download DOCX */}
            <button
              type="button"
              onClick={handleDownloadDocx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Download Microsoft Word .docx"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Word (.docx)</span>
            </button>

            {/* Copy Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Copy plain text formatted for job portals"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedText ? 'Copied' : 'Plain Text'}</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Print directly or save as PDF via system dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Resume Paper Sheet */}
      <div className="max-w-4xl mx-auto">
        <main
          id="main-content"
          className="bg-white text-neutral-900 rounded-2xl shadow-md border border-neutral-200/80 p-6 sm:p-10 md:p-12 print:p-0 print:border-none print:shadow-none print:rounded-none"
          style={{ minHeight: '1050px' }}
        >
          {loading ? (
            <div className="py-24 text-center text-xs text-neutral-400">
              Loading resume document...
            </div>
          ) : !header ? (
            <div className="py-24 text-center text-xs text-neutral-400">
              Resume content unavailable.
            </div>
          ) : (
            <article className="space-y-6 max-w-3xl mx-auto">
              {/* Header / Identity */}
              <header className="border-b border-neutral-300 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 uppercase">
                  {header.name}
                </h1>
                {header.title && !hiddenFields.has('title') && (
                  <p className="text-base sm:text-lg font-semibold text-neutral-800 mt-1">
                    {header.title}
                  </p>
                )}

                {/* Contact details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-neutral-600">
                  {header.email && !hiddenFields.has('email') && (
                    <a href={`mailto:${header.email}`} className="hover:underline">
                      {header.email}
                    </a>
                  )}
                  {header.phone && !hiddenFields.has('phone') && <span>&bull; {header.phone}</span>}
                  {header.location && !hiddenFields.has('location') && <span>&bull; {header.location}</span>}
                  {header.linkedin && !hiddenFields.has('linkedin') && (
                    <span>
                      &bull;{' '}
                      <a href={header.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    </span>
                  )}
                  {header.github && !hiddenFields.has('github') && (
                    <span>
                      &bull;{' '}
                      <a href={header.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        GitHub
                      </a>
                    </span>
                  )}
                  {header.website && !hiddenFields.has('website') && (
                    <span>
                      &bull;{' '}
                      <a href={header.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Portfolio
                      </a>
                    </span>
                  )}
                </div>
              </header>

              {/* Summary */}
              {header.summary && !hiddenFields.has('summary') && (
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-800">
                    {header.summary}
                  </p>
                </section>
              )}

              {/* Dynamic Sections */}
              {sections.map((section) => (
                <section key={section.id} className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {(section.entries || [])
                      .filter((e) => e.visible !== false)
                      .map((entry) => {
                        const hiddenBulletsSet = new Set(entry.hiddenBullets || []);
                        const visibleBullets = (entry.bullets || []).filter(
                          (b, idx) => b && !hiddenBulletsSet.has(idx)
                        );

                        return (
                          <div key={entry.id} className="space-y-1">
                            {/* Title & Dates */}
                            <div className="flex items-baseline justify-between gap-2 flex-wrap">
                              <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                                {entry.title}
                                {entry.organization ? (
                                  <span className="font-normal text-neutral-700"> — {entry.organization}</span>
                                ) : null}
                              </h3>
                              {(entry.startDate || entry.endDate) && (
                                <span className="text-xs font-medium text-neutral-600">
                                  {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
                                </span>
                              )}
                            </div>

                            {/* Location & Tags */}
                            {entry.location && (
                              <p className="text-xs text-neutral-500 italic">
                                {entry.location}
                              </p>
                            )}

                            {entry.tags && entry.tags.length > 0 && (
                              <p className="text-xs text-neutral-700">
                                <span className="font-semibold">Technologies:</span> {entry.tags.join(', ')}
                              </p>
                            )}

                            {/* Bullets */}
                            {visibleBullets.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm text-neutral-800 leading-relaxed">
                                {visibleBullets.map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </section>
              ))}
            </article>
          )}
        </main>
      </div>
    </div>
  );
};
