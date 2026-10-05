import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  apiClient,
  ApiError,
  buildUrl,
  getProfile,
  getProjects,
  getProject,
  getServices,
  getService,
  getExperience,
  getExperienceDetail,
  getSkills,
  getArticles,
  getArticle,
  getUses,
  getCurrentlyBuilding,
  getActiveResumeData,
  getActiveResumeMetadata,
  getResumeDownloadUrl,
  submitInquiry,
} from '../lib/api';

describe('Django API Client Foundation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildUrl utility', () => {
    it('constructs basic endpoints with leading slash', () => {
      expect(buildUrl('api/v1/profile/')).toContain('/api/v1/profile/');
    });

    it('appends query parameters correctly', () => {
      const url = buildUrl('/api/v1/projects/', { category: 'backend', featured: true, empty: null });
      expect(url).toContain('/api/v1/projects/?category=backend&featured=true');
      expect(url).not.toContain('empty');
    });

    it('handles query parameters on URLs that already have a question mark', () => {
      const url = buildUrl('/api/v1/projects/?existing=1', { featured: true });
      expect(url).toContain('/api/v1/projects/?existing=1&featured=true');
    });
  });

  describe('HTTP Client core behavior', () => {
    it('handles successful JSON response', async () => {
      const mockData = { id: 'main', name: 'Manoj Khatri' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      });

      const result = await apiClient.get('/api/v1/profile/');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/profile/'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('handles 204 No Content empty responses safely without throwing', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text: async () => '',
      });

      const result = await apiClient.delete('/api/v1/auth/logout/');
      expect(result).toBeUndefined();
    });

    it('normalizes 400 Bad Request errors into ApiError', async () => {
      const errorPayload = { email: ['Enter a valid email address.'] };
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify(errorPayload),
      });

      await expect(apiClient.post('/api/v1/inquiries/', {})).rejects.toThrow(ApiError);

      try {
        await apiClient.post('/api/v1/inquiries/', {});
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(400);
        expect(err.isClientError).toBe(true);
        expect(err.isRateLimit).toBe(false);
        expect(err.message).toContain('email: Enter a valid email address.');
        expect(err.data).toEqual(errorPayload);
      }
    });

    it('normalizes 429 Too Many Requests rate-limit errors', async () => {
      const errorPayload = { detail: 'Request was throttled. Expected available In 3600 seconds.' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: async () => JSON.stringify(errorPayload),
      });

      try {
        await submitInquiry({
          name: 'Spam User',
          email: 'spam@example.com',
          message: 'Repeated inquiries test message.',
        });
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(429);
        expect(err.isRateLimit).toBe(true);
        expect(err.message).toContain('Request was throttled');
      }
    });

    it('normalizes 500 Internal Server Error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => JSON.stringify({ detail: 'Database connection failed' }),
      });

      try {
        await apiClient.get('/api/v1/projects/');
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(500);
        expect(err.isServerError).toBe(true);
        expect(err.message).toContain('Database connection failed');
      }
    });

    it('handles network failure (fetch throws TypeError/Error)', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch (DNS error)'));

      try {
        await apiClient.get('/api/v1/profile/');
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(0);
        expect(err.message).toContain('Failed to fetch');
      }
    });

    it('supports AbortSignal cancellation', async () => {
      const controller = new AbortController();
      global.fetch = vi.fn().mockImplementation((_url, init) => {
        if (init?.signal?.aborted) {
          return Promise.reject(new DOMException('The user aborted a request.', 'AbortError'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          text: async () => JSON.stringify([]),
        });
      });

      controller.abort();
      await expect(apiClient.get('/api/v1/projects/', { signal: controller.signal })).rejects.toThrow();
    });
  });

  describe('Public API endpoints', () => {
    it('getProfile calls GET /api/v1/profile/', async () => {
      const mockProfile = { id: 'main', name: 'Manoj Khatri', stats: [], socials: [] };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockProfile),
      });

      const profile = await getProfile();
      expect(profile).toEqual(mockProfile);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/profile/'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('getProjects formats query parameters for filtering', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getProjects({ category: 'backend', featured: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/projects/?category=backend&featured=true'),
        expect.any(Object)
      );
    });

    it('getProject constructs slug-based detail endpoint', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 'agritech', title: 'Agritech' }),
      });

      await getProject('agritech');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/projects/agritech/'),
        expect.any(Object)
      );
    });

    it('getServices supports featured filter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getServices({ featured: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/services/?featured=true'),
        expect.any(Object)
      );
    });

    it('getService fetches single service by slug', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 'api-arch' }),
      });

      await getService('api-arch');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/services/api-arch/'),
        expect.any(Object)
      );
    });

    it('getExperience supports type filter and detail fetching', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getExperience({ type: 'internship' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/experience/?type=internship'),
        expect.any(Object)
      );

      await getExperienceDetail('sajha-infotech');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/experience/sajha-infotech/'),
        expect.any(Object)
      );
    });

    it('getSkills fetches skills categories hierarchy', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getSkills();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/skills/'),
        expect.any(Object)
      );
    });

    it('getArticles supports category, featured, and tag filters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getArticles({ category: 'Database', featured: true, tag: 'PostgreSQL' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/articles/?category=Database&featured=true&tag=PostgreSQL'),
        expect.any(Object)
      );

      await getArticle('pg-indexing');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/articles/pg-indexing/'),
        expect.any(Object)
      );
    });

    it('getUses and getCurrentlyBuilding call their respective endpoints', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      await getUses();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/uses/'),
        expect.any(Object)
      );

      await getCurrentlyBuilding({ status: 'active' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/currently-building/?status=active'),
        expect.any(Object)
      );
    });

    it('resume methods call active resume endpoints', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ versionTag: '2026' }),
      });

      await getActiveResumeData();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/resume/'),
        expect.any(Object)
      );

      await getActiveResumeMetadata();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/resume/metadata/'),
        expect.any(Object)
      );

      const downloadUrl = getResumeDownloadUrl();
      expect(downloadUrl).toContain('/api/v1/resume/download/');
    });
  });

  describe('Inquiries API', () => {
    it('submitInquiry sends clean payload with honeypot fields to POST /api/v1/inquiries/', async () => {
      const mockSuccess = { status: 'ok', message: 'Message received', id: 'inq-123' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        text: async () => JSON.stringify(mockSuccess),
      });

      const response = await submitInquiry({
        name: '  Maya Sharma  ',
        email: '  maya@example.com  ',
        message: '  Let us discuss a Django backend project for our startup.  ',
        projectId: 'agritech',
        projectTitle: 'Agritech Marketplace',
        sourcePage: 'https://manojkc1.com.np/projects/agritech',
        hp_field: '',
        _hp: '',
      });

      expect(response).toEqual(mockSuccess);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/inquiries/'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            name: 'Maya Sharma',
            email: 'maya@example.com',
            message: 'Let us discuss a Django backend project for our startup.',
            projectId: 'agritech',
            projectTitle: 'Agritech Marketplace',
            sourcePage: 'https://manojkc1.com.np/projects/agritech',
            hp_field: '',
            _hp: '',
          }),
        })
      );
    });
  });
});
