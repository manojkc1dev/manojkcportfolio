/**
 * Inquiry Submission Client for Django REST Framework Backend
 *
 * Directs public contact form submissions to POST /api/v1/inquiries/ with honeypot
 * anti-spam verification and rate limiting handling.
 */

import { apiClient, type RequestOptions } from './client';

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
