import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Sparkles, Building, Briefcase, GraduationCap } from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const {
    isResumeModalOpen,
    setIsResumeModalOpen,
    resume,
    incrementResumeDownloads,
    hero,
    about,
    experiences,
    educations
  } = useCMS();

  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsResumeModalOpen(false);
      }
    };
    if (isResumeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResumeModalOpen, setIsResumeModalOpen]);

  if (!isResumeModalOpen) return null;

  const handleDownload = (format: 'pdf' | 'docx') => {
    incrementResumeDownloads();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);

    const targetUrl = format === 'pdf' ? resume.pdfUrl : resume.docxUrl;

    if (targetUrl && (targetUrl.startsWith('http') || targetUrl.startsWith('data:'))) {
      const element = document.createElement("a");
      element.href = targetUrl;
      element.download = `${hero.name.toLowerCase().replace(/\s+/g, '_')}_resume.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // Generated document blob
      const element = document.createElement("a");
      const file = new Blob([
        `CURRICULUM VITAE - ${hero.name}\n${hero.title}\nContact: ${hero.emailUrl}\n\nEXPERIENCE:\n${experiences.map(e => `${e.position} @ ${e.company} (${e.duration})\n${e.description}`).join('\n\n')}`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${hero.name.toLowerCase().replace(/\s+/g, '_')}_resume.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsResumeModalOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Principal Software Architect Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Version {resume.version} • Updated {resume.lastUpdated}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close Resume Modal"
            onClick={() => setIsResumeModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body - Paper Preview */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Download Action Bar */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Verified Principal Engineer Profile
              </div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                Tracked Downloads: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{resume.downloadsCount}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => handleDownload('docx')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Download DOCX
              </button>
            </div>
          </div>

          {downloaded && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Resume file downloaded & counted in CMS analytics!
            </div>
          )}

          {/* Paper Content Simulation */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{hero.name}</h2>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{hero.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{hero.location} • {hero.emailUrl}</p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
                Executive Profile
              </h3>
              <p className="leading-relaxed">{about.bio}</p>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                Work History
              </h3>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{exp.position} @ {exp.company}</span>
                      <span className="font-mono text-[11px] text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                Education
              </h3>
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-900 dark:text-white">{edu.degree} in {edu.major} — {edu.institute}</span>
                  <span className="font-mono text-slate-400">{edu.duration}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Security Hash: {resume.id}
          </span>
          <button
            onClick={() => setIsResumeModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
