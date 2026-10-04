/**
 * Core HTTP Client for Django REST Framework API
 *
 * Provides a typed fetch wrapper with baseUrl resolution, query string serialization,
 * safe error normalization, and DRF error handling.
 *
 * Also exposes `authRequest` — a canonical mechanism for authenticated admin API
 * calls with automatic Bearer-token injection, single 401 retry with token refresh,
 * and safe cleanup on session expiry.
 */

export const DJANGO_API_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_DJANGO_API_URL || import.meta.env.VITE_BACKEND_API_URL || '')
    : '')
).replace(/\/+$/, '');

export const isDjangoConfigured: boolean = DJANGO_API_BASE_URL.length > 0;

/**
 * Normalized API Error preserving HTTP status code and server payload.
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isRateLimit(): boolean {
    return this.status === 429;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  token?: string | null;
}

export interface FullRequestOptions extends RequestOptions {
  method?: string;
  body?: any;
}

/**
 * Build a full URL with query parameters.
 */
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  baseUrl: string = DJANGO_API_BASE_URL
): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  return url;
}

/**
 * Extract human-readable error message from DRF error payload.
 */
function extractErrorMessage(data: any, status: number, statusText: string): string {
  if (data && typeof data === 'object') {
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;

    // Handle non_field_errors array
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      return String(data.non_field_errors[0]);
    }

    // Handle first field error
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val) && val.length > 0) {
        return `${key}: ${val[0]}`;
      }
      if (typeof val === 'string') {
        return `${key}: ${val}`;
      }
    }
  }

  if (status === 429) {
    return 'Request limit exceeded. Please try again later.';
  }

  return `HTTP ${status}: ${statusText || 'Request failed'}`;
}

/**
 * Generic request executor.
 */
export async function request<T>(
  endpoint: string,
  options: FullRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, params, headers = {}, signal, token } = options;

  const url = buildUrl(endpoint, params);

  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  let reqBody: string | undefined;
  if (body !== undefined && body !== null) {
    reqHeaders['Content-Type'] = 'application/json';
    reqBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: reqBody,
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : 'Network connection failed';
    throw new ApiError(msg, 0, null);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Parse JSON response safely
  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const errorMsg = extractErrorMessage(data, response.status, response.statusText);
    throw new ApiError(errorMsg, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Authenticated Admin API client
// ---------------------------------------------------------------------------
// Lazy-imported token helpers to avoid circular dependencies at module load time.
// We import from djangoApi at call-time so tree-shaking is preserved.

/** Shared refresh promise — deduplicates concurrent 401 refresh attempts. */
let _refreshPromise: Promise<string> | null = null;

/**
 * Dispatch a custom DOM event to signal that the admin session has expired.
 * AdminPortal (or any listener) can react to this event to show the login screen.
 */
function notifySessionExpired(): void {
  try {
    window.dispatchEvent(new CustomEvent('portfolio_auth_unauthorized'));
  } catch {
    // Not in a browser context (e.g., tests) — no-op.
  }
}

/**
 * Perform a single token-refresh attempt.
 * Returns the new access token or throws if refresh fails.
 * Deduplicates concurrent callers: only one actual refresh request is made.
 */
async function performTokenRefresh(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    // Import lazily to avoid circular module dependency.
    const { getDjangoRefreshToken, setDjangoTokens, clearDjangoTokens } = await import(
      '../djangoApi'
    ).catch(
      () => ({ getDjangoRefreshToken: (): string | null => null, setDjangoTokens: () => {}, clearDjangoTokens: () => {} })
    );

    const refreshToken = getDjangoRefreshToken?.();
    if (!refreshToken) {
      clearDjangoTokens?.();
      notifySessionExpired();
      throw new ApiError('No refresh token available — session expired.', 401, null);
    }

    const data = await request<{ access: string; refresh?: string }>(
      '/api/v1/auth/token/refresh/',
      { method: 'POST', body: { refresh: refreshToken } }
    );

    if (!data?.access) {
      clearDjangoTokens?.();
      notifySessionExpired();
      throw new ApiError('Token refresh returned no access token.', 401, null);
    }

    setDjangoTokens?.(data.access, data.refresh);
    return data.access;
  })().finally(() => {
    _refreshPromise = null;
  });

  return _refreshPromise;
}

/**
 * Execute an authenticated admin API request.
 *
 * - Reads the current access token from storage and injects it as `Authorization: Bearer`.
 * - On HTTP 401: attempts a single token refresh then retries the original request.
 * - On refresh failure: clears auth state and dispatches `portfolio_auth_unauthorized`.
 * - Never performs more than one refresh cycle per original request (no loops).
 * - Multiple concurrent 401s share a single refresh promise.
 */
export async function authRequest<T>(
  endpoint: string,
  options: FullRequestOptions = {}
): Promise<T> {
  // Lazy-import to avoid circular dependency at module load time.
  const { getDjangoAccessToken, clearDjangoTokens } = await import('../djangoApi').catch(
    () => ({ getDjangoAccessToken: (): string | null => null, clearDjangoTokens: () => {} })
  );

  const accessToken = getDjangoAccessToken?.();

  try {
    return await request<T>(endpoint, {
      ...options,
      token: accessToken || options.token,
    });
  } catch (err) {
    // Only intercept 401 Unauthorized — let all other errors propagate normally.
    if (!(err instanceof ApiError) || err.status !== 401) throw err;

    // Attempt a single token refresh.
    let newToken: string;
    try {
      newToken = await performTokenRefresh();
    } catch (refreshErr) {
      // Refresh failed — auth state already cleared inside performTokenRefresh.
      clearDjangoTokens?.();
      notifySessionExpired();
      throw refreshErr;
    }

    // Retry the original request exactly once with the fresh token.
    return request<T>(endpoint, {
      ...options,
      token: newToken,
    });
  }
}

/**
 * Convenience object mirroring `apiClient` but using `authRequest` for all calls.
 * Use this for any authenticated admin endpoint instead of the plain `apiClient`.
 */
export const adminApiClient = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    authRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    authRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    authRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    authRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    authRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
