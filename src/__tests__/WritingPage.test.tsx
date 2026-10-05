/**
 * Tests for WritingPage, WritingPostPage, and writing hooks — Django API integration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WritingPage } from '../pages/WritingPage';
import { WritingPostPage } from '../pages/WritingPostPage';
import { useWriting, useArticle } from '../hooks/useWriting';
import type { ArticleSummary, ArticleDetail } from '../types';

vi.mock('../lib/api', () => ({
  getArticles: vi.fn(),
  getArticle: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getArticles, getArticle } from '../lib/api';
const mockGetArticles = vi.mocked(getArticles);
const mockGetArticle = vi.mocked(getArticle);

const mockApiArticles: ArticleSummary[] = [
  {
    id: 'pg-indexes-deep-dive',
    slug: 'pg-indexes-deep-dive',
    title: 'Mastering PostgreSQL B-Tree & GIN Indexing',
    category: 'Database Architecture',
    date: 'Oct 2026',
    publishedDate: '2026-10-01',
    featured: true,
    excerpt: 'Comprehensive guide to indexing strategy in Django and PostgreSQL.',
    headerImage: '/images/pg.png',
    authorName: 'Manoj K.C.',
    authorRole: 'Backend Engineer',
    readingTime: 6,
    tags: ['postgresql', 'django', 'performance'],
  },
];

const mockApiArticleDetail: ArticleDetail = {
  ...mockApiArticles[0],
  content: '## Detailed Architecture Guide\n\nOptimizing query plans with composite indexes.',
};

describe('useWriting hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and updates with API articles on success', async () => {
    mockGetArticles.mockResolvedValue(mockApiArticles);

    const { result } = renderHook(() => useWriting());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockApiArticles);
    expect(result.current.apiError).toBeNull();
  });

  it('falls back to static posts on API failure', async () => {
    mockGetArticles.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useWriting());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(result.current.apiError?.message).toBe('Network error');
  });

  it('falls back to static posts on empty API array', async () => {
    mockGetArticles.mockResolvedValue([]);

    const { result } = renderHook(() => useWriting());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(result.current.apiError).toBeNull();
  });
});

describe('useArticle hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves detailed article by slug on success', async () => {
    mockGetArticle.mockResolvedValue(mockApiArticleDetail);

    const { result } = renderHook(() => useArticle('pg-indexes-deep-dive'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockApiArticleDetail);
    expect(result.current.data?.content).toContain('Detailed Architecture Guide');
    expect(result.current.apiError).toBeNull();
  });

  it('returns null when article is not found in either source', async () => {
    mockGetArticle.mockRejectedValue(new Error('404 Not Found'));

    const { result } = renderHook(() => useArticle('non-existent-article'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.apiError?.message).toBe('404 Not Found');
  });
});

describe('WritingPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while API request is in-flight', () => {
    mockGetArticles.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <WritingPage />
      </MemoryRouter>
    );

    const skeleton = screen.getByLabelText(/Loading technical writing/i);
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders article cards and tags when API returns articles', async () => {
    mockGetArticles.mockResolvedValue(mockApiArticles);

    render(
      <MemoryRouter>
        <WritingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical writing/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Mastering PostgreSQL B-Tree & GIN Indexing')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive guide to indexing strategy/i)).toBeInTheDocument();
    expect(screen.getByText('#postgresql')).toBeInTheDocument();
  });

  it('renders "Articles In The Oven" fallback state when no articles exist', async () => {
    mockGetArticles.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <WritingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical writing/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Articles In The Oven')).toBeInTheDocument();
  });
});

describe('WritingPostPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders article detail markdown content on success', async () => {
    mockGetArticle.mockResolvedValue(mockApiArticleDetail);

    render(
      <MemoryRouter initialEntries={['/writing/pg-indexes-deep-dive']}>
        <Routes>
          <Route path="/writing/:slug" element={<WritingPostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading article/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Mastering PostgreSQL B-Tree & GIN Indexing')).toBeInTheDocument();
    expect(screen.getByText('Detailed Architecture Guide')).toBeInTheDocument();
  });

  it('renders "Article Not Found" view when slug does not exist', async () => {
    mockGetArticle.mockRejectedValue(new Error('404 Not Found'));

    render(
      <MemoryRouter initialEntries={['/writing/missing-slug']}>
        <Routes>
          <Route path="/writing/:slug" element={<WritingPostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading article/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Article Not Found')).toBeInTheDocument();
  });
});
