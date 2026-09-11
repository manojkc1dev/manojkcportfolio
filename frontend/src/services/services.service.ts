import { api, ApiResponse } from './api';
import { Service as FrontendService } from '../types';

// Backend service interface (snake_case)
interface BackendService {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  price: number | null;
  price_type: string;
  features: string[];
  process_steps: string[];
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformService(data: BackendService): FrontendService {
  return {
    id: data.id,
    title: data.name,
    description: data.description,
    iconName: data.icon,
    features: data.features,
    deliverables: data.process_steps,
    startingPrice: data.price ? `$${data.price}` : 'Custom Scope',
  };
}

// Services service
export const servicesService = {
  // Get all services
  getAll: async () => {
    const response = await api.get<BackendService[]>('/services/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformService) as FrontendService[],
      } as unknown as ApiResponse<FrontendService[]>;
    }
    return response as unknown as ApiResponse<FrontendService[]>;
  },

  // Get single service
  getById: async (id: string) => {
    const response = await api.get<BackendService>(`/services/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformService(response.data) as FrontendService,
      } as unknown as ApiResponse<FrontendService>;
    }
    return response as unknown as ApiResponse<FrontendService>;
  },

  // Create service
  create: async (data: Partial<FrontendService>) => {
    const response = await api.post<BackendService>('/services/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformService(response.data) as FrontendService,
      } as unknown as ApiResponse<FrontendService>;
    }
    return response as unknown as ApiResponse<FrontendService>;
  },

  // Update service
  update: async (id: string, data: Partial<FrontendService>) => {
    const response = await api.put<BackendService>(`/services/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformService(response.data) as FrontendService,
      } as unknown as ApiResponse<FrontendService>;
    }
    return response as unknown as ApiResponse<FrontendService>;
  },

  // Patch service
  patch: async (id: string, data: Partial<FrontendService>) => {
    const response = await api.patch<BackendService>(`/services/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformService(response.data) as FrontendService,
      } as unknown as ApiResponse<FrontendService>;
    }
    return response as unknown as ApiResponse<FrontendService>;
  },

  // Delete service
  delete: async (id: string) => {
    return api.delete(`/services/${id}/`);
  },
};
