import axiosInstance from '../lib/axios';

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

// Generic API request wrapper
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  config?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    // Handle error response
    if (error.response?.data) {
      return error.response.data;
    }
    // Handle network error
    return {
      success: false,
      message: error.message || 'Network error',
      data: null as T,
      errors: null,
    };
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string, config?: any) => apiRequest<T>('get', url, undefined, config),
  post: <T>(url: string, data?: any, config?: any) => apiRequest<T>('post', url, data, config),
  put: <T>(url: string, data?: any, config?: any) => apiRequest<T>('put', url, data, config),
  patch: <T>(url: string, data?: any, config?: any) => apiRequest<T>('patch', url, data, config),
  delete: <T>(url: string, config?: any) => apiRequest<T>('delete', url, undefined, config),
};
