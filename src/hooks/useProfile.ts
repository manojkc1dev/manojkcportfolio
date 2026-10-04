/**
 * useProfile — Django API-backed profile hook with static fallback.
 *
 * Calls GET /api/v1/profile/ via the canonical API client.
 * On success the Django response becomes the authoritative source.
 * On any API failure (network, 5xx, etc.) the static profile from
 * src/data/profile.ts is used so the portfolio is never empty.
 *
 * Rules:
 * - Never exposes raw errors to visitors.
 * - Never uses localStorage for profile data.
 * - Cancels the in-flight request on unmount via AbortController.
 */

import { useState, useEffect } from 'react';
import { getProfile } from '../lib/api';
import { profile as staticProfile } from '../data/profile';
import type { Profile } from '../types';

export interface UseProfileResult {
  /** Resolved profile — always defined (falls back to static on error). */
  data: Profile;
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /**
   * Non-null when the API call failed and we are serving static fallback.
   * Intentionally not surfaced to visitors; available for dev-mode logging.
   */
  apiError: Error | null;
}

export function useProfile(): UseProfileResult {
  const [data, setData] = useState<Profile>(staticProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProfile({ signal: controller.signal })
      .then((apiProfile) => {
        if (!controller.signal.aborted) {
          setData(apiProfile);
          setApiError(null);
        }
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return; // unmounted — ignore
        // Silently fall back; log in dev only
        if (import.meta.env.DEV) {
          console.warn('[useProfile] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        // data remains staticProfile — no visible degradation
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { data, loading, apiError };
}
