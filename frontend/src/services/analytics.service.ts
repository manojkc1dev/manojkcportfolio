import { api, ApiResponse } from './api';
import { SiteAnalytics as FrontendSiteAnalytics } from '../types';

// Backend analytics interface (snake_case)
interface BackendAnalytics {
  id: string;
  total_visitors: number;
  unique_visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_session_duration: number;
  visitor_countries: { country: string; code: string; count: number }[];
  device_breakdown: { name: string; count: number }[];
  views_over_time: { date: string; views: number }[];
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformAnalytics(data: BackendAnalytics): FrontendSiteAnalytics {
  return {
    totalVisitors: data.total_visitors,
    pageViews: data.page_views,
    contactRequests: 0, // Not in backend analytics model
    resumeDownloads: 0, // Not in backend analytics model
    visitorCountries: data.visitor_countries.map(c => ({
      country: c.country,
      code: c.code,
      count: c.count,
    })),
    deviceBreakdown: data.device_breakdown,
    viewsOverTime: data.views_over_time.map(v => ({
      date: v.date,
      views: v.views,
      uniqueVisitors: 0, // Not in backend model, default to 0
    })),
  };
}

// Analytics service (read-only)
export const analyticsService = {
  // Get all analytics
  getAll: async () => {
    const response = await api.get<BackendAnalytics[]>('/analytics/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformAnalytics) as FrontendSiteAnalytics[],
      } as unknown as ApiResponse<FrontendSiteAnalytics[]>;
    }
    return response as unknown as ApiResponse<FrontendSiteAnalytics[]>;
  },

  // Get single analytics entry
  getById: async (id: string) => {
    const response = await api.get<BackendAnalytics>(`/analytics/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAnalytics(response.data) as FrontendSiteAnalytics,
      } as unknown as ApiResponse<FrontendSiteAnalytics>;
    }
    return response as unknown as ApiResponse<FrontendSiteAnalytics>;
  },
};
