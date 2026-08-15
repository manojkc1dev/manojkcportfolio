import { api, ApiResponse } from './api';
import { Certification as FrontendCertification } from '../types';

// Backend certification interface (snake_case)
interface BackendCertification {
  id: string;
  title: string;
  issuer: string;
  credential_id: string;
  verification_url: string;
  issue_date: string;
  expiration_date: string;
  logo_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformCertificationData(data: BackendCertification): FrontendCertification {
  return {
    id: data.id,
    title: data.title,
    issuer: data.issuer,
    credentialId: data.credential_id,
    verificationUrl: data.verification_url,
    issueDate: data.issue_date,
    logoUrl: data.logo_url,
    status: data.status === 'active' ? 'Active' : 'Expired',
  };
}

// Certification service
export const certificationsService = {
  // Get all certifications
  getAll: async (params?: any) => {
    const response = await api.get<BackendCertification[]>('/certifications/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformCertificationData) as FrontendCertification[],
      } as unknown as ApiResponse<FrontendCertification[]>;
    }
    return response as unknown as ApiResponse<FrontendCertification[]>;
  },

  // Get single certification
  getById: async (id: string) => {
    const response = await api.get<BackendCertification>(`/certifications/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformCertificationData(response.data) as FrontendCertification,
      } as unknown as ApiResponse<FrontendCertification>;
    }
    return response as unknown as ApiResponse<FrontendCertification>;
  },

  // Create certification
  create: async (data: Partial<FrontendCertification>) => {
    const response = await api.post<BackendCertification>('/certifications/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformCertificationData(response.data) as FrontendCertification,
      } as unknown as ApiResponse<FrontendCertification>;
    }
    return response as unknown as ApiResponse<FrontendCertification>;
  },

  // Update certification
  update: async (id: string, data: Partial<FrontendCertification>) => {
    const response = await api.put<BackendCertification>(`/certifications/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformCertificationData(response.data) as FrontendCertification,
      } as unknown as ApiResponse<FrontendCertification>;
    }
    return response as unknown as ApiResponse<FrontendCertification>;
  },

  // Patch certification
  patch: async (id: string, data: Partial<FrontendCertification>) => {
    const response = await api.patch<BackendCertification>(`/certifications/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformCertificationData(response.data) as FrontendCertification,
      } as unknown as ApiResponse<FrontendCertification>;
    }
    return response as unknown as ApiResponse<FrontendCertification>;
  },

  // Delete certification
  delete: async (id: string) => {
    return api.delete(`/certifications/${id}/`);
  },
};
