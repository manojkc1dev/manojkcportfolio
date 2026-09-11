import { api, ApiResponse } from './api';
import { MediaFile as FrontendMediaFile } from '../types';

// Backend media interface (snake_case)
interface BackendMedia {
  id: string;
  name: string;
  file: string;
  file_type: string;
  file_size: number;
  alt_text: string;
  caption: string;
  folder: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformMedia(data: BackendMedia): FrontendMediaFile {
  return {
    id: data.id,
    name: data.name,
    url: data.file,
    folder: data.folder,
    fileType: (data.file_type === 'image' || data.file_type === 'video' || data.file_type === 'document' 
      ? data.file_type 
      : 'document') as 'image' | 'video' | 'document',
    sizeBytes: data.file_size,
    dimensions: '', // Not in backend model
    altText: data.alt_text,
    uploadedAt: data.created_at,
  };
}

// Media service
export const mediaService = {
  // Get all media files
  getAll: async () => {
    const response = await api.get<BackendMedia[]>('/media/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformMedia) as FrontendMediaFile[],
      } as unknown as ApiResponse<FrontendMediaFile[]>;
    }
    return response as unknown as ApiResponse<FrontendMediaFile[]>;
  },

  // Get single media file
  getById: async (id: string) => {
    const response = await api.get<BackendMedia>(`/media/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformMedia(response.data) as FrontendMediaFile,
      } as unknown as ApiResponse<FrontendMediaFile>;
    }
    return response as unknown as ApiResponse<FrontendMediaFile>;
  },

  // Upload media file
  create: async (data: Partial<FrontendMediaFile>) => {
    const response = await api.post<BackendMedia>('/media/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformMedia(response.data) as FrontendMediaFile,
      } as unknown as ApiResponse<FrontendMediaFile>;
    }
    return response as unknown as ApiResponse<FrontendMediaFile>;
  },

  // Update media file
  update: async (id: string, data: Partial<FrontendMediaFile>) => {
    const response = await api.put<BackendMedia>(`/media/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformMedia(response.data) as FrontendMediaFile,
      } as unknown as ApiResponse<FrontendMediaFile>;
    }
    return response as unknown as ApiResponse<FrontendMediaFile>;
  },

  // Patch media file
  patch: async (id: string, data: Partial<FrontendMediaFile>) => {
    const response = await api.patch<BackendMedia>(`/media/${id}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformMedia(response.data) as FrontendMediaFile,
      } as unknown as ApiResponse<FrontendMediaFile>;
    }
    return response as unknown as ApiResponse<FrontendMediaFile>;
  },

  // Delete media file
  delete: async (id: string) => {
    return api.delete(`/media/${id}/`);
  },
};
