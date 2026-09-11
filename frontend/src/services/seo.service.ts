import { api, ApiResponse } from './api';
import { SeoConfig as FrontendSeoConfig } from '../types';

// Backend SEO interface (snake_case)
interface BackendSeoConfig {
  id: string;
  site_name: string;
  site_description: string;
  site_keywords: string[];
  default_meta_title: string;
  default_meta_description: string;
  default_og_image: string;
  default_twitter_image: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
  structured_data_enabled: boolean;
  sitemap_enabled: boolean;
  robots_txt: string;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformSeoConfig(data: BackendSeoConfig): FrontendSeoConfig {
  return {
    siteTitle: data.site_name,
    metaDescription: data.site_description,
    ogImage: data.default_og_image,
    twitterCard: data.default_twitter_image,
    canonicalUrl: '',
    robots: data.robots_txt,
    authorName: '',
    schemaType: '',
  };
}

// SEO service
export const seoService = {
  // Get all SEO configs
  getAll: async () => {
    const response = await api.get<BackendSeoConfig[]>('/seo/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformSeoConfig) as FrontendSeoConfig[],
      } as unknown as ApiResponse<FrontendSeoConfig[]>;
    }
    return response as unknown as ApiResponse<FrontendSeoConfig[]>;
  },

  // Get single SEO config
  getById: async (id: string) => {
    const response = await api.get<BackendSeoConfig>(`/seo/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSeoConfig(response.data) as FrontendSeoConfig,
      } as unknown as ApiResponse<FrontendSeoConfig>;
    }
    return response as unknown as ApiResponse<FrontendSeoConfig>;
  },

  // Create SEO config
  create: async (data: Partial<FrontendSeoConfig>) => {
    const response = await api.post<BackendSeoConfig>('/seo/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSeoConfig(response.data) as FrontendSeoConfig,
      } as unknown as ApiResponse<FrontendSeoConfig>;
    }
    return response as unknown as ApiResponse<FrontendSeoConfig>;
  },

  // Update SEO config
  update: async (id: string, data: Partial<FrontendSeoConfig>) => {
    const response = await api.put<BackendSeoConfig>(`/seo/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSeoConfig(response.data) as FrontendSeoConfig,
      } as unknown as ApiResponse<FrontendSeoConfig>;
    }
    return response as unknown as ApiResponse<FrontendSeoConfig>;
  },

  // Patch SEO config
  patch: async (id: string, data: Partial<FrontendSeoConfig>) => {
    const response = await api.patch<BackendSeoConfig>(`/seo/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSeoConfig(response.data) as FrontendSeoConfig,
      } as unknown as ApiResponse<FrontendSeoConfig>;
    }
    return response as unknown as ApiResponse<FrontendSeoConfig>;
  },

  // Delete SEO config
  delete: async (id: string) => {
    return api.delete(`/seo/${id}/`);
  },
};
