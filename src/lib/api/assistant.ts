/**
 * Assistant API Client
 *
 * Typed client methods for the three deterministic Q&A assistant endpoints.
 * All requests go through the shared apiClient (same auth/base-URL handling).
 */

import { apiClient, type RequestOptions } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssistantSuggestedAction {
  label: string;
  action_type: 'link' | 'query';
  target: string;
}

export type AssistantIntent =
  | 'greeting'
  | 'tech_stack'
  | 'database_optimization'
  | 'payments'
  | 'rates_hiring'
  | 'projects'
  | 'security'
  | 'contact'
  | 'experience'
  | 'services'
  | 'about'
  | 'fallback';

export interface AssistantQueryResponse {
  intent: AssistantIntent;
  answer: string;
  confidence: number;
  suggested_actions: AssistantSuggestedAction[];
  data_source: 'live_db' | 'static_fallback';
}

export interface AssistantContextResponse {
  profile?: Record<string, unknown>;
  skills?: unknown[];
  projects?: unknown[];
  experience?: unknown[];
  services?: unknown[];
}

export interface AssistantFeedbackPayload {
  query: string;
  intent: AssistantIntent | string;
  rating: 'helpful' | 'not_helpful';
  comment?: string;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

/**
 * GET /api/v1/assistant/context/
 *
 * Fetches a public snapshot of the portfolio context used by the assistant.
 */
export function getAssistantContext(
  options?: RequestOptions,
): Promise<AssistantContextResponse> {
  return apiClient.get<AssistantContextResponse>('/api/v1/assistant/context/', options);
}

/**
 * POST /api/v1/assistant/query/
 *
 * Submits a user query to the deterministic intent router.
 * Returns a structured answer, intent, confidence, and suggested actions.
 */
export function postAssistantQuery(
  query: string,
  options?: RequestOptions,
): Promise<AssistantQueryResponse> {
  return apiClient.post<AssistantQueryResponse>(
    '/api/v1/assistant/query/',
    { query },
    options,
  );
}

/**
 * POST /api/v1/assistant/feedback/
 *
 * Records user feedback (helpful / not_helpful) for a given response.
 * Fire-and-forget — callers should not await or act on errors.
 */
export async function postAssistantFeedback(
  payload: AssistantFeedbackPayload,
  options?: RequestOptions,
): Promise<void> {
  try {
    await apiClient.post<{ status: string }>(
      '/api/v1/assistant/feedback/',
      payload,
      options,
    );
  } catch {
    // Feedback is non-critical — silently swallow errors
  }
}
