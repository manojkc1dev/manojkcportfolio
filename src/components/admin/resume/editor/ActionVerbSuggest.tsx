import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check } from 'lucide-react';
import { ACTION_VERB_CATEGORIES, getVerbSuggestions } from '../../../../lib/resume/ats/actionVerbs';

interface ActionVerbSuggestProps {
  onSelectVerb: (verb: string) => void;
}

export const ActionVerbSuggest: React.FC<ActionVerbSuggestProps> = ({ onSelectVerb }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ACTION_VERB_CATEGORIES[0].category);
  const [search, setSearch] = useState('');

  const currentCategory = ACTION_VERB_CATEGORIES.find((c) => c.category === activeCategory) || ACTION_VERB_CATEGORIES[0];
  const filteredVerbs = search ? getVerbSuggestions(search, 16) : currentCategory.verbs;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors cursor-pointer"
        aria-label="Suggested ATS action verbs"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Action Verbs</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-72 sm:w-80 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl p-3 z-50 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 mb-2">
              <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>ATS Action Verbs</span>
              </span>
              <span className="text-[10px] text-neutral-400">Click to insert</span>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search verbs (e.g. arch, opt)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Category tabs */}
            {!search && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {ACTION_VERB_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setActiveCategory(cat.category)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                      activeCategory === cat.category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.category.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            {/* Verbs grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredVerbs.map((verb) => (
                <button
                  key={verb}
                  type="button"
                  onClick={() => {
                    onSelectVerb(verb);
                    setOpen(false);
                  }}
                  className="px-2 py-1 rounded text-left text-neutral-800 dark:text-neutral-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
