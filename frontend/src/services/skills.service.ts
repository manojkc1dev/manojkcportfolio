import { api, ApiResponse } from './api';
import { SkillItem as FrontendSkillItem } from '../types';

// Backend skill interface (snake_case)
interface BackendSkill {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  percentage: number;
  experience_years: number;
  icon: string;
  image: string;
  priority: number;
  is_featured: boolean;
  show_on_homepage: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformSkillData(data: BackendSkill): FrontendSkillItem {
  return {
    id: data.id,
    name: data.name,
    category: data.category || '',
    percentage: data.percentage,
    yearsExperience: data.experience_years,
    iconName: data.icon,
    priority: data.priority,
    featured: data.is_featured,
  };
}

// Skill service
export const skillsService = {
  // Get all skills
  getAll: async (params?: any) => {
    const response = await api.get<BackendSkill[]>('/skills/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformSkillData) as FrontendSkillItem[],
      } as unknown as ApiResponse<FrontendSkillItem[]>;
    }
    return response as unknown as ApiResponse<FrontendSkillItem[]>;
  },

  // Get single skill
  getById: async (id: string) => {
    const response = await api.get<BackendSkill>(`/skills/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSkillData(response.data) as FrontendSkillItem,
      } as unknown as ApiResponse<FrontendSkillItem>;
    }
    return response as unknown as ApiResponse<FrontendSkillItem>;
  },

  // Create skill
  create: async (data: Partial<FrontendSkillItem>) => {
    const response = await api.post<BackendSkill>('/skills/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSkillData(response.data) as FrontendSkillItem,
      } as unknown as ApiResponse<FrontendSkillItem>;
    }
    return response as unknown as ApiResponse<FrontendSkillItem>;
  },

  // Update skill
  update: async (id: string, data: Partial<FrontendSkillItem>) => {
    const response = await api.put<BackendSkill>(`/skills/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSkillData(response.data) as FrontendSkillItem,
      } as unknown as ApiResponse<FrontendSkillItem>;
    }
    return response as unknown as ApiResponse<FrontendSkillItem>;
  },

  // Patch skill
  patch: async (id: string, data: Partial<FrontendSkillItem>) => {
    const response = await api.patch<BackendSkill>(`/skills/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformSkillData(response.data) as FrontendSkillItem,
      } as unknown as ApiResponse<FrontendSkillItem>;
    }
    return response as unknown as ApiResponse<FrontendSkillItem>;
  },

  // Delete skill
  delete: async (id: string) => {
    return api.delete(`/skills/${id}/`);
  },
};
