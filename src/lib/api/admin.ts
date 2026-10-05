/**
 * Admin REST API Client for Portfolio CMS
 *
 * Exposes typed CRUD operations for administrative project management backed by
 * the canonical Django REST Framework /api/v1/admin/ API.
 */

import { adminApiClient, type RequestOptions } from './client';
import type { AdminProject } from '../../pages/admin/types';
import { toAdminProject, toDjangoProjectPayload } from './adapters/projectAdapter';

/**
 * List all projects (including Drafts) from the authenticated Django admin API.
 * GET /api/v1/admin/projects/
 */
export async function getAdminProjects(options?: RequestOptions): Promise<AdminProject[]> {
  const data = await adminApiClient.get<any>('/api/v1/admin/projects/', options);
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map(toAdminProject);
}

/**
 * Retrieve single project by ID or slug from authenticated Django admin API.
 * GET /api/v1/admin/projects/<id>/
 */
export async function getAdminProject(id: string, options?: RequestOptions): Promise<AdminProject> {
  const data = await adminApiClient.get<any>(
    `/api/v1/admin/projects/${encodeURIComponent(id)}/`,
    options
  );
  return toAdminProject(data);
}

/**
 * Create a new project in Django backend via authenticated admin API.
 * POST /api/v1/admin/projects/
 */
export async function createAdminProject(
  project: AdminProject,
  options?: RequestOptions
): Promise<AdminProject> {
  const payload = toDjangoProjectPayload(project);
  const data = await adminApiClient.post<any>('/api/v1/admin/projects/', payload, options);
  return toAdminProject(data);
}

/**
 * Update an existing project in Django backend via authenticated admin API.
 * PUT/PATCH /api/v1/admin/projects/<id>/
 */
export async function updateAdminProject(
  id: string,
  project: AdminProject | Partial<AdminProject>,
  options?: RequestOptions
): Promise<AdminProject> {
  // If it's a full AdminProject, convert via toDjangoProjectPayload
  let payload: Record<string, any>;
  if ('title' in project && 'shortDescription' in project) {
    payload = toDjangoProjectPayload(project as AdminProject);
  } else {
    // Partial updates (e.g., toggling featured or status)
    payload = {};
    if (project.title !== undefined) payload.title = project.title;
    if (project.featured !== undefined) payload.featured = project.featured;
    if (project.visibility !== undefined) payload.visibility = project.visibility;
    if (project.status !== undefined) {
      payload.status =
        project.status === 'In Development'
          ? 'ongoing'
          : project.status === 'Archived'
          ? 'archived'
          : 'live';
    }
    if (project.shortDescription !== undefined) {
      payload.short_description = project.shortDescription;
      payload.shortDescription = project.shortDescription;
    }
    if (project.fullCaseStudy !== undefined) {
      payload.full_case_study = project.fullCaseStudy;
      payload.fullCaseStudy = project.fullCaseStudy;
    }
  }

  const data = await adminApiClient.patch<any>(
    `/api/v1/admin/projects/${encodeURIComponent(id)}/`,
    payload,
    options
  );
  return toAdminProject(data);
}

/**
 * Permanently delete a project from Django backend.
 * DELETE /api/v1/admin/projects/<id>/
 */
export async function deleteAdminProject(id: string, options?: RequestOptions): Promise<void> {
  await adminApiClient.delete<void>(
    `/api/v1/admin/projects/${encodeURIComponent(id)}/`,
    options
  );
}
