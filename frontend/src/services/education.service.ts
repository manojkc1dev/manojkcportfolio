import { api, ApiResponse } from './api';
import { Education as FrontendEducation } from '../types';

// Backend education interface (snake_case)
interface BackendEducation {
  id: string;
  institution: string;
  degree: string;
  major: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  cgpa: number;
  percentage: number;
  grade: string;
  description: string;
  coursework: string[];
  achievements: string[];
  institution_website: string;
  institution_logo: string;
  show_on_homepage: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformEducationData(data: BackendEducation): FrontendEducation {
  return {
    id: data.id,
    institute: data.institution,
    degree: data.degree,
    major: data.major,
    duration: `${data.start_date} - ${data.end_date || 'Present'}`,
    cgpa: data.cgpa?.toString() || '',
    description: data.description,
  };
}

// Education service
export const educationService = {
  // Get all education
  getAll: async (params?: any) => {
    const response = await api.get<BackendEducation[]>('/education/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEducationData) as FrontendEducation[],
      } as unknown as ApiResponse<FrontendEducation[]>;
    }
    return response as unknown as ApiResponse<FrontendEducation[]>;
  },

  // Get single education
  getById: async (id: string) => {
    const response = await api.get<BackendEducation>(`/education/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEducationData(response.data) as FrontendEducation,
      } as unknown as ApiResponse<FrontendEducation>;
    }
    return response as unknown as ApiResponse<FrontendEducation>;
  },

  // Create education
  create: async (data: Partial<FrontendEducation>) => {
    const response = await api.post<BackendEducation>('/education/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEducationData(response.data) as FrontendEducation,
      } as unknown as ApiResponse<FrontendEducation>;
    }
    return response as unknown as ApiResponse<FrontendEducation>;
  },

  // Update education
  update: async (id: string, data: Partial<FrontendEducation>) => {
    const response = await api.put<BackendEducation>(`/education/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEducationData(response.data) as FrontendEducation,
      } as unknown as ApiResponse<FrontendEducation>;
    }
    return response as unknown as ApiResponse<FrontendEducation>;
  },

  // Patch education
  patch: async (id: string, data: Partial<FrontendEducation>) => {
    const response = await api.patch<BackendEducation>(`/education/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEducationData(response.data) as FrontendEducation,
      } as unknown as ApiResponse<FrontendEducation>;
    }
    return response as unknown as ApiResponse<FrontendEducation>;
  },

  // Delete education
  delete: async (id: string) => {
    return api.delete(`/education/${id}/`);
  },
};
