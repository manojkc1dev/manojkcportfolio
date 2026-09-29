import React from 'react';
import { Plus, ListFilter, Eye, EyeOff } from 'lucide-react';
import type { ResumeSection, ResumeEntry } from '../../../../lib/resume/schema';
import { generateId } from '../../../../lib/resume/schema';
import { EntryEditor } from './EntryEditor';

interface SectionEditorProps {
  section: ResumeSection;
  onChange: (section: ResumeSection) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ section, onChange }) => {
  const handleTitleChange = (val: string) => {
    onChange({
      ...section,
      title: val,
    });
  };

  const handleToggleVisible = () => {
    onChange({
      ...section,
      visible: !section.visible,
    });
  };

  const handleAddEntry = () => {
    const newEntry: ResumeEntry = {
      id: generateId('entry'),
      title: section.type === 'skills' ? 'Core Technologies' : 'New Role / Position',
      organization: section.type === 'skills' ? '' : 'Company / Organization',
      startDate: '2023-01',
      endDate: 'present',
      bullets: [
        section.type === 'skills'
          ? 'Python, Django, PostgreSQL, Redis'
          : 'Architected and deployed production backend services with 99.9% uptime.',
      ],
      visible: true,
    };

    onChange({
      ...section,
      entries: [newEntry, ...(section.entries || [])],
    });
  };

  const handleEntryChange = (index: number, updatedEntry: ResumeEntry) => {
    const updatedEntries = [...section.entries];
    updatedEntries[index] = updatedEntry;
    onChange({
      ...section,
      entries: updatedEntries,
    });
  };

  const handleEntryDelete = (index: number) => {
    const updatedEntries = section.entries.filter((_, i) => i !== index);
    onChange({
      ...section,
      entries: updatedEntries,
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
      {/* Section Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex-1 min-w-0">
          <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Section Display Title
          </label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full max-w-sm px-3 py-1.5 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVisible}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              section.visible
                ? 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
          >
            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{section.visible ? 'Section Visible' : 'Section Hidden'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddEntry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {(section.entries || []).length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <ListFilter className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              No entries in this section yet.
            </p>
            <button
              type="button"
              onClick={handleAddEntry}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create first entry</span>
            </button>
          </div>
        ) : (
          section.entries.map((entry, idx) => (
            <EntryEditor
              key={entry.id || idx}
              entry={entry}
              sectionType={section.type}
              onChange={(updated) => handleEntryChange(idx, updated)}
              onDelete={() => handleEntryDelete(idx)}
            />
          ))
        )}
      </div>
    </div>
  );
};
