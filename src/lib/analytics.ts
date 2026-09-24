import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { app, isFirebaseConfigured } from '../firebase';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

let analyticsInstance: Analytics | null = null;
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
 * Initializes Firebase Analytics only if VITE_ENABLE_ANALYTICS === "true"
 */
export async function init(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Always capture UTM params on initial visit
  getCapturedUTMs();

  if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') {
    return;
  }

  if (!isFirebaseConfigured || !app) {
    return;
  }

  try {
    const supported = await isSupported();
    if (!supported) return;

    analyticsInstance = getAnalytics(app);
  } catch (err) {
    console.warn('Analytics initialization failed:', err);
  }
}

/**
 * Tracks custom events, merging captured UTM parameters.
 * No-op if analytics is not initialized.
 */
export function track(eventName: string, params?: Record<string, unknown>): void {
  if (!analyticsInstance) return;

  try {
    const utms = getCapturedUTMs();
    const eventParams = {
      ...utms,
      ...params,
    };
    logEvent(analyticsInstance, eventName, eventParams);
  } catch (err) {
    console.warn(`Analytics track failed for ${eventName}:`, err);
  }
}
