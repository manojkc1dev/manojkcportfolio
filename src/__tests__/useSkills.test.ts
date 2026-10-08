/**
 * Tests for useSkills hook — Django API integration with static fallback.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSkills } from '../hooks/useSkills';
import { skillGroups as staticSkillGroups } from '../data/skills';
import type { SkillCategory } from '../types';

vi.mock('../lib/api', () => ({
  getSkills: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getSkills } from '../lib/api';
const mockGetSkills = vi.mocked(getSkills);

const mockApiCategories: SkillCategory[] = [
  {
    id: 'backend-cat',
    category: 'Backend & APIs',
    title: 'Backend Engineering',
    description: 'Server-side systems & APIs',
    skills: [
      {
        name: 'Python',
        proficiency: 'Advanced',
        level: 'advanced',
        highlight: true,
        years: 4,
      },
      {
        name: 'Django',
        proficiency: 'Advanced',
        level: 'expert',
        highlight: true,
        years: 3,
      },
    ],
  },
];

describe('useSkills hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and static fallback data', () => {
    mockGetSkills.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useSkills());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(staticSkillGroups);
    expect(result.current.apiError).toBeNull();
  });

  it('updates data with normalized API response on success and sets loading=false', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data[0].title).toBe('Backend Engineering');
    expect(result.current.data[0].skills[0].name).toBe('Python');
    expect(result.current.apiError).toBeNull();
  });

  it('falls back to static data on API network failure', async () => {
    mockGetSkills.mockRejectedValue(new Error('Network offline'));

    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticSkillGroups);
    expect(result.current.apiError).not.toBeNull();
    expect(result.current.apiError?.message).toBe('Network offline');
  });

  it('falls back to static data on API 500 error', async () => {
    const serverError = new Error('Internal Server Error');
    mockGetSkills.mockRejectedValue(serverError);

    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticSkillGroups);
    expect(result.current.apiError).not.toBeNull();
  });

  it('data is always defined (never undefined)', async () => {
    mockGetSkills.mockRejectedValue(new Error('Connection refused'));

    const { result } = renderHook(() => useSkills());

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('handles empty API list by keeping static data', async () => {
    mockGetSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticSkillGroups);
    expect(result.current.apiError).toBeNull();
  });

  it('does not update state after unmount', async () => {
    let resolveSkills: (v: any) => void;
    mockGetSkills.mockReturnValue(
      new Promise((res) => {
        resolveSkills = res;
      })
    );

    const { result, unmount } = renderHook(() => useSkills());

    unmount();

    resolveSkills!(mockApiCategories);

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current.data).toEqual(staticSkillGroups);
  });
});
