import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  BarChart3,
  Compass,
  PhoneCall,
  Check,
} from 'lucide-react';
import type { AdminSiteContent } from '../types';

interface ContentEditorViewProps {
  content: AdminSiteContent;
  onSaveContent: (content: AdminSiteContent) => void;
  onShowToast: (message: string) => void;
}

export const ContentEditorView: React.FC<ContentEditorViewProps> = ({
  content,
  onSaveContent,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<AdminSiteContent>(content);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'pillars' | 'contact'>('hero');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    onShowToast('Site content and CMS configuration saved successfully.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Site Content & Architecture CMS
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Live editing of hero typography, engineering philosophy, company stats, and direct contact details.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero & CTA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Value Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pillars'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Engineering Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Global Contact Channels</span>
        </button>
      </div>

      {/* Tab: Hero */}
      {activeTab === 'hero' && (
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Hero Section & Primary Call to Action
            </h2>
            <p className="text-[11px] text-neutral-500">
              Configure homepage above-the-fold narrative, badges, and primary contact triggers.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Pre-Title Headline Badge
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Sub-Headline Narrative
              </label>
              <textarea
                rows={3}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.primaryCta}
                  onChange={(e) => setFormData({ ...formData, primaryCta: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.secondaryCta}
                  onChange={(e) => setFormData({ ...formData, secondaryCta: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Value Proposition & Performance Metrics
            </h2>
            <p className="text-[11px] text-neutral-500">
              Update quantitative proof points displayed across the home banner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2.5"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Metric #{idx + 1}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[idx].value = e.target.value;
                        setFormData({ ...formData, stats: updated });
                      }}
                      className="w-full px-2.5 py-1.5 font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[idx].label = e.target.value;
                        setFormData({ ...formData, stats: updated });
                      }}
                      className="w-full px-2.5 py-1.5 font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Supporting Description
                  </label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => {
                      const updated = [...formData.stats];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, stats: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pillars */}
      {activeTab === 'pillars' && (
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Engineering Philosophy Pillars
            </h2>
            <p className="text-[11px] text-neutral-500">
              The four foundational engineering doctrines that define Manoj Khatri's delivery ethos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Pillar #{idx + 1}
                  </span>
                  <input
                    type="text"
                    placeholder="Focus tag (e.g. Speed, Reliability)"
                    value={pillar.focus}
                    onChange={(e) => {
                      const updated = [...formData.pillars];
                      updated[idx].focus = e.target.value;
                      setFormData({ ...formData, pillars: updated });
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 w-28 text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Pillar Title
                  </label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...formData.pillars];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, pillars: updated });
                    }}
                    className="w-full px-2.5 py-1.5 font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Detailed Statement
                  </label>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...formData.pillars];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, pillars: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Contact */}
      {activeTab === 'contact' && (
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Global Contact & Communication Channels
            </h2>
            <p className="text-[11px] text-neutral-500">
              Coordinates, direct lines, and organizational social handles across all site footers and modals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Engineering Office Location
              </label>
              <input
                type="text"
                value={formData.contactLocation}
                onChange={(e) => setFormData({ ...formData, contactLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Inquiries Email Address
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Client Direct Phone Number
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                WhatsApp Business Direct Link
              </label>
              <input
                type="text"
                value={formData.whatsappLink}
                onChange={(e) => setFormData({ ...formData, whatsappLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                GitHub Organization Profile
              </label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                LinkedIn Corporate Profile
              </label>
              <input
                type="url"
                value={formData.linkedinLink}
                onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating or Footer Save Action */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>All CMS updates take effect across client views immediately.</span>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>
    </form>
  );
};
