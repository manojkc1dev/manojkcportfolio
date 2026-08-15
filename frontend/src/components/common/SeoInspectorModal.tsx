import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Copy, Check, FileCode, Search, CheckCircle2, Globe } from 'lucide-react';

export const SeoInspectorModal: React.FC = () => {
  const { isSeoInspectorOpen, setIsSeoInspectorOpen, seo, hero, about } = useCMS();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSeoInspectorOpen(false);
      }
    };
    if (isSeoInspectorOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSeoInspectorOpen, setIsSeoInspectorOpen]);

  if (!isSeoInspectorOpen) return null;

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": seo.schemaType || "Person",
    "name": hero.name,
    "jobTitle": hero.title,
    "description": seo.metaDescription,
    "url": seo.canonicalUrl,
    "image": hero.profileImage,
    "sameAs": [
      hero.githubUrl,
      hero.linkedinUrl
    ],
    "knowsAbout": [
      "Python", "Django", "FastAPI", "PostgreSQL", "System Architecture", "Clean Architecture", "Microservices"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Enterprise Consulting"
    }
  };

  const formattedJsonLd = JSON.stringify(jsonLdSchema, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsSeoInspectorOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SEO & Schema.org JSON-LD Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live OpenGraph, Twitter Cards, & Structured Data Markup
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close SEO Inspector"
            onClick={() => setIsSeoInspectorOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Google Search Result Preview Card */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              Google Search Result Snippet Preview
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-500" />
                {seo.canonicalUrl}
              </div>
              <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                {seo.siteTitle}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {seo.metaDescription}
              </p>
            </div>
          </div>

          {/* Social OpenGraph Preview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OpenGraph Meta</span>
              <div className="text-xs space-y-1 font-mono text-slate-600 dark:text-slate-300">
                <div><span className="text-indigo-500">og:title:</span> {seo.siteTitle}</div>
                <div><span className="text-indigo-500">og:type:</span> website</div>
                <div><span className="text-indigo-500">og:url:</span> {seo.canonicalUrl}</div>
                <div><span className="text-indigo-500">og:image:</span> {seo.ogImage}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Twitter Card Spec</span>
              <div className="text-xs space-y-1 font-mono text-slate-600 dark:text-slate-300">
                <div><span className="text-indigo-500">twitter:card:</span> {seo.twitterCard}</div>
                <div><span className="text-indigo-500">twitter:creator:</span> @manojkhatri_dev</div>
                <div><span className="text-indigo-500">robots:</span> {seo.robots}</div>
              </div>
            </div>
          </div>

          {/* Schema.org Code block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Schema.org JSON-LD Script Tag
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied JSON-LD!' : 'Copy Script Tag'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              <code>
                {`<script type="application/ld+json">\n${formattedJsonLd}\n</script>`}
              </code>
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Schema validation active
          </span>
          <button
            onClick={() => setIsSeoInspectorOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
