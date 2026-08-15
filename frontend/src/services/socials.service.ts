import { api, ApiResponse } from './api';
import { SocialLink as FrontendSocialLink } from '../types';

// Backend social interface (snake_case)
interface BackendSocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  enabled: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformSocialData(data: BackendSocialLink): FrontendSocialLink {
  return {
    id: data.id,
    platform: data.platform,
    url: data.url,
    iconName: data.icon_name,
    enabled: data.enabled,
  };
}

// Social service
export const socialsService = {
  // Get all social links
  getAll: async (params?: any) => {
    const response = await api.get<BackendSocialLink[]>('/socials/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformSocialData) as FrontendSocialLink[],
      } as unknown as ApiResponse<FrontendSocialLink[]>;
    }
    return response as unknown as ApiResponse<FrontendSocialLink[]>;
  },

  // Get single social link
  getById: async (id: string) => {
    const response = await api.get<BackendSocialLink>(`/socials/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSocialData(response.data) as FrontendSocialLink,
      } as unknown as ApiResponse<FrontendSocialLink>;
    }
    return response as unknown as ApiResponse<FrontendSocialLink>;
  },

  // Create social link
  create: async (data: Partial<FrontendSocialLink>) => {
    const response = await api.post<BackendSocialLink>('/socials/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSocialData(response.data) as FrontendSocialLink,
      } as unknown as ApiResponse<FrontendSocialLink>;
    }
    return response as unknown as ApiResponse<FrontendSocialLink>;
  },

  // Update social link
  update: async (id: string, data: Partial<FrontendSocialLink>) => {
    const response = await api.put<BackendSocialLink>(`/socials/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSocialData(response.data) as FrontendSocialLink,
      } as unknown as ApiResponse<FrontendSocialLink>;
    }
    return response as unknown as ApiResponse<FrontendSocialLink>;
  },

  // Patch social link
  patch: async (id: string, data: Partial<FrontendSocialLink>) => {
    const response = await api.patch<BackendSocialLink>(`/socials/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSocialData(response.data) as FrontendSocialLink,
      } as unknown as ApiResponse<FrontendSocialLink>;
    }
    return response as unknown as ApiResponse<FrontendSocialLink>;
  },

  // Delete social link
  delete: async (id: string) => {
    return api.delete(`/socials/${id}/`);
  },
};
