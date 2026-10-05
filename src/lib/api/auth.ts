/**
 * Authentication Client for Django REST Framework SimpleJWT
 *
 * Integrates with Django SimpleJWT endpoints for login, token refresh, verification,
 * logout, and password updates.
 */

import { apiClient, adminApiClient, type RequestOptions } from './client';
import {
  getDjangoAccessToken,
  getDjangoRefreshToken,
  setDjangoTokens,
  clearDjangoTokens,
  type DjangoAuthResponse,
} from '../djangoApi';

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export interface UserProfileResponse {
  id: number | string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

/**
 * Authenticate with email/username and password.
 * POST /api/v1/auth/token/
 */
export async function loginWithCredentials(
  usernameOrEmail: string,
  pass: string,
  remember = true
): Promise<DjangoAuthResponse> {
  const payload = {
    username: usernameOrEmail.trim(),
    email: usernameOrEmail.trim(),
    password: pass,
  };

  const data = await apiClient.post<DjangoAuthResponse>('/api/v1/auth/token/', payload);
  if (data.access) {
    setDjangoTokens(data.access, data.refresh, remember);
  }
  return data;
}

/**
 * Refresh access token using refresh token.
 * POST /api/v1/auth/token/refresh/
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenRefreshResponse> {
  const data = await apiClient.post<TokenRefreshResponse>('/api/v1/auth/token/refresh/', {
    refresh: refreshToken,
  });
  if (data.access) {
    setDjangoTokens(data.access, data.refresh);
  }
  return data;
}

/**
 * Verify access token validity.
 * POST /api/v1/auth/token/verify/
 */
export function verifyAccessToken(token: string): Promise<Record<string, never>> {
  return apiClient.post<Record<string, never>>('/api/v1/auth/token/verify/', { token });
}

/**
 * Blacklist refresh token and clear client-side stored tokens.
 * POST /api/v1/auth/logout/
 */
export async function logout(refreshToken?: string): Promise<void> {
  if (refreshToken) {
    try {
      await apiClient.post('/api/v1/auth/logout/', { refresh: refreshToken });
    } catch {
      // Ignore network failures on logout; clear local state regardless
    }
  }
  clearDjangoTokens();
}

/**
 * Retrieve authenticated user profile.
 * GET /api/v1/auth/me/
 * Uses adminApiClient so the request benefits from automatic 401 retry with refresh.
 */
export function getCurrentUser(token?: string, options?: RequestOptions): Promise<UserProfileResponse> {
  const authToken = token || getDjangoAccessToken();
  return adminApiClient.get<UserProfileResponse>('/api/v1/auth/me/', {
    ...options,
    token: authToken,
  });
}

/**
 * Change administrator password.
 * POST /api/v1/auth/change-password/
 * Uses adminApiClient so the request benefits from automatic 401 retry with refresh.
 */
export function updatePassword(
  oldPassword: string,
  newPassword: string,
  token?: string,
  options?: RequestOptions
): Promise<{ detail?: string; message?: string }> {
  const authToken = token || getDjangoAccessToken();
  return adminApiClient.post<{ detail?: string; message?: string }>(
    '/api/v1/auth/change-password/',
    {
      old_password: oldPassword,
      new_password: newPassword,
    },
    {
      ...options,
      token: authToken,
    }
  );
}

/**
 * Request password reset instructions.
 * POST /api/v1/auth/password-reset/
 */
export async function requestPasswordReset(
  email: string,
  options?: RequestOptions
): Promise<{ detail: string }> {
  return apiClient.post<{ detail: string }>(
    '/api/v1/auth/password-reset/',
    { email: email.trim() },
    options
  );
}

/**
 * Confirm password reset with token.
 * POST /api/v1/auth/password-reset/confirm/
 */
export async function confirmPasswordReset(
  uid: string,
  token: string,
  newPass: string,
  options?: RequestOptions
): Promise<{ detail: string }> {
  return apiClient.post<{ detail: string }>(
    '/api/v1/auth/password-reset/confirm/',
    {
      uid,
      token,
      new_password: newPass,
    },
    options
  );
}

// Token helper re-exports
export const getAccessToken = getDjangoAccessToken;
export const getRefreshToken = getDjangoRefreshToken;
export const setTokens = setDjangoTokens;
export const clearTokens = clearDjangoTokens;
