/**
 * Tests for useCurrentlyBuilding hook — Django API integration with static fallback.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCurrentlyBuilding } from '../hooks/useCurrentlyBuilding';
import { currentlyBuilding as staticCurrentlyBuilding, type CurrentItem } from '../data/currentlyBuilding';

vi.mock('../lib/api', () => ({
  getCurrentlyBuilding: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getCurrentlyBuilding } from '../lib/api';
const mockGetCurrentlyBuilding = vi.mocked(getCurrentlyBuilding);

const mockApiItems: CurrentItem[] = [
  {
    id: 'api-item-1',
    title: 'Celery Distributed Queues (API)',
    description: 'Real-time task dispatching with Redis.',
    status: 'active',
    progress: 85,
    since: 'Oct 2026',
  },
];

describe('useCurrentlyBuilding hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns static fallback data immediately on initial render', () => {
    mockGetCurrentlyBuilding.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCurrentlyBuilding());

    expect(result.current).toEqual(staticCurrentlyBuilding);
    expect(mockGetCurrentlyBuilding).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('replaces static fallback with API data after successful request', async () => {
    mockGetCurrentlyBuilding.mockResolvedValue(mockApiItems);

    const { result } = renderHook(() => useCurrentlyBuilding());

    await waitFor(() => {
      expect(result.current).toEqual(mockApiItems);
    });

    expect(result.current[0].title).toBe('Celery Distributed Queues (API)');
  });

  it('preserves static fallback on API network failure', async () => {
    mockGetCurrentlyBuilding.mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useCurrentlyBuilding());

    await waitFor(() => {
      expect(mockGetCurrentlyBuilding).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual(staticCurrentlyBuilding);
  });

  it('preserves static fallback on API 500 error without throwing', async () => {
    mockGetCurrentlyBuilding.mockRejectedValue(new Error('500 Internal Server Error'));

    const { result } = renderHook(() => useCurrentlyBuilding());

    await waitFor(() => {
      expect(mockGetCurrentlyBuilding).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual(staticCurrentlyBuilding);
  });

  it('handles empty API response by preserving static data', async () => {
    mockGetCurrentlyBuilding.mockResolvedValue([]);

    const { result } = renderHook(() => useCurrentlyBuilding());

    await waitFor(() => {
      expect(mockGetCurrentlyBuilding).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual(staticCurrentlyBuilding);
  });

  it('does not update state after unmount', async () => {
    let resolveItems: (v: CurrentItem[]) => void;
    mockGetCurrentlyBuilding.mockReturnValue(
      new Promise((res) => {
        resolveItems = res;
      })
    );

    const { result, unmount } = renderHook(() => useCurrentlyBuilding());

    unmount();

    resolveItems!(mockApiItems);

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current).toEqual(staticCurrentlyBuilding);
  });
});
