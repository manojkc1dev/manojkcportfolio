/**
 * Tests for UsesPage and useUses hook — Django API integration, loading states, and fallbacks.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UsesPage } from '../pages/UsesPage';
import { useUses } from '../hooks/useUses';
import { usesData as staticUses } from '../data/uses';
import type { UseCategory } from '../data/uses';

vi.mock('../lib/api', () => ({
  getUses: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getUses } from '../lib/api';
const mockGetUses = vi.mocked(getUses);

const mockApiUses: UseCategory[] = [
  {
    title: 'Hardware & Rig',
    description: 'Custom engineering workstation',
    items: [
      {
        name: 'Custom Linux Rig',
        why: 'Bare metal kernel tuning and isolated Docker dev',
        link: 'https://ubuntu.com',
        tag: 'OS',
      },
    ],
  },
];

describe('useUses hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and static fallback data', () => {
    mockGetUses.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useUses());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(staticUses);
    expect(result.current.apiError).toBeNull();
  });

  it('updates data with API response on success and sets loading=false', async () => {
    mockGetUses.mockResolvedValue(mockApiUses);

    const { result } = renderHook(() => useUses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockApiUses);
    expect(result.current.data[0].title).toBe('Hardware & Rig');
    expect(result.current.apiError).toBeNull();
  });

  it('falls back to static usesData on API network error', async () => {
    mockGetUses.mockRejectedValue(new Error('Connection failed'));

    const { result } = renderHook(() => useUses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticUses);
    expect(result.current.apiError?.message).toBe('Connection failed');
  });

  it('falls back to static usesData on empty API response', async () => {
    mockGetUses.mockResolvedValue([]);

    const { result } = renderHook(() => useUses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(staticUses);
    expect(result.current.apiError).toBeNull();
  });
});

describe('UsesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while API is fetching', () => {
    mockGetUses.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <UsesPage />
      </MemoryRouter>
    );

    const skeleton = screen.getByLabelText(/Loading workspace setup/i);
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders API-provided categories and items on success', async () => {
    mockGetUses.mockResolvedValue(mockApiUses);

    render(
      <MemoryRouter>
        <UsesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading workspace setup/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Hardware & Rig')).toBeInTheDocument();
    expect(screen.getByText('Custom Linux Rig')).toBeInTheDocument();
    expect(screen.getByText(/Bare metal kernel tuning/i)).toBeInTheDocument();
  });

  it('falls back to static uses data on API failure', async () => {
    mockGetUses.mockRejectedValue(new Error('API 500 error'));

    render(
      <MemoryRouter>
        <UsesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading workspace setup/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(staticUses[0].title)).toBeInTheDocument();
    expect(screen.getByText(staticUses[0].items[0].name)).toBeInTheDocument();
  });
});
