import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  toAdminProject,
  toDjangoProjectPayload,
} from '../lib/api/adapters/projectAdapter';
import {
  getAdminProjects,
  getAdminProject,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} from '../lib/api/admin';
import type { AdminProject } from '../pages/admin/types';

describe('Admin Projects API & Adapter Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('projectAdapter (Bidirectional Mapping)', () => {
    const sampleDjangoProject = {
      id: 'agritech',
      slug: 'agritech',
      title: 'Agritech Marketplace',
      tagline: 'High-throughput agricultural commodity trading engine',
      short_description: 'Built with Django REST and PostgreSQL supporting 10k RPS.',
      full_case_study: '## Architecture\n\nFull case study details here.',
      category: 'backend',
      status: 'live',
      visibility: 'Published',
      featured: true,
      thumbnail: '/images/agritech.png',
      client: 'Krishi Hub',
      industry: 'Agriculture / FinTech',
      year_duration: '2025 - 2026',
      live_url: 'https://krishihub.com',
      github_url: 'https://github.com/manojkc1dev/agritech',
      case_study_url: '/projects/agritech',
      api_docs_url: 'https://api.krishihub.com/docs',
      technologies: ['Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
      languages: ['Python', 'TypeScript', 'SQL'],
      key_highlights: 'Sub-50ms latency\nZero downtime migrations\nACID transaction safety',
      gallery: ['/images/agri1.png', '/images/agri2.png'],
      metrics: [
        { label: 'Throughput', value: '10,000 req/s', icon: 'zap' },
        { label: 'Latency', value: '38ms p99', icon: 'clock' },
      ],
      proof: ['Audited by third-party security team.'],
      problem: 'High concurrency locking bottlenecked agricultural trade auctions.',
      solution: 'Implemented partitioned queue processing with Redis and Celery.',
      architecture: 'Event-driven Django REST backend with PostgreSQL read replicas.',
      role: 'Lead Backend Engineer',
    };

    const sampleAdminProject: AdminProject = {
      id: 'agritech',
      slug: 'agritech',
      title: 'Agritech Marketplace',
      tagline: 'High-throughput agricultural commodity trading engine',
      shortDescription: 'Built with Django REST and PostgreSQL supporting 10k RPS.',
      fullCaseStudy: '## Architecture\n\nFull case study details here.',
      category: 'backend',
      status: 'In Production',
      visibility: 'Published',
      featured: true,
      thumbnail: '/images/agritech.png',
      client: 'Krishi Hub',
      industry: 'Agriculture / FinTech',
      yearDuration: '2025 - 2026',
      liveUrl: 'https://krishihub.com',
      githubUrl: 'https://github.com/manojkc1dev/agritech',
      caseStudyUrl: '/projects/agritech',
      apiDocsUrl: 'https://api.krishihub.com/docs',
      technologies: ['Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
      languages: ['Python', 'TypeScript', 'SQL'],
      keyHighlights: 'Sub-50ms latency\nZero downtime migrations\nACID transaction safety',
      gallery: ['/images/agri1.png', '/images/agri2.png'],
      metrics: [
        { label: 'Throughput', value: '10,000 req/s', icon: 'zap' },
        { label: 'Latency', value: '38ms p99', icon: 'clock' },
      ],
      proof: ['Audited by third-party security team.'],
      problem: 'High concurrency locking bottlenecked agricultural trade auctions.',
      solution: 'Implemented partitioned queue processing with Redis and Celery.',
      architecture: 'Event-driven Django REST backend with PostgreSQL read replicas.',
      role: 'Lead Backend Engineer',
    };

    describe('toAdminProject', () => {
      it('transforms full Django DRF response into AdminProject schema without data loss', () => {
        const result = toAdminProject(sampleDjangoProject);

        expect(result.id).toBe('agritech');
        expect(result.slug).toBe('agritech');
        expect(result.title).toBe('Agritech Marketplace');
        expect(result.tagline).toBe('High-throughput agricultural commodity trading engine');
        expect(result.shortDescription).toBe(
          'Built with Django REST and PostgreSQL supporting 10k RPS.'
        );
        expect(result.fullCaseStudy).toBe('## Architecture\n\nFull case study details here.');
        expect(result.category).toBe('backend');
        expect(result.status).toBe('In Production');
        expect(result.visibility).toBe('Published');
        expect(result.featured).toBe(true);
        expect(result.thumbnail).toBe('/images/agritech.png');
        expect(result.client).toBe('Krishi Hub');
        expect(result.industry).toBe('Agriculture / FinTech');
        expect(result.yearDuration).toBe('2025 - 2026');
        expect(result.liveUrl).toBe('https://krishihub.com');
        expect(result.githubUrl).toBe('https://github.com/manojkc1dev/agritech');
        expect(result.caseStudyUrl).toBe('/projects/agritech');
        expect(result.apiDocsUrl).toBe('https://api.krishihub.com/docs');
        expect(result.technologies).toEqual(['Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker']);
        expect(result.languages).toEqual(['Python', 'TypeScript', 'SQL']);
        expect(result.keyHighlights).toContain('Sub-50ms latency');
        expect(result.metrics).toHaveLength(2);
        expect(result.metrics[0]).toEqual({
          label: 'Throughput',
          value: '10,000 req/s',
          icon: 'zap',
        });
        expect(result.problem).toBe(
          'High concurrency locking bottlenecked agricultural trade auctions.'
        );
        expect(result.solution).toBe(
          'Implemented partitioned queue processing with Redis and Celery.'
        );
        expect(result.architecture).toBe(
          'Event-driven Django REST backend with PostgreSQL read replicas.'
        );
        expect(result.role).toBe('Lead Backend Engineer');
      });

      it('maps Django statuses correctly to AdminProject statuses', () => {
        expect(toAdminProject({ ...sampleDjangoProject, status: 'ongoing' }).status).toBe(
          'In Development'
        );
        expect(toAdminProject({ ...sampleDjangoProject, status: 'archived' }).status).toBe(
          'Archived'
        );
        expect(toAdminProject({ ...sampleDjangoProject, status: 'live' }).status).toBe(
          'In Production'
        );
        expect(toAdminProject({ ...sampleDjangoProject, status: 'Completed' }).status).toBe(
          'Completed'
        );
      });

      it('handles nested links object and highlights array fallback', () => {
        const minimalWithLinks = {
          id: 'proj-links',
          title: 'Project Links',
          links: {
            live: 'https://live.test',
            github: 'https://github.test',
            caseStudy: '/case-study',
            apiDocs: '/docs',
          },
          highlights: ['Highlight 1', 'Highlight 2'],
          tech: ['Django', 'DRF'],
        };

        const result = toAdminProject(minimalWithLinks);
        expect(result.liveUrl).toBe('https://live.test');
        expect(result.githubUrl).toBe('https://github.test');
        expect(result.caseStudyUrl).toBe('/case-study');
        expect(result.apiDocsUrl).toBe('/docs');
        expect(result.keyHighlights).toBe('Highlight 1\nHighlight 2');
        expect(result.technologies).toEqual(['Django', 'DRF']);
      });

      it('safely handles missing optional fields', () => {
        const minimal = { id: 'minimal-p', title: 'Minimal Project' };
        const result = toAdminProject(minimal);

        expect(result.id).toBe('minimal-p');
        expect(result.slug).toBe('minimal-p');
        expect(result.title).toBe('Minimal Project');
        expect(result.status).toBe('In Production');
        expect(result.visibility).toBe('Published');
        expect(result.featured).toBe(false);
        expect(result.technologies).toEqual([]);
        expect(result.metrics).toEqual([]);
      });

      it('throws error on invalid non-object payload', () => {
        expect(() => toAdminProject(null)).toThrow('Invalid project payload');
        expect(() => toAdminProject(undefined)).toThrow('Invalid project payload');
      });
    });

    describe('toDjangoProjectPayload', () => {
      it('serializes AdminProject into DRF canonical payload preserving case study & structured fields', () => {
        const payload = toDjangoProjectPayload(sampleAdminProject);

        expect(payload.id).toBe('agritech');
        expect(payload.slug).toBe('agritech');
        expect(payload.title).toBe('Agritech Marketplace');
        expect(payload.short_description).toBe(
          'Built with Django REST and PostgreSQL supporting 10k RPS.'
        );
        expect(payload.full_case_study).toBe('## Architecture\n\nFull case study details here.');
        expect(payload.status).toBe('live');
        expect(payload.visibility).toBe('Published');
        expect(payload.featured).toBe(true);
        expect(payload.highlights).toEqual([
          'Sub-50ms latency',
          'Zero downtime migrations',
          'ACID transaction safety',
        ]);
        expect(payload.tech).toEqual(['Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker']);
        expect(payload.links).toEqual({
          live: 'https://krishihub.com',
          github: 'https://github.com/manojkc1dev/agritech',
          caseStudy: '/projects/agritech',
          apiDocs: 'https://api.krishihub.com/docs',
        });
        expect(payload.metrics).toEqual([
          { label: 'Throughput', value: '10,000 req/s', icon: 'zap', order: 1 },
          { label: 'Latency', value: '38ms p99', icon: 'clock', order: 2 },
        ]);
        expect(payload.problem).toBe(
          'High concurrency locking bottlenecked agricultural trade auctions.'
        );
        expect(payload.solution).toBe(
          'Implemented partitioned queue processing with Redis and Celery.'
        );
        expect(payload.architecture).toBe(
          'Event-driven Django REST backend with PostgreSQL read replicas.'
        );
        expect(payload.role).toBe('Lead Backend Engineer');
      });

      it('maps AdminProject status to Django choices correctly', () => {
        expect(
          toDjangoProjectPayload({ ...sampleAdminProject, status: 'In Development' }).status
        ).toBe('ongoing');
        expect(
          toDjangoProjectPayload({ ...sampleAdminProject, status: 'Archived' }).status
        ).toBe('archived');
        expect(
          toDjangoProjectPayload({ ...sampleAdminProject, status: 'In Production' }).status
        ).toBe('live');
        expect(
          toDjangoProjectPayload({ ...sampleAdminProject, status: 'Deployed' }).status
        ).toBe('live');
      });

      it('maps Draft visibility properly', () => {
        const payload = toDjangoProjectPayload({ ...sampleAdminProject, visibility: 'Draft' });
        expect(payload.visibility).toBe('Draft');
      });

      it('throws error when passed non-object', () => {
        expect(() => toDjangoProjectPayload(null as any)).toThrow('Invalid AdminProject object');
      });
    });
  });

  describe('getAdminProjects (List)', () => {
    it('fetches and maps project list successfully with Authorization header', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const mockData = [
        {
          id: 'proj-1',
          slug: 'proj-1',
          title: 'Project One',
          short_description: 'First project',
          status: 'live',
          visibility: 'Published',
          featured: true,
          tech: ['Python', 'Django'],
        },
        {
          id: 'proj-2',
          slug: 'proj-2',
          title: 'Project Two (Draft)',
          short_description: 'Second project draft',
          status: 'ongoing',
          visibility: 'Draft',
          featured: false,
          tech: ['FastAPI', 'Redis'],
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      });

      const results = await getAdminProjects();

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('proj-1');
      expect(results[0].title).toBe('Project One');
      expect(results[0].status).toBe('In Production');
      expect(results[0].featured).toBe(true);

      expect(results[1].id).toBe('proj-2');
      expect(results[1].status).toBe('In Development');
      expect(results[1].visibility).toBe('Draft');
      expect(results[1].featured).toBe(false);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/projects/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
          }),
        })
      );
    });

    it('unwraps paginated { results: [...] } structure correctly', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const paginatedData = {
        count: 1,
        results: [
          {
            id: 'paginated-p',
            slug: 'paginated-p',
            title: 'Paginated Project',
            status: 'live',
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(paginatedData),
      });

      const results = await getAdminProjects();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('paginated-p');
      expect(results[0].title).toBe('Paginated Project');
    });

    it('returns empty array when API returns empty list', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      const results = await getAdminProjects();
      expect(results).toEqual([]);
    });

    it('throws ApiError on server error (500)', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => JSON.stringify({ detail: 'PostgreSQL connection timeout' }),
      });

      await expect(getAdminProjects()).rejects.toThrow('PostgreSQL connection timeout');
    });

    it('throws 401 when unauthenticated and refresh fails', async () => {
      localStorage.setItem('portfolio_django_access_token', 'invalid-token');
      localStorage.setItem('portfolio_django_refresh_token', 'invalid-refresh');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => JSON.stringify({ detail: 'Authentication credentials were not provided.' }),
      });

      await expect(getAdminProjects()).rejects.toThrow();
    });
  });

  describe('getAdminProject (Single)', () => {
    it('fetches a single project by ID and maps to AdminProject', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const mockProject = {
        id: 'agritech',
        slug: 'agritech',
        title: 'Agritech Marketplace',
        status: 'live',
        featured: true,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockProject),
      });

      const result = await getAdminProject('agritech');

      expect(result.id).toBe('agritech');
      expect(result.title).toBe('Agritech Marketplace');
      expect(result.featured).toBe(true);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/projects/agritech/'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('throws 404 when project does not exist', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => JSON.stringify({ detail: 'Project not found.' }),
      });

      await expect(getAdminProject('non-existent')).rejects.toThrow('Project not found.');
    });
  });

  describe('createAdminProject (Create)', () => {
    it('sends POST /api/v1/admin/projects/ with serialized payload and returns created AdminProject', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const newProject: AdminProject = {
        id: 'new-engine',
        slug: 'new-engine',
        title: 'New High Load Engine',
        tagline: 'High load processing',
        shortDescription: '100k events/sec',
        fullCaseStudy: 'Detailed case study content',
        category: 'backend',
        status: 'In Development',
        visibility: 'Published',
        featured: false,
        thumbnail: '/images/new.png',
        technologies: ['Go', 'PostgreSQL', 'Kafka'],
        languages: ['Go', 'SQL'],
        keyHighlights: '100k events/sec\nDistributed consensus',
        gallery: [],
        metrics: [{ label: 'QPS', value: '100,000', icon: 'zap' }],
        proof: [],
        problem: 'Lock contention in DB.',
        solution: 'Sharded append-only log.',
        architecture: 'CQRS architecture with Kafka.',
        role: 'Systems Architect',
      };

      const mockResponse = {
        id: 'new-engine',
        slug: 'new-engine',
        title: 'New High Load Engine',
        status: 'ongoing',
        visibility: 'Published',
        featured: false,
        short_description: '100k events/sec',
        technologies: ['Go', 'PostgreSQL', 'Kafka'],
        metrics: [{ label: 'QPS', value: '100,000', icon: 'zap' }],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        text: async () => JSON.stringify(mockResponse),
      });

      const result = await createAdminProject(newProject);

      expect(result.id).toBe('new-engine');
      expect(result.title).toBe('New High Load Engine');
      expect(result.status).toBe('In Development');
      expect(result.technologies).toEqual(['Go', 'PostgreSQL', 'Kafka']);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/projects/'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('updateAdminProject (Update)', () => {
    it('sends PATCH with partial updates (e.g. toggling featured and status)', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const mockUpdated = {
        id: 'agritech',
        slug: 'agritech',
        title: 'Agritech Marketplace',
        featured: false,
        status: 'archived',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockUpdated),
      });

      const result = await updateAdminProject('agritech', {
        featured: false,
        status: 'Archived',
      });

      expect(result.id).toBe('agritech');
      expect(result.featured).toBe(false);
      expect(result.status).toBe('Archived');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/projects/agritech/'),
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            featured: false,
            status: 'archived',
          }),
        })
      );
    });

    it('sends PATCH with full AdminProject updates preserving case study and structured fields', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const fullUpdate: AdminProject = {
        id: 'agritech',
        slug: 'agritech',
        title: 'Agritech Marketplace v2',
        tagline: 'Enterprise Agricultural Exchange',
        shortDescription: 'Scaled to 50k RPS',
        fullCaseStudy: 'Full updated case study',
        category: 'backend',
        status: 'In Production',
        visibility: 'Published',
        featured: true,
        thumbnail: '/images/v2.png',
        technologies: ['Django', 'PostgreSQL', 'Redis'],
        languages: ['Python'],
        keyHighlights: '50k RPS\nZero downtime',
        gallery: [],
        metrics: [{ label: 'Throughput', value: '50k RPS', icon: 'zap' }],
        proof: [],
        problem: 'Updated problem statement',
        solution: 'Updated solution statement',
        architecture: 'Updated architecture',
        role: 'Principal Backend Engineer',
      };

      const mockResponse = {
        id: 'agritech',
        slug: 'agritech',
        title: 'Agritech Marketplace v2',
        status: 'live',
        short_description: 'Scaled to 50k RPS',
        full_case_study: 'Full updated case study',
        role: 'Principal Backend Engineer',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
      });

      const result = await updateAdminProject('agritech', fullUpdate);

      expect(result.id).toBe('agritech');
      expect(result.title).toBe('Agritech Marketplace v2');
      expect(result.role).toBe('Principal Backend Engineer');
    });
  });

  describe('deleteAdminProject (Delete)', () => {
    it('sends DELETE request with project ID and handles 204 success', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text: async () => '',
      });

      await deleteAdminProject('agritech');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/projects/agritech/'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
          }),
        })
      );
    });

    it('rejects when DELETE returns 403 Forbidden', async () => {
      localStorage.setItem('portfolio_django_access_token', 'unauthorized-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => JSON.stringify({ detail: 'You do not have permission to delete this project.' }),
      });

      await expect(deleteAdminProject('agritech')).rejects.toThrow(
        'You do not have permission to delete this project.'
      );
    });
  });
});
