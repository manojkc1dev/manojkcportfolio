import { api } from './api';

// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// Auth service
export const authService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    return api.post<AuthResponse>('/auth/auth/login/', credentials);
  },

  // Register
  register: async (data: RegisterData) => {
    return api.post<AuthResponse>('/auth/auth/register/', data);
  },

  // Logout
  logout: async () => {
    return api.post('/auth/auth/logout/');
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return api.post<{ access: string }>('/auth/auth/refresh/', { refresh: refreshToken });
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/users/me/');
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    return api.post('/auth/users/me/change-password/', data);
  },

  // Verify email
  verifyEmail: async (token: string) => {
    return api.post('/auth/auth/verify-email/', { token });
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return api.post('/auth/auth/forgot-password/', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    return api.post('/auth/auth/reset-password/', { token, password });
  },
};
