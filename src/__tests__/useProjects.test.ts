/**
 * Tests for useProjects and useProject hooks — Django API integration with static fallback.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from '../hooks/useProjects';
import { useProject } from '../hooks/useProject';
import { projects as staticProjects } from '../data/projects';
import type { Project } from '../types';

vi.mock('../lib/api', () => ({
  getProjects: vi.fn(),
  getProject: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getProjects, getProject } from '../lib/api';
const mockGetProjects = vi.mocked(getProjects);
const mockGetProject = vi.mocked(getProject);

describe('useProjects hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and static fallback data', () => {
    mockGetProjects.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(staticProjects);
    expect(result.current.apiError).toBeNull();
  });

  it('updates data with API response on success and sets loading=false', async () => {
    const mockApiProjects: Project[] = [
      {
        ...staticProjects[0],
        title: 'Custom API Project Title',
      },
    ];
    mockGetProjects.mockResolvedValue(mockApiProjects);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockApiProjects);
    expect(result.current.data[0].title).toBe('Custom API Project Title');
    expect(result.current.apiError).toBeNull();
  });

  it('passes category and featured filter params to getProjects', async () => {
    mockGetProjects.mockResolvedValue(staticProjects);

    const filterParams = { category: 'django', featured: true };
    renderHook(() => useProjects(filterParams));

    expect(mockGetProjects).toHaveBeenCalledWith(
      filterParams,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('falls back to static data on API network failure', async () => {
    mockGetProjects.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticProjects);
    expect(result.current.apiError).not.toBeNull();
    expect(result.current.apiError?.message).toBe('Network error');
  });

  it('falls back to static data on API 500 error', async () => {
    mockGetProjects.mockRejectedValue(new Error('Internal Server Error'));

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticProjects);
    expect(result.current.apiError).not.toBeNull();
  });

  it('handles empty API list by keeping static data', async () => {
    mockGetProjects.mockResolvedValue([]);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // When empty array is returned, keeps static projects as fallback
    expect(result.current.data).toEqual(staticProjects);
    expect(result.current.apiError).toBeNull();
  });
});

describe('useProject hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns seeded static match synchronously and updates with API response', async () => {
    const slug = staticProjects[0].id;
    const apiDetailProject: Project = {
      ...staticProjects[0],
      title: 'Detailed API Project',
    };
    mockGetProject.mockResolvedValue(apiDetailProject);

    const { result } = renderHook(() => useProject(slug));

    // Initially matches static
    expect(result.current.data?.id).toBe(slug);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.title).toBe('Detailed API Project');
    expect(result.current.apiError).toBeNull();
  });

  it('falls back to static project data on API error', async () => {
    const slug = staticProjects[0].id;
    mockGetProject.mockRejectedValue(new Error('API failure'));

    const { result } = renderHook(() => useProject(slug));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticProjects[0]);
    expect(result.current.apiError?.message).toBe('API failure');
  });

  it('returns null when slug is not found in either API or static data', async () => {
    mockGetProject.mockRejectedValue(new Error('404 Not Found'));

    const { result } = renderHook(() => useProject('non-existent-slug'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
  });

  it('returns null immediately when slug is undefined', () => {
    const { result } = renderHook(() => useProject(undefined));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
