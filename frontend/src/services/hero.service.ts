import { api, ApiResponse } from './api';
import { HeroData as FrontendHeroData } from '../types';

// Backend hero interface (snake_case)
interface BackendHeroData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  availability_badge: string;
  availability_status: string;
  location: string;
  profile_image: string;
  background_image: string;
  resume_button_text: string;
  resume_button_url: string;
  hire_me_button_text: string;
  hire_me_button_url: string;
  github_button_text: string;
  github_button_url: string;
  linkedin_button_text: string;
  linkedin_button_url: string;
  email_button_text: string;
  email_button_url: string;
  whatsapp_button_text: string;
  whatsapp_button_url: string;
  typing_animation_texts: string[];
  typing_animation_enabled: boolean;
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformHeroData(data: BackendHeroData): FrontendHeroData {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    availabilityBadge: data.availability_badge,
    location: data.location,
    profileImage: data.profile_image,
    backgroundImage: data.background_image,
    resumeUrl: data.resume_button_url,
    hireMeUrl: data.hire_me_button_url,
    githubUrl: data.github_button_url,
    linkedinUrl: data.linkedin_button_url,
    emailUrl: data.email_button_url,
    whatsappUrl: data.whatsapp_button_url,
    typingTexts: data.typing_animation_texts,
    status: (data.status.charAt(0).toUpperCase() + data.status.slice(1)) as 'Published' | 'Draft',
    order: data.order,
    updatedAt: data.updated_at,
  };
}

// Hero service
export const heroService = {
  // Get all hero sections
  getAll: async () => {
    const response = await api.get<BackendHeroData[]>('/hero/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformHeroData) as FrontendHeroData[],
      } as unknown as ApiResponse<FrontendHeroData[]>;
    }
    return response as unknown as ApiResponse<FrontendHeroData[]>;
  },

  // Get single hero section
  getById: async (id: string) => {
    const response = await api.get<BackendHeroData>(`/hero/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformHeroData(response.data) as FrontendHeroData,
      } as unknown as ApiResponse<FrontendHeroData>;
    }
    return response as unknown as ApiResponse<FrontendHeroData>;
  },

  // Create hero section
  create: async (data: Partial<FrontendHeroData>) => {
    const response = await api.post<BackendHeroData>('/hero/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformHeroData(response.data) as FrontendHeroData,
      } as unknown as ApiResponse<FrontendHeroData>;
    }
    return response as unknown as ApiResponse<FrontendHeroData>;
  },

  // Update hero section
  update: async (id: string, data: Partial<FrontendHeroData>) => {
    const response = await api.put<BackendHeroData>(`/hero/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformHeroData(response.data) as FrontendHeroData,
      } as unknown as ApiResponse<FrontendHeroData>;
    }
    return response as unknown as ApiResponse<FrontendHeroData>;
  },

  // Patch hero section
  patch: async (id: string, data: Partial<FrontendHeroData>) => {
    const response = await api.patch<BackendHeroData>(`/hero/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformHeroData(response.data) as FrontendHeroData,
      } as unknown as ApiResponse<FrontendHeroData>;
    }
    return response as unknown as ApiResponse<FrontendHeroData>;
  },

  // Delete hero section
  delete: async (id: string) => {
    return api.delete(`/hero/${id}/`);
  },
};
