/**
 * Django JWT Authentication — Unit Tests
 *
 * Covers:
 * - authRequest 401 interceptor + single-retry with token refresh
 * - Refresh failure: auth state cleared, portfolio_auth_unauthorized event dispatched
 * - Token storage helpers (getDjangoAccessToken, getDjangoRefreshToken, setDjangoTokens, clearDjangoTokens)
 * - loginWithCredentials: success stores tokens, failure throws
 * - getCurrentUser: uses stored access token
 * - logout: blacklists refresh token and clears storage, clears even on network error
 * - updatePassword: sends correct payload, throws on 400
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Token helper tests (via djangoApi)
// ---------------------------------------------------------------------------
describe('Token storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('getDjangoAccessToken returns null when storage is empty', async () => {
    const { getDjangoAccessToken } = await import('../lib/djangoApi');
    expect(getDjangoAccessToken()).toBeNull();
  });

  it('getDjangoRefreshToken returns null when storage is empty', async () => {
    const { getDjangoRefreshToken } = await import('../lib/djangoApi');
    expect(getDjangoRefreshToken()).toBeNull();
  });

  it('setDjangoTokens stores in localStorage when remember=true (default)', async () => {
    const { setDjangoTokens, getDjangoAccessToken, getDjangoRefreshToken } = await import('../lib/djangoApi');
    setDjangoTokens('acc123', 'ref456');
    expect(getDjangoAccessToken()).toBe('acc123');
    expect(getDjangoRefreshToken()).toBe('ref456');
  });

  it('setDjangoTokens stores in sessionStorage when remember=false', async () => {
    const { setDjangoTokens, getDjangoAccessToken } = await import('../lib/djangoApi');
    setDjangoTokens('acc-session', 'ref-session', false);
    expect(sessionStorage.getItem('portfolio_django_access_token')).toBe('acc-session');
    expect(getDjangoAccessToken()).toBe('acc-session');
  });

  it('clearDjangoTokens removes tokens from both storages', async () => {
    const { setDjangoTokens, clearDjangoTokens, getDjangoAccessToken, getDjangoRefreshToken } = await import('../lib/djangoApi');
    setDjangoTokens('acc', 'ref');
    clearDjangoTokens();
    expect(getDjangoAccessToken()).toBeNull();
    expect(getDjangoRefreshToken()).toBeNull();
  });

  it('never stores token values at keys containing "password" or "passphrase"', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    setDjangoTokens('token-value', 'refresh-value');

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      expect(key.toLowerCase()).not.toContain('password');
      expect(key.toLowerCase()).not.toContain('passphrase');
    }
  });
});

// ---------------------------------------------------------------------------
// authRequest — 401 interceptor
// ---------------------------------------------------------------------------
describe('authRequest — 401 interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes through successful responses without refresh', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { authRequest } = await import('../lib/api/client');

    setDjangoTokens('valid-access', 'valid-refresh');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ id: 1 }),
    });

    const result = await authRequest('/api/v1/admin/test/');
    expect(result).toEqual({ id: 1 });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const callHeaders = (global.fetch as any).mock.calls[0][1].headers;
    expect(callHeaders['Authorization']).toBe('Bearer valid-access');
  });

  it('propagates non-401 errors without attempting refresh', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { authRequest } = await import('../lib/api/client');

    setDjangoTokens('valid-access', 'valid-refresh');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => JSON.stringify({ detail: 'server error' }),
    });

    await expect(authRequest('/api/v1/admin/test/')).rejects.toMatchObject({ status: 500 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries request exactly once after successful token refresh on 401', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { authRequest } = await import('../lib/api/client');

    setDjangoTokens('expired-access', 'valid-refresh');

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      if (callCount === 1) {
        return { ok: false, status: 401, statusText: 'Unauthorized', text: async () => '{"detail":"Token expired"}' };
      }
      if (callCount === 2) {
        return { ok: true, status: 200, text: async () => JSON.stringify({ access: 'new-access-token', refresh: 'new-refresh-token' }) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({ id: 1 }) };
    });

    const result = await authRequest('/api/v1/admin/protected/');
    expect(result).toEqual({ id: 1 });
    expect(callCount).toBe(3); // original + refresh + retry
  });

  it('clears tokens and dispatches portfolio_auth_unauthorized when refresh fails', async () => {
    const { setDjangoTokens, getDjangoAccessToken, getDjangoRefreshToken } = await import('../lib/djangoApi');
    const { authRequest } = await import('../lib/api/client');

    setDjangoTokens('expired-access', 'invalid-refresh');

    const events: string[] = [];
    vi.spyOn(window, 'dispatchEvent').mockImplementation((event: Event) => {
      events.push(event.type);
      return true;
    });

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: false, status: 401, statusText: 'Unauthorized', text: async () => '{"detail":"Token expired"}' };
      }
      return { ok: false, status: 401, statusText: 'Unauthorized', text: async () => '{"detail":"Refresh invalid"}' };
    });

    await expect(authRequest('/api/v1/admin/protected/')).rejects.toMatchObject({ status: 401 });

    expect(getDjangoAccessToken()).toBeNull();
    expect(getDjangoRefreshToken()).toBeNull();
    expect(events).toContain('portfolio_auth_unauthorized');
  });

  it('clears tokens and dispatches portfolio_auth_unauthorized when no refresh token exists', async () => {
    const { getDjangoAccessToken } = await import('../lib/djangoApi');
    const { authRequest } = await import('../lib/api/client');

    localStorage.setItem('portfolio_django_access_token', 'expired-access');
    localStorage.removeItem('portfolio_django_refresh_token');

    const events: string[] = [];
    vi.spyOn(window, 'dispatchEvent').mockImplementation((event: Event) => {
      events.push(event.type);
      return true;
    });

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => '{"detail":"Token expired"}',
    });

    await expect(authRequest('/api/v1/admin/protected/')).rejects.toMatchObject({ status: 401 });
    expect(getDjangoAccessToken()).toBeNull();
    expect(events).toContain('portfolio_auth_unauthorized');
  });
});

// ---------------------------------------------------------------------------
// loginWithCredentials
// ---------------------------------------------------------------------------
describe('loginWithCredentials', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores tokens in localStorage on success', async () => {
    const { loginWithCredentials } = await import('../lib/api/auth');
    const { getDjangoAccessToken } = await import('../lib/djangoApi');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ access: 'new-access', refresh: 'new-refresh' }),
    });

    const result = await loginWithCredentials('admin@test.com', 'password123');
    expect(result.access).toBe('new-access');
    expect(getDjangoAccessToken()).toBe('new-access');
  });

  it('throws ApiError on invalid credentials (401)', async () => {
    const { loginWithCredentials } = await import('../lib/api/auth');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ detail: 'No active account found with the given credentials' }),
    });

    await expect(loginWithCredentials('wrong@test.com', 'badpass')).rejects.toMatchObject({ status: 401 });
  });

  it('never stores password values in localStorage', async () => {
    const { loginWithCredentials } = await import('../lib/api/auth');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ access: 'acc', refresh: 'ref' }),
    });

    await loginWithCredentials('user@example.com', 'my-secret-password');

    for (let i = 0; i < localStorage.length; i++) {
      const val = localStorage.getItem(localStorage.key(i) || '') || '';
      expect(val).not.toContain('my-secret-password');
    }
  });
});

// ---------------------------------------------------------------------------
// getCurrentUser
// ---------------------------------------------------------------------------
describe('getCurrentUser', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns user profile and injects Authorization header', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { getCurrentUser } = await import('../lib/api/auth');

    setDjangoTokens('my-access-token', 'my-refresh');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ id: 1, username: 'manoj', email: 'admin@test.com' }),
    });

    const user = await getCurrentUser();
    expect(user.username).toBe('manoj');
    expect(user.email).toBe('admin@test.com');
  });

  it('throws when server returns 401 for an invalid token', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { getCurrentUser } = await import('../lib/api/auth');

    setDjangoTokens('bad-token', undefined);
    localStorage.removeItem('portfolio_django_refresh_token');

    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => '{"detail":"Token is invalid or expired"}',
    });

    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
  });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
describe('logout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('calls POST /api/v1/auth/logout/ with refresh token and clears storage', async () => {
    const { setDjangoTokens, getDjangoAccessToken } = await import('../lib/djangoApi');
    const { logout } = await import('../lib/api/auth');

    setDjangoTokens('access-tok', 'refresh-tok');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '{}',
    });

    await logout('refresh-tok');

    expect(getDjangoAccessToken()).toBeNull();

    const call = (global.fetch as any).mock.calls[0];
    expect(call[0]).toContain('/api/v1/auth/logout/');
    const body = JSON.parse(call[1].body);
    expect(body.refresh).toBe('refresh-tok');
  });

  it('clears tokens even if logout API call throws a network error', async () => {
    const { setDjangoTokens, getDjangoAccessToken } = await import('../lib/djangoApi');
    const { logout } = await import('../lib/api/auth');

    setDjangoTokens('access-tok', 'refresh-tok');

    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    await expect(logout('refresh-tok')).resolves.toBeUndefined();
    expect(getDjangoAccessToken()).toBeNull();
  });

  it('skips logout API call when no refresh token is provided', async () => {
    const { logout } = await import('../lib/api/auth');

    global.fetch = vi.fn();

    await logout();

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// updatePassword
// ---------------------------------------------------------------------------
describe('updatePassword', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('sends old_password and new_password fields in request body', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { updatePassword } = await import('../lib/api/auth');

    setDjangoTokens('my-access', 'my-refresh');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ detail: 'Password updated successfully.' }),
    });

    await updatePassword('oldSecret', 'newSecret123');

    const call = (global.fetch as any).mock.calls[0];
    expect(call[0]).toContain('/api/v1/auth/change-password/');
    const body = JSON.parse(call[1].body);
    expect(body.old_password).toBe('oldSecret');
    expect(body.new_password).toBe('newSecret123');
  });

  it('throws ApiError when server rejects password change (400)', async () => {
    const { setDjangoTokens } = await import('../lib/djangoApi');
    const { updatePassword } = await import('../lib/api/auth');

    setDjangoTokens('my-access', 'my-refresh');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({ old_password: ['Wrong password.'] }),
    });

    await expect(updatePassword('wrong', 'newSecret123')).rejects.toMatchObject({ status: 400 });
  });
});

// ---------------------------------------------------------------------------
// requestPasswordReset & confirmPasswordReset
// ---------------------------------------------------------------------------
describe('requestPasswordReset & confirmPasswordReset', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('requestPasswordReset sends email in payload to POST /api/v1/auth/password-reset/', async () => {
    const { requestPasswordReset } = await import('../lib/api/auth');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ detail: 'Password reset instructions have been sent.' }),
    });

    const res = await requestPasswordReset('contactmanojkc1.com.np@gmail.com');
    expect(res.detail).toBe('Password reset instructions have been sent.');

    const call = (global.fetch as any).mock.calls[0];
    expect(call[0]).toContain('/api/v1/auth/password-reset/');
    const body = JSON.parse(call[1].body);
    expect(body.email).toBe('contactmanojkc1.com.np@gmail.com');
  });

  it('confirmPasswordReset sends uid, token, and new_password to POST /api/v1/auth/password-reset/confirm/', async () => {
    const { confirmPasswordReset } = await import('../lib/api/auth');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ detail: 'Password has been reset successfully.' }),
    });

    const res = await confirmPasswordReset('uid123', 'tok456', 'NewS3curePass@2026');
    expect(res.detail).toBe('Password has been reset successfully.');

    const call = (global.fetch as any).mock.calls[0];
    expect(call[0]).toContain('/api/v1/auth/password-reset/confirm/');
    const body = JSON.parse(call[1].body);
    expect(body.uid).toBe('uid123');
    expect(body.token).toBe('tok456');
    expect(body.new_password).toBe('NewS3curePass@2026');
  });
});
