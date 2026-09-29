import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Building,
  MapPin,
  Tag,
} from 'lucide-react';
import type { ResumeEntry } from '../../../../lib/resume/schema';
import { BulletEditor } from './BulletEditor';

interface EntryEditorProps {
  entry: ResumeEntry;
  sectionType: string;
  onChange: (entry: ResumeEntry) => void;
  onDelete: () => void;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({
  entry,
  sectionType,
  onChange,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFieldChange = (field: keyof ResumeEntry, val: any) => {
    onChange({
      ...entry,
      [field]: val,
    });
  };

  const isSkills = sectionType === 'skills';

  return (
    <div
      className={`rounded-xl border shadow-2xs overflow-hidden transition-all ${
        entry.visible === false
          ? 'border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
      }`}
    >
      {/* Header bar */}
      <div className="px-3.5 py-2.5 bg-neutral-50/70 dark:bg-neutral-800/40 flex items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 flex items-center gap-2 text-left cursor-pointer"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold truncate block ${
                  entry.visible === false
                    ? 'text-neutral-500 line-through'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {entry.title || 'Untitled Entry'}
              </span>
              {entry.visible === false && (
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                  [HIDDEN]
                </span>
              )}
            </div>
            {entry.organization && (
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate block">
                {entry.organization} {entry.startDate ? `• ${entry.startDate}` : ''}
              </span>
            )}
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Visibility toggle */}
          <button
            type="button"
            onClick={() => handleFieldChange('visible', !entry.visible)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              entry.visible
                ? 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                : 'text-rose-600 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200'
            }`}
            title={entry.visible ? 'Visible in export. Click to hide.' : 'Hidden from export. Click to show.'}
            aria-label={entry.visible ? 'Hide entry' : 'Show entry'}
          >
            {entry.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Delete inline confirm */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onDelete}
                className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-1.5 py-0.5 text-[10px] text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete entry"
              aria-label="Delete entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="p-3.5 sm:p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isSkills ? 'Category Name *' : 'Job Title / Degree / Project Name *'}
              </label>
              <input
                type="text"
                required
                value={entry.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder={isSkills ? 'Backend & Frameworks' : 'Backend Software Engineer'}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {!isSkills && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Company / Organization / School
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={entry.organization || ''}
                    onChange={(e) => handleFieldChange('organization', e.target.value)}
                    placeholder="LightCode Technologies"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {!isSkills && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Location (City, Country or Remote)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    placeholder="Kathmandu, Nepal"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {!isSkills && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Start (YYYY-MM)
                  </label>
                  <div className="relative">
                    <Calendar className="w-3 h-3 absolute left-2.5 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={entry.startDate || ''}
                      onChange={(e) => handleFieldChange('startDate', e.target.value)}
                      placeholder="2023-08"
                      className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    End (YYYY-MM or present)
                  </label>
                  <div className="relative">
                    <Calendar className="w-3 h-3 absolute left-2.5 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={entry.endDate || ''}
                      onChange={(e) => handleFieldChange('endDate', e.target.value)}
                      placeholder="present"
                      className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags for skills / tech stack matching */}
          {!isSkills && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-neutral-400" />
                <span>Tech Stack Keywords (comma separated)</span>
              </label>
              <input
                type="text"
                value={(entry.tags || []).join(', ')}
                onChange={(e) =>
                  handleFieldChange(
                    'tags',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder="Python, Django, PostgreSQL, Redis, Celery, Docker..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Bullet points editor */}
          <BulletEditor
            bullets={entry.bullets || []}
            hiddenBullets={entry.hiddenBullets || []}
            onChange={(b, hb) => {
              onChange({
                ...entry,
                bullets: b,
                hiddenBullets: hb !== undefined ? hb : entry.hiddenBullets,
              });
            }}
            sectionType={sectionType}
          />
        </div>
      )}
    </div>
  );
};
