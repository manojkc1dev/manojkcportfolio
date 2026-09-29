export interface ActionVerbCategory {
  category: string;
  verbs: string[];
}

export const ACTION_VERB_CATEGORIES: ActionVerbCategory[] = [
  {
    category: 'Leadership & Architecture',
    verbs: [
      'Architected',
      'Spearheaded',
      'Orchestrated',
      'Pioneered',
      'Directed',
      'Championed',
      'Led',
      'Engineered',
      'Mentored',
      'Formulated',
      'Established',
      'Standardized',
    ],
  },
  {
    category: 'Building & Implementation',
    verbs: [
      'Built',
      'Developed',
      'Implemented',
      'Designed',
      'Constructed',
      'Programmed',
      'Created',
      'Crafted',
      'Configured',
      'Integrated',
      'Deployed',
      'Authored',
    ],
  },
  {
    category: 'Optimization & Scaling',
    verbs: [
      'Optimized',
      'Accelerated',
      'Streamlined',
      'Scaled',
      'Automated',
      'Refactored',
      'Reduced',
      'Boosted',
      'Enhanced',
      'Maximized',
      'Mitigated',
      'Eliminated',
    ],
  },
  {
    category: 'Execution & Delivery',
    verbs: [
      'Shipped',
      'Delivered',
      'Launched',
      'Published',
      'Executed',
      'Produced',
      'Maintained',
      'Resolved',
      'Troubleshot',
      'Migrated',
      'Modernized',
      'Secured',
    ],
  },
  {
    category: 'Analysis & Quality',
    verbs: [
      'Analyzed',
      'Benchmarked',
      'Audited',
      'Evaluated',
      'Validated',
      'Monitored',
      'Diagnosed',
      'Tested',
      'Modeled',
      'Documented',
      'Quantified',
    ],
  },
];

export const ALL_ACTION_VERBS: string[] = Array.from(
  new Set(ACTION_VERB_CATEGORIES.flatMap((c) => c.verbs))
);

export function isActionVerb(word: string): boolean {
  if (!word) return false;
  const clean = word.trim().replace(/[^a-zA-Z]/g, '').toLowerCase();
  return ALL_ACTION_VERBS.some((v) => v.toLowerCase() === clean);
}

export function getVerbSuggestions(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_ACTION_VERBS.slice(0, limit);
  return ALL_ACTION_VERBS.filter((v) => v.toLowerCase().startsWith(q)).slice(0, limit);
}
