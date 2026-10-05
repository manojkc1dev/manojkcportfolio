/**
 * Django REST Framework (DRF) + SimpleJWT Integration Client
 *
 * Enables Manoj Khatri's portfolio to authenticate against and manage data
 * through a custom Python/Django backend API with JWT Authentication and RBAC.
 */

export interface DjangoAuthResponse {
  access: string;
  refresh?: string;
  user?: {
    id: number | string;
    username: string;
    email: string;
    is_staff?: boolean;
    is_superuser?: boolean;
  };
}

export const DJANGO_API_BASE_URL: string =
  (import.meta.env.VITE_DJANGO_API_URL ||
    import.meta.env.VITE_BACKEND_API_URL ||
    '').replace(/\/+$/, '');

export const isDjangoConfigured: boolean = DJANGO_API_BASE_URL.length > 0;

const TOKEN_KEY = 'portfolio_django_access_token';
const REFRESH_KEY = 'portfolio_django_refresh_token';

export function getDjangoAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getDjangoRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
}

export function setDjangoTokens(access: string, refresh?: string, remember = true): void {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, access);
  if (refresh) {
    storage.setItem(REFRESH_KEY, refresh);
  }
}

export function clearDjangoTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

/**
 * Authenticate against Django REST Framework SimpleJWT endpoint
 * Supported endpoints: /api/token/ or /api/auth/login/
 */
export async function loginWithDjango(
  usernameOrEmail: string,
  pass: string
): Promise<DjangoAuthResponse> {
  if (!isDjangoConfigured) {
    throw new Error(
      'Django backend URL is not configured. Please set VITE_DJANGO_API_URL in your environment.'
    );
  }

  // Attempt standard SimpleJWT /api/token/ or fallback /api/auth/login/
  const endpoints = ['/api/token/', '/api/auth/login/'];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: usernameOrEmail.trim(),
          email: usernameOrEmail.trim(),
          password: pass,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const access = data.access || data.token || data.key;
        if (access) {
          setDjangoTokens(access, data.refresh);
          return { access, refresh: data.refresh, user: data.user };
        }
      }

      if (response.status === 401 || response.status === 400) {
        const errJson = await response.json().catch(() => ({}));
        const detail =
          errJson.detail ||
          errJson.non_field_errors?.[0] ||
          errJson.message ||
          'Invalid credentials provided for Django authentication.';
        throw new Error(detail);
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // If unauthorized, do not retry secondary endpoint
      if (lastError.message.includes('Invalid credentials')) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Failed to connect to Django API backend.');
}

/**
 * Change administrator password via Django REST API
 * Expected endpoint: POST /api/auth/change-password/ with JWT Bearer header
 */
export async function changeDjangoPassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const token = getDjangoAccessToken();
  if (!token) {
    throw new Error('No active Django authentication token found.');
  }

  const response = await fetch(`${DJANGO_API_BASE_URL}/api/auth/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(
      errJson.detail ||
        errJson.old_password?.[0] ||
        errJson.message ||
        'Django backend rejected the password change request.'
    );
  }
}
