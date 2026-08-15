import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Award, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const { certifications } = useCMS();

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Verified Cloud & System Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Industry Certifications
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Professional qualifications across AWS, CNCF Kubernetes, and Google Cloud Architecture.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Award className="w-6 h-6" />
                </div>

                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {cert.status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cert.title}
                </h3>
                <div className="text-xs font-semibold text-indigo-500">
                  {cert.issuer}
                </div>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>Credential ID: <span className="text-slate-700 dark:text-slate-300">{cert.credentialId}</span></div>
                <div>Issued: {cert.issueDate}</div>
              </div>

              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
              >
                Verify Credential <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
