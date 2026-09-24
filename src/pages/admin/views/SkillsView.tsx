import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Check,
  Save,
  RotateCcw,
  Zap,
  Terminal,
  Database,
  ShieldCheck,
  CreditCard,
  Cpu,
} from 'lucide-react';
import type { SkillCategory, SkillItem } from '../../../types';

interface SkillsViewProps {
  skills: SkillCategory[];
  currentFocus: SkillItem[];
  onUpdateSkills: (skills: SkillCategory[]) => void;
  onUpdateCurrentFocus: (focus: SkillItem[]) => void;
  onShowToast: (message: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  skills,
  currentFocus,
  onUpdateSkills,
  onUpdateCurrentFocus,
  onShowToast,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [localSkills, setLocalSkills] = useState<SkillCategory[]>(skills);
  const [localFocus, setLocalFocus] = useState<SkillItem[]>(currentFocus);
  const [newFocusName, setNewFocusName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Advanced' | 'Intermediate' | 'Learning'>('Intermediate');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  const handleSaveAll = () => {
    onUpdateSkills(localSkills);
    onUpdateCurrentFocus(localFocus);
    try {
      localStorage.setItem('portfolio_skills', JSON.stringify(localSkills));
      localStorage.setItem('portfolio_current_focus', JSON.stringify(localFocus));
      window.dispatchEvent(new Event('portfolio_data_updated'));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    onShowToast('Skills & Technical Stack updated successfully.');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;
    const newCat: SkillCategory = {
      category: newCategoryTitle.trim(),
      description: newCategoryDesc.trim() || 'Core competencies and tooling.',
      skills: [],
    };
    const updated = [...localSkills, newCat];
    setLocalSkills(updated);
    setActiveCategoryIndex(updated.length - 1);
    setNewCategoryTitle('');
    setNewCategoryDesc('');
    setShowAddCategory(false);
    onShowToast(`Created category "${newCat.category}". Remember to save.`);
  };

  const handleDeleteCategory = (catIdx: number) => {
    if (localSkills.length <= 1) {
      alert('At least one skill category must remain.');
      return;
    }
    const catName = localSkills[catIdx]?.category;
    if (confirm(`Are you sure you want to delete the "${catName}" category and all its skills?`)) {
      const updated = localSkills.filter((_, idx) => idx !== catIdx);
      setLocalSkills(updated);
      setActiveCategoryIndex(0);
      onShowToast(`Category "${catName}" removed. Click "Save Changes" to publish.`);
    }
  };

  const handleUpdateCategoryMeta = (field: 'category' | 'description', value: string) => {
    const updated = [...localSkills];
    if (updated[activeCategoryIndex]) {
      updated[activeCategoryIndex] = {
        ...updated[activeCategoryIndex],
        [field]: value,
      };
      setLocalSkills(updated);
    }
  };

  const handleAddFocus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFocusName.trim()) return;
    const newItem: SkillItem = {
      name: newFocusName.trim(),
      iconName: 'Sparkles',
      proficiency: 'Learning',
      highlight: true,
    };
    const updated = [...localFocus, newItem];
    setLocalFocus(updated);
    setNewFocusName('');
    onShowToast(`Added "${newItem.name}" to Current Learning Focus.`);
  };

  const handleRemoveFocus = (index: number) => {
    const updated = localFocus.filter((_, idx) => idx !== index);
    setLocalFocus(updated);
  };

  const handleAddSkillToCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const updated = [...localSkills];
    const category = updated[activeCategoryIndex];
    if (category) {
      category.skills.push({
        name: newSkillName.trim(),
        iconName: 'Cpu',
        proficiency: newSkillProficiency,
        highlight: newSkillProficiency === 'Advanced',
      });
      setLocalSkills(updated);
      setNewSkillName('');
      onShowToast(`Added "${newSkillName}" to ${category.category}.`);
    }
  };

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...localSkills];
    updated[categoryIndex].skills = updated[categoryIndex].skills.filter((_, idx) => idx !== skillIndex);
    setLocalSkills(updated);
  };

  const handleToggleHighlight = (categoryIndex: number, skillIndex: number) => {
    const updated = [...localSkills];
    const skill = updated[categoryIndex].skills[skillIndex];
    skill.highlight = !skill.highlight;
    setLocalSkills(updated);
  };

  const currentCategory = localSkills[activeCategoryIndex] || localSkills[0];

  return (
    <div className="space-y-8">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Skills &amp; Technical Stack</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Directly manage technical domains, proficiency levels, and current learning focus displayed on the portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Stack Changes</span>
          </button>
        </div>
      </div>

      {/* 1. CURRENT FOCUS SECTION */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Current Learning &amp; Engineering Focus</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Technologies you are actively deepening (displayed at the top of the frontend Skills section).
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {localFocus.length} Active Items
          </span>
        </div>

        {/* Focus items chips */}
        <div className="flex flex-wrap gap-2">
          {localFocus.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFocus(idx)}
                className="text-neutral-400 hover:text-rose-500 transition-colors p-0.5"
                title="Remove focus item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add focus item form */}
        <form onSubmit={handleAddFocus} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add new focus technology (e.g., Celery, Redis, Kubernetes)..."
            value={newFocusName}
            onChange={(e) => setNewFocusName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Focus</span>
          </button>
        </form>
      </div>

      {/* 2. CATEGORIZED SKILLS SECTION */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Categorized Technical Competencies
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Select a category to view and edit skills, update proficiency, or add new capabilities.
          </p>
        </div>

        {/* Category Tabs & Add Category Button */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          {localSkills.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveCategoryIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeCategoryIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.category} ({cat.skills.length})
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200/80 dark:border-indigo-800 cursor-pointer ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add Category Collapsible Form */}
        {showAddCategory && (
          <form
            onSubmit={handleCreateCategory}
            className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                New Skill Category
              </span>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud & Infrastructure"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. CI/CD pipelines, container orchestration, and serverless."
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Create Category
              </button>
            </div>
          </form>
        )}

        {/* Active Category Editor Bar */}
        {currentCategory && (
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={currentCategory.category}
                  onChange={(e) => handleUpdateCategoryMeta('category', e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  title="Edit category title"
                />
                <input
                  type="text"
                  value={currentCategory.description}
                  onChange={(e) => handleUpdateCategoryMeta('description', e.target.value)}
                  placeholder="Category description..."
                  className="flex-1 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  title="Edit category description"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCategory(activeCategoryIndex)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                title="Delete this category"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        {currentCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentCategory.skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {skill.name}
                    </span>
                    {skill.highlight && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Top
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    Proficiency: {skill.proficiency || 'Intermediate'}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleHighlight(activeCategoryIndex, sIdx)}
                    title={skill.highlight ? 'Remove badge' : 'Highlight as top skill'}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      skill.highlight
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(activeCategoryIndex, sIdx)}
                    title="Remove skill"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Skill to Category Form */}
        <form onSubmit={handleAddSkillToCategory} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <input
            type="text"
            placeholder={`Add new skill to ${currentCategory?.category || 'category'}...`}
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={newSkillProficiency}
            onChange={(e) => setNewSkillProficiency(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="Advanced">Advanced</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Learning">Learning</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>
      </div>
    </div>
  );
};
