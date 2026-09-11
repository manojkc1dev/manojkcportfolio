import axiosInstance from '../lib/axios';

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

// Error types for better error handling
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// Custom error class
export class ApiError extends Error {
  type: ErrorType;
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Classify error based on status code and response
function classifyError(error: any): ErrorType {
  if (!error.response) {
    return ErrorType.NETWORK;
  }

  const status = error.response.status;

  if (status === 401) return ErrorType.AUTHENTICATION;
  if (status === 403) return ErrorType.AUTHORIZATION;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status >= 400 && status < 500) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;

  return ErrorType.UNKNOWN;
}

// Get user-friendly error message
function getErrorMessage(error: any): string {
  const type = classifyError(error);

  switch (type) {
    case ErrorType.NETWORK:
      return 'Network error. Please check your connection and try again.';
    case ErrorType.AUTHENTICATION:
      return 'Authentication required. Please log in.';
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.VALIDATION:
      return error.response?.data?.message || 'Invalid data provided. Please check your input.';
    case ErrorType.SERVER:
      return 'Server error. Please try again later.';
    default:
      return error.response?.data?.message || error.message || 'An unexpected error occurred.';
  }
}

// Generic API request wrapper with enhanced error handling
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
    const errorType = classifyError(error);
    const errorMessage = getErrorMessage(error);
    const statusCode = error.response?.status;
    const errors = error.response?.data?.errors || null;

    // Handle error response
    if (error.response?.data) {
      return {
        success: false,
        message: errorMessage,
        data: null as T,
        errors,
      };
    }

    // Handle network error
    return {
      success: false,
      message: errorMessage,
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
