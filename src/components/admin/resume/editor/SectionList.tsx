import React from 'react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Cpu,
  FolderGit2,
  Award,
  ScrollText,
  User,
  Layers,
} from 'lucide-react';
import type { ResumeSection, SectionType } from '../../../../lib/resume/schema';
import { generateId } from '../../../../lib/resume/schema';

interface SectionListProps {
  sections: ResumeSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  onReorderSections: (sections: ResumeSection[]) => void;
  onAddSection: (type: SectionType, title: string) => void;
  onToggleVisible: (id: string) => void;
  onDeleteSection: (id: string) => void;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  header: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Cpu,
  projects: FolderGit2,
  certifications: Award,
  awards: ScrollText,
  custom: Layers,
};

export const SectionList: React.FC<SectionListProps> = ({
  sections = [],
  activeSectionId,
  onSelectSection,
  onReorderSections,
  onAddSection,
  onToggleVisible,
  onDeleteSection,
}) => {
  const [showAddMenu, setShowAddMenu] = React.useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    // Update orders
    const updated = next.map((s, idx) => ({ ...s, order: idx }));
    onReorderSections(updated);
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
          Resume Sections
        </span>
        <span className="text-[11px] text-neutral-400">
          {sections.length + 1} sections
        </span>
      </div>

      <div className="space-y-1.5" role="list">
        {/* Fixed Header Item */}
        <button
          type="button"
          onClick={() => onSelectSection('header')}
          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
            activeSectionId === 'header'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 shrink-0" />
            <span>Header &amp; Identity</span>
          </div>
          <span className="text-[10px] opacity-75">Required</span>
        </button>

        {/* Dynamic Sections */}
        {sections.map((section, idx) => {
          const IconComponent = SECTION_ICONS[section.type] || Layers;
          const isActive = activeSectionId === section.id;

          return (
            <div
              key={section.id}
              role="listitem"
              className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 transition-all ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
              }`}
            >
              {/* Drag handle & a11y up/down */}
              <div className="flex items-center gap-0.5 text-neutral-400">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Drag handle for ${section.title}`}
                  className="cursor-grab active:cursor-grabbing p-1 hover:text-neutral-600"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    aria-label={`Move ${section.title} up`}
                    className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    aria-label={`Move ${section.title} down`}
                    className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Title click */}
              <button
                type="button"
                onClick={() => onSelectSection(section.id)}
                className="flex-1 min-w-0 text-left px-1.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 truncate cursor-pointer"
              >
                <IconComponent className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{section.title}</span>
                <span className="text-[10px] text-neutral-400 font-normal">
                  ({(section.entries || []).length})
                </span>
              </button>

              {/* Actions: visibility & delete */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleVisible(section.id)}
                  aria-label={section.visible ? `Hide ${section.title}` : `Show ${section.title}`}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    section.visible
                      ? 'text-neutral-400 hover:text-neutral-600'
                      : 'text-amber-500 hover:text-amber-600'
                  }`}
                  title={section.visible ? 'Visible' : 'Hidden'}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {section.type === 'custom' && (
                  <button
                    type="button"
                    onClick={() => onDeleteSection(section.id)}
                    aria-label={`Delete section ${section.title}`}
                    className="p-1 rounded-md text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section Button & Menu */}
      <div className="relative pt-2">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-2 px-3 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>

        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
            <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-50 text-xs space-y-1">
              {[
                { type: 'experience', label: 'Experience Section', icon: Briefcase },
                { type: 'skills', label: 'Skills Section', icon: Cpu },
                { type: 'projects', label: 'Projects Section', icon: FolderGit2 },
                { type: 'education', label: 'Education Section', icon: GraduationCap },
                { type: 'certifications', label: 'Certifications', icon: Award },
                { type: 'awards', label: 'Honors & Awards', icon: ScrollText },
                { type: 'custom', label: 'Custom Section', icon: Layers },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    onAddSection(opt.type as SectionType, opt.label.replace(' Section', ''));
                    setShowAddMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <opt.icon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
