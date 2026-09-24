import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
}

let analyticsInitialized = false;

/**
 * Initializes Firebase Analytics (if VITE_ENABLE_ANALYTICS is "true")
 * and logs campaign / UTM referral parameters on first visit.
 */
export async function initAnalyticsAndTrackUTM(): Promise<void> {
  if (typeof window === 'undefined') return;

  const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  const apiKey = import.meta.env.VITE_FB_API_KEY;
  const projectId = import.meta.env.VITE_FB_PROJECT_ID;

  // Extract UTM and referral parameters from the current URL
  const searchParams = new URLSearchParams(window.location.search);
  const utmSource = searchParams.get('utm_source') || undefined;
  const utmMedium = searchParams.get('utm_medium') || undefined;
  const utmCampaign = searchParams.get('utm_campaign') || undefined;
  const utmTerm = searchParams.get('utm_term') || undefined;
  const utmContent = searchParams.get('utm_content') || undefined;
  const referrer = document.referrer || undefined;

  const hasUTM = Boolean(utmSource || utmMedium || utmCampaign);

  const utmData: UTMData = {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    referrer,
    landing_page: window.location.pathname + window.location.search,
  };

  // Check if session has already captured first-visit attribution
  const hasLoggedSession = sessionStorage.getItem('portfolio_utm_tracked');

  if (!enableAnalytics || !apiKey || !projectId) {
    if (hasUTM && !hasLoggedSession) {
      // Helpful developer feedback when testing locally without live analytics
      console.info('[Analytics Disabled] Detected campaign parameters:', utmData);
      sessionStorage.setItem('portfolio_utm_tracked', 'true');
    }
    return;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Analytics is not supported in this browser environment.');
      return;
    }

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FB_API_KEY,
      authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FB_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
      appId: import.meta.env.VITE_FB_APP_ID,
    };

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    analyticsInitialized = true;

    // Log page view
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Log campaign attributes on first session visit if UTMs or referrer are present
    if (!hasLoggedSession) {
      if (hasUTM || referrer) {
        logEvent(analytics, 'campaign_visit', {
          source: utmSource ?? 'direct',
          medium: utmMedium ?? 'none',
          campaign: utmCampaign ?? 'none',
          term: utmTerm ?? '',
          content: utmContent ?? '',
          referrer: referrer ?? 'direct',
        });
      }
      sessionStorage.setItem('portfolio_utm_tracked', 'true');
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization error:', error);
  }
}

export function isAnalyticsReady(): boolean {
  return analyticsInitialized;
}
