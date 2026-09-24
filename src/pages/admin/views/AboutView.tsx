import React, { useState } from 'react';
import {
  User,
  Save,
  CheckCircle2,
  FileText,
  Activity,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Profile } from '../../../types';

interface AboutViewProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
  onShowToast: (message: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<Profile>(profile);

  const handleSave = () => {
    onUpdateProfile(formData);
    try {
      localStorage.setItem('portfolio_profile', JSON.stringify(formData));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    onShowToast('About Me & Profile information saved successfully.');
  };

  const handleBioChange = (index: number, text: string) => {
    const updatedBio = [...formData.bio];
    updatedBio[index] = text;
    setFormData({ ...formData, bio: updatedBio });
  };

  const handleAddBioParagraph = () => {
    setFormData({ ...formData, bio: [...formData.bio, 'New bio paragraph text...'] });
  };

  const handleRemoveBioParagraph = (index: number) => {
    if (formData.bio.length <= 1) return;
    const updatedBio = formData.bio.filter((_, idx) => idx !== index);
    setFormData({ ...formData, bio: updatedBio });
  };

  const handleStatChange = (index: number, field: 'value' | 'label' | 'subtext', value: string) => {
    const updatedStats = [...formData.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setFormData({ ...formData, stats: updatedStats });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>About Me &amp; Profile Bio</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your headline, introduction story, availability status, key performance metrics, and resume link.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
          Personal Identity &amp; Headline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Hero Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Availability Status Badge
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Resume Link (PDF)
            </label>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Paragraphs */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              About Me Narrative &amp; Story
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              These paragraphs appear in the &quot;About Me&quot; section on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBioParagraph}
            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.bio.map((para, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs font-mono text-neutral-400 mt-2 shrink-0">#{idx + 1}</span>
              <textarea
                rows={3}
                value={para}
                onChange={(e) => handleBioChange(idx, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.bio.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBioParagraph(idx)}
                  className="text-neutral-400 hover:text-rose-500 p-1.5 transition-colors mt-1"
                  title="Remove paragraph"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Portfolio Metrics */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Key Performance &amp; Track Record Metrics</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            The 4 quantitative highlights featured in the About section.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formData.stats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Metric #{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-0.5">Stat Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-0.5">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 mb-0.5">Subtext</label>
                <input
                  type="text"
                  value={stat.subtext || ''}
                  onChange={(e) => handleStatChange(idx, 'subtext', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
