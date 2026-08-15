import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Save, Sparkles, CheckCircle2, Image, Link, Plus, Trash2 } from 'lucide-react';

export const HeroEditor: React.FC = () => {
  const { hero, updateHero } = useCMS();
  const [formData, setFormData] = useState({ ...hero });
  const [typingInput, setTypingInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddTypingText = () => {
    if (!typingInput.trim()) return;
    setFormData({
      ...formData,
      typingTexts: [...formData.typingTexts, typingInput.trim()]
    });
    setTypingInput('');
  };

  const handleRemoveTypingText = (index: number) => {
    setFormData({
      ...formData,
      typingTexts: formData.typingTexts.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Hero Section CMS</h2>
          <p className="text-xs text-slate-500">Edit homepage hero headline, availability badge, profile photo, and typing animation phrases.</p>
        </div>
        
        {saved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Hero updated live!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Title / Role</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Availability Badge Text</label>
          <input
            type="text"
            value={formData.availabilityBadge}
            onChange={(e) => setFormData({ ...formData, availabilityBadge: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtitle</label>
          <textarea
            rows={2}
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Hero Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Typing Phrases Manager */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Dynamic Typing Animation Phrases
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Django 5 REST Specialist"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTypingText}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Phrase
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.typingTexts.map((text, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center gap-2">
                {text}
                <button type="button" onClick={() => handleRemoveTypingText(idx)} className="text-rose-500 hover:text-rose-700">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Profile Image URL */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Profile Image URL</label>
          <input
            type="text"
            value={formData.profileImage}
            onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">GitHub URL</label>
            <input
              type="text"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn URL</label>
            <input
              type="text"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Hero Section
        </button>

      </form>
    </div>
  );
};
