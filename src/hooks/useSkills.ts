/**
 * useSkills — Django API-backed skills hook with static fallback.
 *
 * Calls GET /api/v1/skills/ via canonical client.
 * On success, the Django response becomes the authoritative source.
 * On any API failure or empty response, falls back gracefully to src/data/skills.ts.
 *
 * Rules:
 * - Never exposes raw API errors to visitors.
 * - Cancels the in-flight request on unmount via AbortController.
 * - Avoids localStorage on the public read path.
 */

import { useState, useEffect } from 'react';
import { getSkills } from '../lib/api';
import { skillGroups as staticSkillGroups, currentFocus as staticFocus } from '../data/skills';
import type { SkillGroup, SkillItem, SkillCategory, SkillLevel } from '../types';

export interface UseSkillsResult {
  /** Resolved skill groups — falls back to static skillGroups if API is empty/fails. */
  data: SkillGroup[];
  /** Current focus skill items. */
  focus: SkillItem[];
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /** Dev-mode only error; not exposed to visitors. */
  apiError: Error | null;
}

export function normalizeSkillLevel(skill: SkillItem): SkillLevel {
  if (skill.level) return skill.level;
  if (skill.proficiency) {
    const p = skill.proficiency.toLowerCase();
    if (p.includes('expert')) return 'expert';
    if (p.includes('adv')) return 'advanced';
    if (p.includes('int')) return 'intermediate';
    if (p.includes('learn')) return 'learning';
  }
  return 'intermediate';
}

export function normalizeApiSkillGroups(categories: SkillCategory[]): SkillGroup[] {
  return categories.map((cat, idx) => ({
    id: cat.id ? String(cat.id) : `category-${idx}`,
    title: cat.title || cat.category || 'Competencies',
    category: cat.category || cat.title || 'Competencies',
    description: cat.description || '',
    skills: Array.isArray(cat.skills)
      ? cat.skills.map((s) => ({
          name: s.name,
          iconName: s.iconName,
          highlight: Boolean(s.highlight),
          proficiency:
            s.proficiency ||
            (s.level
              ? ((s.level.charAt(0).toUpperCase() + s.level.slice(1)) as
                  | 'Advanced'
                  | 'Intermediate'
                  | 'Learning')
              : 'Intermediate'),
          level: normalizeSkillLevel(s),
          years: s.years ?? 2,
        }))
      : [],
  }));
}

export function useSkills(refreshKey?: number): UseSkillsResult {
  const [data, setData] = useState<SkillGroup[]>(staticSkillGroups);
  const [focus] = useState<SkillItem[]>(staticFocus);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    setLoading(true);

    getSkills({ signal: controller.signal })
      .then((apiCategories) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          setData(normalizeApiSkillGroups(apiCategories));
          setApiError(null);
        } else {
          setData(staticSkillGroups);
        }
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('[useSkills] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        setData(staticSkillGroups);
      })
      .finally(() => {
        if (!isCancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [refreshKey]);

  return { data, focus, loading, apiError };
}
