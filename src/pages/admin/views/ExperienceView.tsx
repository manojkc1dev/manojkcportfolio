import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Save,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { Experience } from '../../../types';

interface ExperienceViewProps {
  experience: Experience[];
  onUpdateExperience: (items: Experience[]) => void;
  onShowToast: (message: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  experience,
  onUpdateExperience,
  onShowToast,
}) => {
  const [items, setItems] = useState<Experience[]>(experience);
  const [editingIndex, setEditingIndex] = useState<number | null>(0);

  const handleSave = () => {
    onUpdateExperience(items);
    try {
      localStorage.setItem('portfolio_experience', JSON.stringify(items));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    onShowToast('Experience & Education timeline updated successfully.');
  };

  const handleUpdateField = (index: number, field: keyof Experience, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddBullet = (index: number) => {
    const updated = [...items];
    updated[index].bullets = [...updated[index].bullets, 'New achievement or responsibility...'];
    setItems(updated);
  };

  const handleUpdateBullet = (itemIndex: number, bulletIndex: number, text: string) => {
    const updated = [...items];
    updated[itemIndex].bullets[bulletIndex] = text;
    setItems(updated);
  };

  const handleRemoveBullet = (itemIndex: number, bulletIndex: number) => {
    const updated = [...items];
    updated[itemIndex].bullets = updated[itemIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    setItems(updated);
  };

  const handleAddNewItem = () => {
    const newItem: Experience = {
      id: `exp-${Date.now()}`,
      role: 'Backend Developer',
      company: 'Company / Organization Name',
      period: '2026 - Present',
      location: 'Kathmandu, Nepal (Remote / On-site)',
      type: 'Full-time / Traineeship',
      description: 'Core backend engineering responsibilities and system architecture.',
      bullets: [
        'Engineered scalable REST APIs with Django REST Framework and PostgreSQL.',
        'Optimized database queries and API response times.',
      ],
      tech: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    };
    const updated = [newItem, ...items];
    setItems(updated);
    setEditingIndex(0);
    onShowToast('New timeline milestone added.');
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      alert('At least one experience or education item must be kept.');
      return;
    }
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    setEditingIndex(0);
    onShowToast('Timeline milestone removed.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Experience &amp; Education Timeline</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your career history, traineeships, academic degrees, and core technical achievements shown on the portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNewItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Timeline</span>
          </button>
        </div>
      </div>

      {/* Timeline Items List & Active Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timeline List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold px-1">
            Timeline Milestones ({items.length})
          </div>

          {items.map((item, idx) => {
            const isEducation = item.type.toLowerCase().includes('education') || item.id.includes('university');
            const isActive = editingIndex === idx;

            return (
              <div
                key={item.id}
                onClick={() => setEditingIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isEducation ? (
                      <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                      {item.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                    {item.period}
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                  {item.company}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Item Editor */}
        {editingIndex !== null && items[editingIndex] && (
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Edit Milestone: {items[editingIndex].role}
              </h2>

              <button
                type="button"
                onClick={() => handleDeleteItem(editingIndex)}
                className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 transition-colors p-1"
                title="Delete milestone"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Role / Degree Title
                </label>
                <input
                  type="text"
                  value={items[editingIndex].role}
                  onChange={(e) => handleUpdateField(editingIndex, 'role', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Organization / University
                </label>
                <input
                  type="text"
                  value={items[editingIndex].company}
                  onChange={(e) => handleUpdateField(editingIndex, 'company', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Time Period (e.g., Feb 2026 - Jul 2026)
                </label>
                <input
                  type="text"
                  value={items[editingIndex].period}
                  onChange={(e) => handleUpdateField(editingIndex, 'period', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Location (e.g., Kathmandu, Nepal)
                </label>
                <input
                  type="text"
                  value={items[editingIndex].location}
                  onChange={(e) => handleUpdateField(editingIndex, 'location', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Summary / Core Focus
                </label>
                <textarea
                  rows={2}
                  value={items[editingIndex].description}
                  onChange={(e) => handleUpdateField(editingIndex, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={items[editingIndex].tech.join(', ')}
                  onChange={(e) =>
                    handleUpdateField(
                      editingIndex,
                      'tech',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bullets List */}
            <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Key Accomplishments / Responsibilities
                </label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(editingIndex)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  + Add Bullet Point
                </button>
              </div>

              {items[editingIndex].bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-2" />
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(editingIndex, bIdx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(editingIndex, bIdx)}
                    className="text-neutral-400 hover:text-rose-500 p-1.5 transition-colors mt-1"
                    title="Remove bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
