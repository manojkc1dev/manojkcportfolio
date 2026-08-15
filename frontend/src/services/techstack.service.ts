import { api, ApiResponse } from './api';
import { TechStackItem as FrontendTechStackItem, TechCategory } from '../types';

// Backend tech stack interface (snake_case)
interface BackendTechStackItem {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  icon: string;
  svg: string;
  image: string;
  color: string;
  official_website: string;
  documentation_url: string;
  skill_level: string;
  experience_years: number;
  display_order: number;
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformTechStackData(data: BackendTechStackItem): FrontendTechStackItem {
  return {
    id: data.id,
    name: data.name,
    category: (data.category || 'Tool') as TechCategory,
    iconName: data.icon,
    color: data.color,
    officialWebsite: data.official_website,
    skillLevel: data.skill_level === 'expert' ? 100 : 
                 data.skill_level === 'advanced' ? 80 :
                 data.skill_level === 'intermediate' ? 60 : 40,
    yearsOfExperience: data.experience_years,
    displayOrder: data.display_order,
    showOnHomepage: data.show_on_homepage,
    featured: data.is_featured,
    status: data.status === 'active' ? 'Active' : 'Archived',
  };
}

// Tech Stack service
export const techstackService = {
  // Get all tech stack items
  getAll: async (params?: any) => {
    const response = await api.get<BackendTechStackItem[]>('/tech-stack/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformTechStackData) as FrontendTechStackItem[],
      } as unknown as ApiResponse<FrontendTechStackItem[]>;
    }
    return response as unknown as ApiResponse<FrontendTechStackItem[]>;
  },

  // Get single tech stack item
  getById: async (id: string) => {
    const response = await api.get<BackendTechStackItem>(`/tech-stack/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTechStackData(response.data) as FrontendTechStackItem,
      } as unknown as ApiResponse<FrontendTechStackItem>;
    }
    return response as unknown as ApiResponse<FrontendTechStackItem>;
  },

  // Create tech stack item
  create: async (data: Partial<FrontendTechStackItem>) => {
    const response = await api.post<BackendTechStackItem>('/tech-stack/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTechStackData(response.data) as FrontendTechStackItem,
      } as unknown as ApiResponse<FrontendTechStackItem>;
    }
    return response as unknown as ApiResponse<FrontendTechStackItem>;
  },

  // Update tech stack item
  update: async (id: string, data: Partial<FrontendTechStackItem>) => {
    const response = await api.put<BackendTechStackItem>(`/tech-stack/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTechStackData(response.data) as FrontendTechStackItem,
      } as unknown as ApiResponse<FrontendTechStackItem>;
    }
    return response as unknown as ApiResponse<FrontendTechStackItem>;
  },

  // Patch tech stack item
  patch: async (id: string, data: Partial<FrontendTechStackItem>) => {
    const response = await api.patch<BackendTechStackItem>(`/tech-stack/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTechStackData(response.data) as FrontendTechStackItem,
      } as unknown as ApiResponse<FrontendTechStackItem>;
    }
    return response as unknown as ApiResponse<FrontendTechStackItem>;
  },

  // Delete tech stack item
  delete: async (id: string) => {
    return api.delete(`/tech-stack/${id}/`);
  },
};
