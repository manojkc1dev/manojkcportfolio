import { api, ApiResponse } from './api';
import { AboutData as FrontendAboutData } from '../types';

// Backend about interface (snake_case)
interface BackendAboutData {
  id: string;
  photo: string;
  bio: string;
  long_description: string;
  mission: string;
  vision: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  awards_won: number;
  quote: string;
  quote_author: string;
  highlights: string[];
  show_on_homepage: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformAboutData(data: BackendAboutData): FrontendAboutData {
  return {
    id: data.id,
    photo: data.photo,
    bio: data.bio,
    longDescription: data.long_description,
    mission: data.mission,
    vision: data.vision,
    yearsExperience: data.years_experience,
    projectsCompleted: data.projects_completed,
    quote: data.quote,
    highlights: data.highlights,
    updatedAt: data.updated_at,
  };
}

// About service
export const aboutService = {
  // Get all about sections
  getAll: async () => {
    const response = await api.get<BackendAboutData[]>('/about/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformAboutData) as FrontendAboutData[],
      } as unknown as ApiResponse<FrontendAboutData[]>;
    }
    return response as unknown as ApiResponse<FrontendAboutData[]>;
  },

  // Get single about section
  getById: async (id: string) => {
    const response = await api.get<BackendAboutData>(`/about/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAboutData(response.data) as FrontendAboutData,
      } as unknown as ApiResponse<FrontendAboutData>;
    }
    return response as unknown as ApiResponse<FrontendAboutData>;
  },

  // Create about section
  create: async (data: Partial<FrontendAboutData>) => {
    const response = await api.post<BackendAboutData>('/about/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAboutData(response.data) as FrontendAboutData,
      } as unknown as ApiResponse<FrontendAboutData>;
    }
    return response as unknown as ApiResponse<FrontendAboutData>;
  },

  // Update about section
  update: async (id: string, data: Partial<FrontendAboutData>) => {
    const response = await api.put<BackendAboutData>(`/about/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAboutData(response.data) as FrontendAboutData,
      } as unknown as ApiResponse<FrontendAboutData>;
    }
    return response as unknown as ApiResponse<FrontendAboutData>;
  },

  // Patch about section
  patch: async (id: string, data: Partial<FrontendAboutData>) => {
    const response = await api.patch<BackendAboutData>(`/about/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAboutData(response.data) as FrontendAboutData,
      } as unknown as ApiResponse<FrontendAboutData>;
    }
    return response as unknown as ApiResponse<FrontendAboutData>;
  },

  // Delete about section
  delete: async (id: string) => {
    return api.delete(`/about/${id}/`);
  },
};
