/**
 * Tests for useExperience hook — Django API integration with static fallback.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExperience } from '../hooks/useExperience';
import { experiences as staticExperiences } from '../data/experience';
import type { Experience } from '../types';

vi.mock('../lib/api', () => ({
  getExperience: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getExperience } from '../lib/api';
const mockGetExperience = vi.mocked(getExperience);

describe('useExperience hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and static fallback data', () => {
    mockGetExperience.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useExperience());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(staticExperiences);
    expect(result.current.apiError).toBeNull();
  });

  it('updates data with API response on success and sets loading=false', async () => {
    const mockApiExperiences: Experience[] = [
      {
        id: 'api-lead-dev',
        role: 'Senior Backend Engineer (API)',
        company: 'Cloud Corp',
        companyUrl: 'https://example.com',
        period: '2026 - Present',
        start: '2026-01',
        end: 'present',
        location: 'Kathmandu, Nepal',
        type: 'fulltime',
        description: 'Building microservices in Django and FastAPI.',
        bullets: ['Architected distributed background task queue with Celery.'],
        tech: ['Python', 'Django', 'PostgreSQL', 'Redis'],
      },
    ];
    mockGetExperience.mockResolvedValue(mockApiExperiences);

    const { result } = renderHook(() => useExperience());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockApiExperiences);
    expect(result.current.data[0].role).toBe('Senior Backend Engineer (API)');
    expect(result.current.apiError).toBeNull();
  });

  it('passes type filter params to getExperience', async () => {
    mockGetExperience.mockResolvedValue(staticExperiences);

    const filterParams = { type: 'internship' };
    renderHook(() => useExperience(filterParams));

    expect(mockGetExperience).toHaveBeenCalledWith(
      filterParams,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('falls back to static data on API network failure', async () => {
    mockGetExperience.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useExperience());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticExperiences);
    expect(result.current.apiError).not.toBeNull();
    expect(result.current.apiError?.message).toBe('Network error');
  });

  it('falls back to static data on API 500 error', async () => {
    const serverError = new Error('Internal Server Error');
    mockGetExperience.mockRejectedValue(serverError);

    const { result } = renderHook(() => useExperience());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticExperiences);
    expect(result.current.apiError).not.toBeNull();
  });

  it('data is always defined (never undefined)', async () => {
    mockGetExperience.mockRejectedValue(new Error('Connection refused'));

    const { result } = renderHook(() => useExperience());

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('handles empty API list by keeping static data', async () => {
    mockGetExperience.mockResolvedValue([]);

    const { result } = renderHook(() => useExperience());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticExperiences);
    expect(result.current.apiError).toBeNull();
  });

  it('does not update state after unmount', async () => {
    let resolveExperience: (v: any) => void;
    mockGetExperience.mockReturnValue(
      new Promise((res) => {
        resolveExperience = res;
      })
    );

    const { result, unmount } = renderHook(() => useExperience());

    unmount();

    resolveExperience!([
      {
        id: 'unmounted-exp',
        role: 'Ghost Engineer',
        company: 'Ghost Co',
        location: 'Nowhere',
        type: 'freelance',
        bullets: [],
        tech: [],
      },
    ]);

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current.data).toEqual(staticExperiences);
  });
});
