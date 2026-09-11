import { api, ApiResponse } from './api';
import { Experience as FrontendExperience } from '../types';

// Backend experience interface (snake_case)
interface BackendExperience {
  id: string;
  company: string;
  position: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string;
  technologies: string[];
  achievements: string[];
  company_website: string;
  company_logo: string;
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformExperienceData(data: BackendExperience): FrontendExperience {
  const employmentTypeMap: Record<string, 'Full-Time' | 'Contract' | 'Consultant' | 'Part-Time'> = {
    'full_time': 'Full-Time',
    'part_time': 'Part-Time',
    'contract': 'Contract',
    'consultant': 'Consultant',
    'freelance': 'Contract',
    'internship': 'Contract',
  };
  
  return {
    id: data.id,
    company: data.company,
    position: data.position,
    employmentType: employmentTypeMap[data.employment_type] || 'Full-Time',
    location: data.location,
    duration: `${data.start_date} - ${data.end_date || 'Present'}`,
    isCurrent: data.is_current,
    description: data.description,
    technologiesUsed: data.technologies || [],
    achievements: data.achievements || [],
    order: data.order,
  };
}

// Experience service
export const experienceService = {
  // Get all experiences
  getAll: async (params?: any) => {
    const response = await api.get<BackendExperience[]>('/experience/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformExperienceData) as FrontendExperience[],
      } as unknown as ApiResponse<FrontendExperience[]>;
    }
    return response as unknown as ApiResponse<FrontendExperience[]>;
  },

  // Get single experience
  getById: async (id: string) => {
    const response = await api.get<BackendExperience>(`/experience/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformExperienceData(response.data) as FrontendExperience,
      } as unknown as ApiResponse<FrontendExperience>;
    }
    return response as unknown as ApiResponse<FrontendExperience>;
  },

  // Create experience
  create: async (data: Partial<FrontendExperience>) => {
    const response = await api.post<BackendExperience>('/experience/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformExperienceData(response.data) as FrontendExperience,
      } as unknown as ApiResponse<FrontendExperience>;
    }
    return response as unknown as ApiResponse<FrontendExperience>;
  },

  // Update experience
  update: async (id: string, data: Partial<FrontendExperience>) => {
    const response = await api.put<BackendExperience>(`/experience/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformExperienceData(response.data) as FrontendExperience,
      } as unknown as ApiResponse<FrontendExperience>;
    }
    return response as unknown as ApiResponse<FrontendExperience>;
  },

  // Patch experience
  patch: async (id: string, data: Partial<FrontendExperience>) => {
    const response = await api.patch<BackendExperience>(`/experience/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformExperienceData(response.data) as FrontendExperience,
      } as unknown as ApiResponse<FrontendExperience>;
    }
    return response as unknown as ApiResponse<FrontendExperience>;
  },

  // Delete experience
  delete: async (id: string) => {
    return api.delete(`/experience/${id}/`);
  },
};
