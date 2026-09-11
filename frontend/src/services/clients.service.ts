import { api, ApiResponse } from './api';
import { Client as FrontendClient } from '../types';

// Backend client interface (snake_case)
interface BackendClient {
  id: string;
  name: string;
  company: string;
  designation: string;
  logo: string;
  photo: string;
  website: string;
  email: string;
  linkedin: string;
  review: string;
  rating: number;
  project_name: string;
  project_description: string;
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformClient(data: BackendClient): FrontendClient {
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    website: data.website,
    industry: data.company,
    review: data.review,
  };
}

// Clients service
export const clientsService = {
  // Get all clients
  getAll: async () => {
    const response = await api.get<BackendClient[]>('/clients/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformClient) as FrontendClient[],
      } as unknown as ApiResponse<FrontendClient[]>;
    }
    return response as unknown as ApiResponse<FrontendClient[]>;
  },

  // Get single client
  getById: async (id: string) => {
    const response = await api.get<BackendClient>(`/clients/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClient(response.data) as FrontendClient,
      } as unknown as ApiResponse<FrontendClient>;
    }
    return response as unknown as ApiResponse<FrontendClient>;
  },

  // Create client
  create: async (data: Partial<FrontendClient>) => {
    const response = await api.post<BackendClient>('/clients/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClient(response.data) as FrontendClient,
      } as unknown as ApiResponse<FrontendClient>;
    }
    return response as unknown as ApiResponse<FrontendClient>;
  },

  // Update client
  update: async (id: string, data: Partial<FrontendClient>) => {
    const response = await api.put<BackendClient>(`/clients/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClient(response.data) as FrontendClient,
      } as unknown as ApiResponse<FrontendClient>;
    }
    return response as unknown as ApiResponse<FrontendClient>;
  },

  // Patch client
  patch: async (id: string, data: Partial<FrontendClient>) => {
    const response = await api.patch<BackendClient>(`/clients/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClient(response.data) as FrontendClient,
      } as unknown as ApiResponse<FrontendClient>;
    }
    return response as unknown as ApiResponse<FrontendClient>;
  },

  // Delete client
  delete: async (id: string) => {
    return api.delete(`/clients/${id}/`);
  },
};
