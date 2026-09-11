import { api, ApiResponse } from './api';
import { Testimonial as FrontendTestimonial } from '../types';

// Backend testimonial interface (snake_case)
interface BackendTestimonial {
  id: string;
  client_name: string;
  client_designation: string;
  client_company: string;
  client_photo: string;
  company_logo: string;
  review: string;
  rating: number;
  linkedin_url: string;
  website_url: string;
  project_name: string;
  project_url: string;
  show_on_homepage: boolean;
  is_featured: boolean;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformTestimonial(data: BackendTestimonial): FrontendTestimonial {
  return {
    id: data.id,
    clientName: data.client_name,
    designation: data.client_designation,
    company: data.client_company,
    photo: data.client_photo,
    review: data.review,
    rating: data.rating,
    featured: data.is_featured,
  };
}

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getAll: async () => {
    const response = await api.get<BackendTestimonial[]>('/testimonials/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformTestimonial) as FrontendTestimonial[],
      } as unknown as ApiResponse<FrontendTestimonial[]>;
    }
    return response as unknown as ApiResponse<FrontendTestimonial[]>;
  },

  // Get single testimonial
  getById: async (id: string) => {
    const response = await api.get<BackendTestimonial>(`/testimonials/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTestimonial(response.data) as FrontendTestimonial,
      } as unknown as ApiResponse<FrontendTestimonial>;
    }
    return response as unknown as ApiResponse<FrontendTestimonial>;
  },

  // Create testimonial
  create: async (data: Partial<FrontendTestimonial>) => {
    const response = await api.post<BackendTestimonial>('/testimonials/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTestimonial(response.data) as FrontendTestimonial,
      } as unknown as ApiResponse<FrontendTestimonial>;
    }
    return response as unknown as ApiResponse<FrontendTestimonial>;
  },

  // Update testimonial
  update: async (id: string, data: Partial<FrontendTestimonial>) => {
    const response = await api.put<BackendTestimonial>(`/testimonials/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTestimonial(response.data) as FrontendTestimonial,
      } as unknown as ApiResponse<FrontendTestimonial>;
    }
    return response as unknown as ApiResponse<FrontendTestimonial>;
  },

  // Patch testimonial
  patch: async (id: string, data: Partial<FrontendTestimonial>) => {
    const response = await api.patch<BackendTestimonial>(`/testimonials/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformTestimonial(response.data) as FrontendTestimonial,
      } as unknown as ApiResponse<FrontendTestimonial>;
    }
    return response as unknown as ApiResponse<FrontendTestimonial>;
  },

  // Delete testimonial
  delete: async (id: string) => {
    return api.delete(`/testimonials/${id}/`);
  },
};
