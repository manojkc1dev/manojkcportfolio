import axiosInstance from '../lib/axios';

export interface DashboardAnalytics {
  total_projects: number;
  published_projects: number;
  draft_projects: number;
  total_visitors: number;
  unique_visitors: number;
  total_contacts: number;
  new_contacts: number;
  replied_contacts: number;
  total_subscribers: number;
  verified_subscribers: number;
  total_blogs: number;
  published_blogs: number;
  total_skills: number;
  total_certifications: number;
  visitor_countries: Array<{ country: string; count: number }>;
  recent_contacts: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    contact_status: string;
    created_at: string;
    replied_at: string | null;
  }>;
  recent_projects: Array<{
    id: string;
    title: string;
    status: string;
    visibility: string;
    is_featured: boolean;
    created_at: string;
    view_count: number;
  }>;
  recent_blogs: Array<{
    id: string;
    title: string;
    status: string;
    is_featured: boolean;
    created_at: string;
    view_count: number;
  }>;
}

export interface DashboardAnalyticsResponse {
  success: boolean;
  data: DashboardAnalytics;
  cached?: boolean;
}

export const dashboardService = {
  /**
   * Get dashboard analytics
   * Requires authentication and admin/super_admin role
   */
  async getAnalytics(): Promise<DashboardAnalyticsResponse> {
    const response = await axiosInstance.get<DashboardAnalyticsResponse>(
      '/api/v1/dashboard/analytics/'
    );
    return response.data;
  },
};
