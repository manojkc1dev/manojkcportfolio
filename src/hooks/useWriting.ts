/**
 * useWriting & useArticle — Django API-backed article hooks with static fallback.
 *
 * Calls GET /api/v1/articles/ and GET /api/v1/articles/<slug>/ via canonical client.
 * On success, the Django response becomes the authoritative source.
 * On API failure or empty response, falls back gracefully to src/data/writing.ts.
 *
 * Rules:
 * - Never exposes raw API errors to visitors.
 * - Cancels the in-flight request on unmount via AbortController.
 */

import { useState, useEffect } from 'react';
import { getArticles, getArticle } from '../lib/api';
import type { ArticleFilterParams } from '../lib/api/public';
import { posts as staticPosts, type Post } from '../data/writing';
import type { ArticleSummary, ArticleDetail } from '../types';

export interface UseWritingResult {
  /** Resolved articles list — falls back to static posts if API is empty/fails. */
  data: ArticleSummary[];
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /** Dev-mode only error; not exposed to visitors. */
  apiError: Error | null;
}

export interface UseArticleResult {
  /** Resolved article detail, or null if not found. */
  data: ArticleDetail | null;
  /** True while the initial API request is in-flight. */
  loading: boolean;
  /** Dev-mode only error; not exposed to visitors. */
  apiError: Error | null;
}

function mapPostToArticleSummary(post: Post): ArticleSummary {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    category: 'Engineering',
    date: post.date,
    publishedDate: null,
    featured: false,
    excerpt: post.excerpt,
    headerImage: post.coverImage,
    authorName: 'Manoj K.C.',
    authorRole: 'Backend Software Engineer',
    readingTime: post.readingTime,
    tags: post.tags || [],
  };
}

function mapPostToArticleDetail(post: Post): ArticleDetail {
  return {
    ...mapPostToArticleSummary(post),
    content: post.content,
  };
}

const staticArticleSummaries: ArticleSummary[] = staticPosts.map(mapPostToArticleSummary);

export function useWriting(
  params?: ArticleFilterParams,
  refreshKey?: number
): UseWritingResult {
  const [data, setData] = useState<ArticleSummary[]>(staticArticleSummaries);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  const paramsKey = params ? JSON.stringify(params) : '';

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    setLoading(true);

    getArticles(params, { signal: controller.signal })
      .then((apiArticles) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiArticles) && apiArticles.length > 0) {
          setData(apiArticles);
          setApiError(null);
        } else {
          // If empty array from API, fall back to static data
          setData(staticArticleSummaries);
        }
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn('[useWriting] API unavailable — using static fallback:', err.message);
        }
        setApiError(err);
        setData(staticArticleSummaries);
      })
      .finally(() => {
        if (!isCancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [paramsKey, refreshKey]);

  return { data, loading, apiError };
}

export function useArticle(slug: string | undefined): UseArticleResult {
  const staticMatch = slug
    ? staticPosts.find((p) => p.slug === slug)
    : undefined;
  const initialSeed = staticMatch ? mapPostToArticleDetail(staticMatch) : null;

  const [data, setData] = useState<ArticleDetail | null>(initialSeed);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    const staticFallback = staticPosts.find((p) => p.slug === slug);
    const fallbackDetail = staticFallback ? mapPostToArticleDetail(staticFallback) : null;
    setData(fallbackDetail);
    setLoading(true);

    let isCancelled = false;
    const controller = new AbortController();

    getArticle(slug, { signal: controller.signal })
      .then((apiArticle) => {
        if (isCancelled || controller.signal.aborted) return;
        setData(apiArticle);
        setApiError(null);
      })
      .catch((err: Error) => {
        if (isCancelled || controller.signal.aborted) return;
        if (import.meta.env.DEV) {
          console.warn(`[useArticle] API unavailable for "${slug}" — using fallback:`, err.message);
        }
        setApiError(err);
        setData(fallbackDetail);
      })
      .finally(() => {
        if (!isCancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [slug]);

  return { data, loading, apiError };
}
