/**
 * useExperience — Django API-backed experience list hook with static fallback.
 *
 * Calls GET /api/v1/experience/ (optionally with type filter) via canonical client.
 * On success, the Django response becomes the authoritative source.
 * On any API failure or empty response, falls back gracefully to src/data/experience.ts.
 *
 * Rules:
 * - Never exposes raw API errors to visitors.
 * - Cancels the in-flight request on unmount via AbortController.
 * - Avoids localStorage on the public read path.
 * - Params are stable-stringified to avoid redundant fetch cycles on re-renders.
 */

import { useState, useEffect } from 'react';
import { getExperience } from '../lib/api';
import type { ExperienceFilterParams } from '../lib/api/public';
import { experiences as staticExperiences } from '../data/experience';
import type { Experience } from '../types';

export interface UseExperienceResult {
  /** Resolved experiences list — falls back to static experiences if API is empty/fails. */
  data: Experience[];
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /** Dev-mode only error; not exposed to visitors. */
  apiError: Error | null;
}

export function useExperience(
  params?: ExperienceFilterParams,
  refreshKey?: number
): UseExperienceResult {
  const [data, setData] = useState<Experience[]>(staticExperiences);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  const paramsKey = params ? JSON.stringify(params) : '';

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    setLoading(true);

    getExperience(params, { signal: controller.signal })
      .then((apiExperiences) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiExperiences) && apiExperiences.length > 0) {
          setData(apiExperiences);
          setApiError(null);
        } else {
          setData(staticExperiences);
        }
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('[useExperience] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        setData(staticExperiences);
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
  }, [paramsKey, refreshKey]);

  return { data, loading, apiError };
}
