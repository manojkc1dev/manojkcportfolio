import React from 'react';
import {
  GripVertical,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { checkWeakBullet } from '../../../../lib/resume/ats/weakVerbs';
import { ActionVerbSuggest } from './ActionVerbSuggest';

interface BulletEditorProps {
  bullets: string[];
  hiddenBullets?: number[];
  onChange: (bullets: string[], hiddenBullets?: number[]) => void;
  sectionType?: string;
}

export const BulletEditor: React.FC<BulletEditorProps> = ({
  bullets = [],
  hiddenBullets = [],
  onChange,
  sectionType,
}) => {
  const hiddenSet = new Set(hiddenBullets);

  const handleBulletChange = (index: number, val: string) => {
    const next = [...bullets];
    next[index] = val;
    onChange(next, hiddenBullets);
  };

  const handleAddBullet = (initialText = '') => {
    onChange([...bullets, initialText], hiddenBullets);
  };

  const handleDeleteBullet = (index: number) => {
    const nextBullets = bullets.filter((_, i) => i !== index);
    // Re-index hidden bullets
    const nextHidden: number[] = [];
    hiddenBullets.forEach((hIdx) => {
      if (hIdx < index) nextHidden.push(hIdx);
      else if (hIdx > index) nextHidden.push(hIdx - 1);
    });
    onChange(nextBullets, nextHidden);
  };

  const handleToggleHideBullet = (index: number) => {
    const nextHidden = new Set(hiddenBullets);
    if (nextHidden.has(index)) {
      nextHidden.delete(index);
    } else {
      nextHidden.add(index);
    }
    onChange(bullets, Array.from(nextHidden));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bullets.length) return;
    const next = [...bullets];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    // Swap hidden state if either was hidden
    const nextHidden = new Set(hiddenBullets);
    const isCurrentHidden = nextHidden.has(index);
    const isTargetHidden = nextHidden.has(targetIndex);

    if (isCurrentHidden) nextHidden.delete(index);
    if (isTargetHidden) nextHidden.delete(targetIndex);

    if (isCurrentHidden) nextHidden.add(targetIndex);
    if (isTargetHidden) nextHidden.add(index);

    onChange(next, Array.from(nextHidden));
  };

  const handleInsertVerb = (index: number, verb: string) => {
    const current = bullets[index] || '';
    const updated = current
      ? `${verb} ${current.replace(/^[A-Z][a-z]+(\s+on|\s+with)?\s*/, '')}`
      : `${verb} `;
    handleBulletChange(index, updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
          {sectionType === 'skills'
            ? 'Skills / Tool Categorization'
            : 'ATS Bullet Points (Action-Verb Driven)'}
        </label>
        <div className="flex items-center gap-2">
          {hiddenBullets.length > 0 && (
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
              {hiddenBullets.length} hidden from export
            </span>
          )}
          <span className="text-[11px] text-neutral-400">
            {bullets.length} {bullets.length === 1 ? 'bullet' : 'bullets'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {bullets.map((bullet, idx) => {
          const weakCheck = checkWeakBullet(bullet);
          const isTooLong = bullet.length > 200; // Over ~2 lines in 10pt print
          const isBulletHidden = hiddenSet.has(idx);

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border space-y-1.5 transition-all ${
                isBulletHidden
                  ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/60 opacity-70'
                  : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {/* Drag / reorder handles */}
                <div className="flex flex-col items-center gap-0.5 pt-1 text-neutral-400">
                  <div
                    className="cursor-grab active:cursor-grabbing p-0.5 hover:text-neutral-600 dark:hover:text-neutral-200"
                    title="Drag to reorder"
                    role="button"
                    aria-label={`Reorder bullet ${idx + 1}`}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label={`Move bullet ${idx + 1} up`}
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === bullets.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label={`Move bullet ${idx + 1} down`}
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    {isBulletHidden && (
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                        [HIDDEN IN EXPORT]
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                    placeholder={
                      sectionType === 'skills'
                        ? 'Python, Django REST Framework, PostgreSQL, Redis, Celery, Docker...'
                        : 'Architected high-throughput Django REST API processing 2.4M monthly requests...'
                    }
                    aria-label={`Bullet ${idx + 1} of ${bullets.length}`}
                    className={`w-full px-3 py-2 rounded-lg text-xs leading-relaxed border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
                      isBulletHidden
                        ? 'border-dashed border-rose-300 dark:border-rose-800 line-through opacity-70'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-1.5 pt-0.5">
                  <ActionVerbSuggest onSelectVerb={(v) => handleInsertVerb(idx, v)} />

                  {/* Hide / Unhide button */}
                  <button
                    type="button"
                    onClick={() => handleToggleHideBullet(idx)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isBulletHidden
                        ? 'text-rose-600 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                    }`}
                    aria-label={isBulletHidden ? `Unhide bullet ${idx + 1}` : `Hide bullet ${idx + 1}`}
                    title={
                      isBulletHidden
                        ? 'Bullet is hidden from exports. Click to include.'
                        : 'Click to hide bullet from exports without deleting.'
                    }
                  >
                    {isBulletHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBullet(idx)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    aria-label={`Delete bullet ${idx + 1}`}
                    title="Delete bullet permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Warning hints */}
              {!isBulletHidden && weakCheck.isWeak && (
                <div className="ml-7 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{weakCheck.reason}</span>
                </div>
              )}
              {!isBulletHidden && isTooLong && (
                <div className="ml-7 flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>
                    Bullet exceeds ~2 lines when printed. Aim to keep bullet sentences concise for optimal scanning.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Bullet Button */}
      <button
        type="button"
        onClick={() => handleAddBullet('')}
        className="w-full py-2 px-3 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add {sectionType === 'skills' ? 'Skill Category' : 'Bullet Point'}</span>
      </button>
    </div>
  );
};
