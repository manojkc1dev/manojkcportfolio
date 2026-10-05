/**
 * useProject — Django API-backed single project hook with static fallback.
 *
 * Calls GET /api/v1/projects/<slug>/ for the detailed project record.
 * On success, Django is authoritative.
 * On failure, falls back to finding the project in the static data.
 *
 * Rules:
 * - Never exposes API errors to visitors.
 * - Returns `null` when not found in either source (triggers 404 UI).
 * - Cancels the in-flight request on unmount via AbortController.
 */

import { useState, useEffect } from 'react';
import { getProject } from '../lib/api';
import { projects as staticProjects } from '../data/projects';
import type { Project } from '../types';

export interface UseProjectResult {
  /** Resolved project, or null if not found in any source. */
  data: Project | null;
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /**
   * Non-null when the API call failed and we served static fallback.
   * Dev-mode logging only; never shown to visitors.
   */
  apiError: Error | null;
}

export function useProject(slug: string | undefined): UseProjectResult {
  // Seed state: try to resolve from static data immediately for instant render.
  const staticMatch = slug ? staticProjects.find((p) => p.id === slug) ?? null : null;
  const [data, setData] = useState<Project | null>(staticMatch);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    const staticFallback = staticProjects.find((p) => p.id === slug) ?? null;
    setData(staticFallback);
    setLoading(true);

    const controller = new AbortController();

    getProject(slug, { signal: controller.signal })
      .then((apiProject) => {
        if (controller.signal.aborted) return;
        setData(apiProject);
        setApiError(null);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn(`[useProject] API unavailable for "${slug}" — using static fallback:`, err.message);
        }
        setApiError(err);
        setData(staticFallback);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [slug]);

  return { data, loading, apiError };
}
