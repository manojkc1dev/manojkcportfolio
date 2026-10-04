/**
 * useUses — Django API-backed workstation setup hook with static fallback.
 *
 * Calls GET /api/v1/uses/ via the canonical API client.
 * On success, the Django response becomes the authoritative source.
 * On any API failure (network, 5xx, empty), the static data from
 * src/data/uses.ts is used as fallback so the page is never broken.
 *
 * Rules:
 * - Never exposes raw API errors to visitors.
 * - Cancels the in-flight request on unmount via AbortController.
 */

import { useState, useEffect } from 'react';
import { getUses } from '../lib/api';
import { usesData as staticUses } from '../data/uses';
import type { UseCategory } from '../data/uses';

export interface UseUsesResult {
  /** Resolved categories — always non-empty (falls back to static on error). */
  data: UseCategory[];
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /**
   * Non-null when the API call failed and we are serving static fallback.
   * Dev-mode logging only; never shown to visitors.
   */
  apiError: Error | null;
}

export function useUses(refreshKey?: number): UseUsesResult {
  const [data, setData] = useState<UseCategory[]>(staticUses);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    setIsLoadingSafe(true);

    getUses({ signal: controller.signal })
      .then((apiUses) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiUses) && apiUses.length > 0) {
          setData(apiUses);
          setApiError(null);
        } else {
          setData(staticUses);
        }
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('[useUses] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        setData(staticUses);
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

  function setIsLoadingSafe(val: boolean) {
    setLoading(val);
  }

  return { data, loading, apiError };
}
