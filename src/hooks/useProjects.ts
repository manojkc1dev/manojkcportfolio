/**
 * useProjects — Django API-backed projects list hook with static fallback.
 *
 * Calls GET /api/v1/projects/ (optionally with category/featured filters).
 * On success, Django becomes the authoritative source.
 * On any failure, falls back silently to static src/data/projects.ts.
 *
 * Rules:
 * - Never exposes API errors to visitors.
 * - Cancels the in-flight request on unmount via AbortController.
 * - Params are stable-stringified to avoid re-fetching on every render.
 */

import { useState, useEffect, useRef } from 'react';
import { getProjects } from '../lib/api';
import type { ProjectFilterParams } from '../lib/api/public';
import { projects as staticProjects } from '../data/projects';
import type { Project } from '../types';

export interface UseProjectsResult {
  /** Resolved projects — always non-empty (falls back to static on error). */
  data: Project[];
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /**
   * Non-null when the API call failed and we are serving static fallback.
   * Never surfaced to visitors; available for dev-mode logging only.
   */
  apiError: Error | null;
}

export function useProjects(params?: ProjectFilterParams): UseProjectsResult {
  const [data, setData] = useState<Project[]>(staticProjects);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  // Stringify params for stable dependency comparison
  const paramsKey = params ? JSON.stringify(params) : '';
  const paramsKeyRef = useRef(paramsKey);
  paramsKeyRef.current = paramsKey;

  useEffect(() => {
    const controller = new AbortController();

    getProjects(params, { signal: controller.signal })
      .then((apiProjects) => {
        if (controller.signal.aborted) return;
        // API returns projects — use them if non-empty, else keep static
        if (Array.isArray(apiProjects) && apiProjects.length > 0) {
          setData(apiProjects);
          setApiError(null);
        }
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('[useProjects] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        // data remains staticProjects — no visible degradation
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { data, loading, apiError };
}
