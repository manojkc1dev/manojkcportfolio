/**
 * Inquiry Client for Django REST Framework Backend
 *
 * Directs public contact form submissions to POST /api/v1/inquiries/ with honeypot
 * anti-spam verification and rate limiting handling.
 *
 * Provides authenticated administrative functions for listing, updating,
 * and deleting client leads.
 */

import { apiClient, adminApiClient, type RequestOptions } from './client';
import type { AdminInquiry } from '../../pages/admin/types';

export interface InquiryPayload {
  name: string;
  email: string;
  message: string;
  projectId?: string;
  projectTitle?: string;
  sourcePage?: string;
  hp_field?: string;
  _hp?: string;
}

export interface InquiryResponse {
  status: 'ok';
  message: string;
  id: string;
}

/**
 * Maps a Django inquiry object to the AdminInquiry interface.
 */
export function mapDjangoInquiryToAdmin(raw: any): AdminInquiry {
  const createdAtIso = raw.createdAt || raw.created_at || raw.submittedAt;
  let formattedDate = 'Recent';
  if (createdAtIso) {
    try {
      formattedDate = new Date(createdAtIso).toLocaleString();
    } catch {
      formattedDate = String(createdAtIso);
    }
  }

  return {
    id: String(raw.id),
    name: raw.name || 'Client',
    company: raw.company || '',
    email: raw.email || '',
    phone: raw.phone || '',
    hasWhatsApp: raw.hasWhatsApp ?? raw.has_whatsapp ?? true,
    scopeTitle: raw.scopeTitle || raw.scope_title || 'Website Contact Inquiry',
    budgetRange: raw.budgetRange || raw.budget_range || 'Standard Project',
    timeline: raw.timeline || '2–3 Months',
    message: raw.message || '',
    submittedAt: formattedDate,
    status: raw.status || 'New',
    read: Boolean(raw.read),
    replied: Boolean(raw.replied),
    projectId: raw.projectId || raw.project_id || undefined,
    projectTitle: raw.projectTitle || raw.project_title || undefined,
    projectTag: raw.projectTag || raw.project_tag || undefined,
  };
}

/**
 * Submit client inquiry to canonical Django backend.
 * POST /api/v1/inquiries/
 */
export async function submitInquiry(
  payload: InquiryPayload,
  options?: RequestOptions
): Promise<InquiryResponse> {
  const cleanPayload: Record<string, any> = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  };

  if (payload.projectId) cleanPayload.projectId = payload.projectId.trim();
  if (payload.projectTitle) cleanPayload.projectTitle = payload.projectTitle.trim();
  if (payload.sourcePage) cleanPayload.sourcePage = payload.sourcePage.trim();
  if (payload.hp_field !== undefined) cleanPayload.hp_field = payload.hp_field;
  if (payload._hp !== undefined) cleanPayload._hp = payload._hp;

  return apiClient.post<InquiryResponse>('/api/v1/inquiries/', cleanPayload, options);
}

/**
 * Fetch list of client inquiries from authenticated Django backend.
 * GET /api/v1/inquiries/
 */
export async function getAdminInquiries(
  options?: RequestOptions
): Promise<AdminInquiry[]> {
  const data = await adminApiClient.get<any>('/api/v1/inquiries/', options);
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map(mapDjangoInquiryToAdmin);
}

/**
 * Update an inquiry status/read/replied in Django backend.
 * PATCH /api/v1/inquiries/<id>/
 */
export async function updateAdminInquiry(
  id: string,
  updates: Partial<AdminInquiry>,
  options?: RequestOptions
): Promise<AdminInquiry> {
  const payload: Record<string, any> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.read !== undefined) payload.read = updates.read;
  if (updates.replied !== undefined) payload.replied = updates.replied;
  if (updates.company !== undefined) payload.company = updates.company;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.scopeTitle !== undefined) payload.scopeTitle = updates.scopeTitle;
  if (updates.budgetRange !== undefined) payload.budgetRange = updates.budgetRange;
  if (updates.timeline !== undefined) payload.timeline = updates.timeline;

  const result = await adminApiClient.patch<any>(`/api/v1/inquiries/${encodeURIComponent(id)}/`, payload, options);
  return mapDjangoInquiryToAdmin(result);
}

/**
 * Delete an inquiry in Django backend.
 * DELETE /api/v1/inquiries/<id>/
 */
export async function deleteAdminInquiry(
  id: string,
  options?: RequestOptions
): Promise<void> {
  await adminApiClient.delete<void>(`/api/v1/inquiries/${encodeURIComponent(id)}/`, options);
}

