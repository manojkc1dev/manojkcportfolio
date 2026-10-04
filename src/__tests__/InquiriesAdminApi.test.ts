import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAdminInquiries,
  updateAdminInquiry,
  deleteAdminInquiry,
  submitInquiry,
  mapDjangoInquiryToAdmin,
} from '../lib/api/inquiries';

describe('Admin Inquiries DRF API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('mapDjangoInquiryToAdmin', () => {
    it('maps all DRF fields to AdminInquiry format correctly', () => {
      const raw = {
        id: '12345-uuid',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        company: 'Vertex AI',
        phone: '+977 9851011111',
        hasWhatsApp: true,
        scopeTitle: 'Django Microservices',
        budgetRange: 'US$2,500–5,000',
        timeline: '2–3 Months',
        message: 'Need help with architecture and scaling.',
        status: 'In Progress',
        read: true,
        replied: false,
        projectId: 'agritech',
        projectTitle: 'Agritech Marketplace',
        createdAt: '2026-10-04T12:00:00Z',
      };

      const mapped = mapDjangoInquiryToAdmin(raw);

      expect(mapped.id).toBe('12345-uuid');
      expect(mapped.name).toBe('Elena Rostova');
      expect(mapped.email).toBe('elena@example.com');
      expect(mapped.company).toBe('Vertex AI');
      expect(mapped.phone).toBe('+977 9851011111');
      expect(mapped.hasWhatsApp).toBe(true);
      expect(mapped.scopeTitle).toBe('Django Microservices');
      expect(mapped.budgetRange).toBe('US$2,500–5,000');
      expect(mapped.timeline).toBe('2–3 Months');
      expect(mapped.status).toBe('In Progress');
      expect(mapped.read).toBe(true);
      expect(mapped.replied).toBe(false);
      expect(mapped.projectId).toBe('agritech');
      expect(mapped.projectTitle).toBe('Agritech Marketplace');
      expect(mapped.submittedAt).toBeTruthy();
    });

    it('falls back safely for missing optional fields', () => {
      const mapped = mapDjangoInquiryToAdmin({ id: 'inq-99' });

      expect(mapped.id).toBe('inq-99');
      expect(mapped.name).toBe('Client');
      expect(mapped.email).toBe('');
      expect(mapped.company).toBe('');
      expect(mapped.status).toBe('New');
      expect(mapped.read).toBe(false);
      expect(mapped.replied).toBe(false);
      expect(mapped.submittedAt).toBe('Recent');
    });
  });

  describe('getAdminInquiries (list)', () => {
    it('fetches and maps inquiries list successfully', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const mockData = [
        {
          id: 'lead-1',
          name: 'Devendra Shrestha',
          email: 'devendra@example.com',
          message: 'PostgreSQL audit inquiry.',
          status: 'New',
          read: false,
          replied: false,
          createdAt: '2026-10-04T10:00:00Z',
        },
        {
          id: 'lead-2',
          name: 'Pooja Karki',
          email: 'pooja@example.com',
          message: 'Payment gateway integration.',
          status: 'In Progress',
          read: true,
          replied: true,
          createdAt: '2026-10-03T10:00:00Z',
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      });

      const result = await getAdminInquiries();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('lead-1');
      expect(result[0].name).toBe('Devendra Shrestha');
      expect(result[1].id).toBe('lead-2');
      expect(result[1].status).toBe('In Progress');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/inquiries/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
          }),
        })
      );
    });

    it('handles paginated response { results: [...] } gracefully', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const paginatedData = {
        count: 1,
        results: [
          {
            id: 'lead-paginated',
            name: 'Paginated Lead',
            email: 'lead@example.com',
            message: 'Test message',
            status: 'Won',
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(paginatedData),
      });

      const result = await getAdminInquiries();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('lead-paginated');
      expect(result[0].name).toBe('Paginated Lead');
    });

    it('handles empty state (empty array) correctly', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      const result = await getAdminInquiries();
      expect(result).toEqual([]);
    });

    it('throws ApiError on server error (500)', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => JSON.stringify({ detail: 'Database connection failed' }),
      });

      await expect(getAdminInquiries()).rejects.toThrow('Database connection failed');
    });

    it('throws 401 when unauthenticated and refresh fails', async () => {
      localStorage.setItem('portfolio_django_access_token', 'expired-token');
      localStorage.setItem('portfolio_django_refresh_token', 'expired-refresh');

      // 401 on initial request and 401 on refresh
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => JSON.stringify({ detail: 'Token is invalid or expired' }),
      });

      await expect(getAdminInquiries()).rejects.toThrow();
    });
  });

  describe('updateAdminInquiry (update / status change)', () => {
    it('sends PATCH request with status update and returns updated mapped inquiry', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      const updatedPayload = {
        id: 'inq-123',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        status: 'Won',
        read: true,
        replied: true,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(updatedPayload),
      });

      const result = await updateAdminInquiry('inq-123', {
        status: 'Won',
        read: true,
        replied: true,
      });

      expect(result.id).toBe('inq-123');
      expect(result.status).toBe('Won');
      expect(result.read).toBe(true);
      expect(result.replied).toBe(true);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/inquiries/inq-123/',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            status: 'Won',
            read: true,
            replied: true,
          }),
        })
      );
    });

    it('rejects with ApiError on 404 not found', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => JSON.stringify({ detail: 'Inquiry not found.' }),
      });

      await expect(
        updateAdminInquiry('non-existent', { status: 'Closed' })
      ).rejects.toThrow('Inquiry not found.');
    });
  });

  describe('deleteAdminInquiry (delete)', () => {
    it('sends DELETE request with inquiry ID', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-admin-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text: async () => '',
      });

      await deleteAdminInquiry('inq-delete-target');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/inquiries/inq-delete-target/',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-admin-token',
          }),
        })
      );
    });

    it('propagates error when DELETE fails with 403 Forbidden', async () => {
      localStorage.setItem('portfolio_django_access_token', 'staff-only-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => JSON.stringify({ detail: 'Permission denied.' }),
      });

      await expect(deleteAdminInquiry('inq-protected')).rejects.toThrow('Permission denied.');
    });
  });

  describe('submitInquiry (public contact form submission)', () => {
    it('submits inquiry payload to POST /api/v1/inquiries/ publicly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        text: async () =>
          JSON.stringify({
            status: 'ok',
            message: 'Message received.',
            id: 'new-inquiry-uuid',
          }),
      });

      const response = await submitInquiry({
        name: 'Manoj Test',
        email: 'test@manojkc1.com.np',
        message: 'Interested in working together on a high-throughput backend.',
        projectId: 'calcpro',
        projectTitle: 'CalcPro Financial',
      });

      expect(response.status).toBe('ok');
      expect(response.id).toBe('new-inquiry-uuid');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/inquiries/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            name: 'Manoj Test',
            email: 'test@manojkc1.com.np',
            message: 'Interested in working together on a high-throughput backend.',
            projectId: 'calcpro',
            projectTitle: 'CalcPro Financial',
          }),
        })
      );
    });
  });
});
