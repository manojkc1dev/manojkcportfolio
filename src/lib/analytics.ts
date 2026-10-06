export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

let capturedUTMs: UTMParams = {};

export function getCapturedUTMs(): UTMParams {
  if (Object.keys(capturedUTMs).length > 0) {
    return capturedUTMs;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('portfolio_utms');
      if (stored) {
        capturedUTMs = JSON.parse(stored);
        return capturedUTMs;
      }

      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source');
      const medium = params.get('utm_medium');
      const campaign = params.get('utm_campaign');

      const utms: UTMParams = {};
      if (source) utms.utm_source = source;
      if (medium) utms.utm_medium = medium;
      if (campaign) utms.utm_campaign = campaign;

      capturedUTMs = utms;
      if (Object.keys(utms).length > 0) {
        sessionStorage.setItem('portfolio_utms', JSON.stringify(utms));
      }
    } catch {
      // Ignore storage/url errors
    }
  }
  return capturedUTMs;
}

/**
 * Initializes client analytics and captures UTM parameters on initial visit.
 */
export async function init(): Promise<void> {
  if (typeof window === 'undefined') return;
  // Always capture UTM params on initial visit
  getCapturedUTMs();
}

/**
 * Tracks custom events, merging captured UTM parameters.
 */
export function track(eventName: string, params?: Record<string, unknown>): void {
  try {
    const utms = getCapturedUTMs();
    const eventParams = {
      ...utms,
      ...params,
    };
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] ${eventName}`, eventParams);
    }
  } catch {
    // Ignore analytics tracking errors
  }
}

