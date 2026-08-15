import { api, ApiResponse } from './api';
import { ResumeData as FrontendResumeData } from '../types';

// Backend resume interface (snake_case)
interface BackendResumeData {
  id: string;
  pdf_url: string;
  docx_url: string;
  version: string;
  last_updated: string;
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformResumeData(data: BackendResumeData): FrontendResumeData {
  return {
    id: data.id,
    pdfUrl: data.pdf_url,
    docxUrl: data.docx_url,
    version: data.version,
    lastUpdated: data.last_updated,
    downloadsCount: data.downloads_count,
  };
}

// Resume service
export const resumeService = {
  // Get resume
  get: async () => {
    const response = await api.get<BackendResumeData>('/resume/');
    if (response.success && response.data) {
      return {
        ...response,
        data: transformResumeData(response.data) as FrontendResumeData,
      } as unknown as ApiResponse<FrontendResumeData>;
    }
    return response as unknown as ApiResponse<FrontendResumeData>;
  },

  // Update resume
  update: async (data: Partial<FrontendResumeData>) => {
    const response = await api.put<BackendResumeData>('/resume/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformResumeData(response.data) as FrontendResumeData,
      } as unknown as ApiResponse<FrontendResumeData>;
    }
    return response as unknown as ApiResponse<FrontendResumeData>;
  },

  // Patch resume
  patch: async (data: Partial<FrontendResumeData>) => {
    const response = await api.patch<BackendResumeData>('/resume/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformResumeData(response.data) as FrontendResumeData,
      } as unknown as ApiResponse<FrontendResumeData>;
    }
    return response as unknown as ApiResponse<FrontendResumeData>;
  },

  // Increment download count
  incrementDownload: async () => {
    return api.post<{ downloads_count: number }>('/resume/increment-download/');
  },
};
