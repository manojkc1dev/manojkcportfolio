/**
 * Tests for useProfile hook — Django API integration with static fallback.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from '../hooks/useProfile';
import { profile as staticProfile } from '../data/profile';

// Mock the API module so we can control what getProfile resolves/rejects with.
vi.mock('../lib/api', () => ({
  getProfile: vi.fn(),
  getResumeDownloadUrl: vi.fn(() => 'http://localhost:8000/api/v1/resume/download/'),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getProfile } from '../lib/api';
const mockGetProfile = vi.mocked(getProfile);

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and static fallback data', () => {
    // getProfile never resolves during this synchronous check
    mockGetProfile.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(staticProfile);
    expect(result.current.apiError).toBeNull();
  });

  it('updates data with API response on success and sets loading=false', async () => {
    const apiProfile = {
      ...staticProfile,
      name: 'Manoj Khatri (API)',
      email: 'api@example.com',
      location: 'Remote, Nepal',
    };
    mockGetProfile.mockResolvedValue(apiProfile);

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.name).toBe('Manoj Khatri (API)');
    expect(result.current.data.email).toBe('api@example.com');
    expect(result.current.data.location).toBe('Remote, Nepal');
    expect(result.current.apiError).toBeNull();
  });

  it('falls back to static data on API network failure', async () => {
    mockGetProfile.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Should stay on static fallback — never empty
    expect(result.current.data).toEqual(staticProfile);
    expect(result.current.apiError).not.toBeNull();
    expect(result.current.apiError?.message).toBe('Network error');
  });

  it('falls back to static data on API 500 error', async () => {
    const serverError = new Error('Internal Server Error');
    mockGetProfile.mockRejectedValue(serverError);

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticProfile);
    expect(result.current.apiError).not.toBeNull();
  });

  it('data is always the static profile when API is down (never undefined)', async () => {
    mockGetProfile.mockRejectedValue(new Error('Connection refused'));

    const { result } = renderHook(() => useProfile());

    // Even before the hook settles, data should not be undefined
    expect(result.current.data).toBeDefined();
    expect(result.current.data.name).toBeTruthy();
    expect(result.current.data.email).toBeTruthy();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(result.current.data.name).toBeTruthy();
  });

  it('does not update state after unmount (no state-update-on-unmounted-component warning)', async () => {
    let resolveProfile: (v: any) => void;
    mockGetProfile.mockReturnValue(
      new Promise((res) => {
        resolveProfile = res;
      })
    );

    const { result, unmount } = renderHook(() => useProfile());

    // Unmount before the promise resolves
    unmount();

    // Now resolve — should not throw or warn about state updates
    resolveProfile!({ ...staticProfile, name: 'Post-unmount update' });

    // Give a tick for any potential microtask to run
    await new Promise((r) => setTimeout(r, 10));

    // The last captured result should still be the initial static value
    expect(result.current.data).toEqual(staticProfile);
  });
});
