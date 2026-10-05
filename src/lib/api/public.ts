/**
 * Public Read-Only Django REST API Client Methods
 *
 * Implements typed getters for all canonical /api/v1/ public endpoints.
 */

import { apiClient, buildUrl, DJANGO_API_BASE_URL, type RequestOptions } from './client';
import type {
  Profile,
  Project,
  Experience,
  SkillCategory,
} from '../../types';
import type { CurrentItem } from '../../data/currentlyBuilding';

export interface UseItem {
  id: number;
  name: string;
  why: string;
  tag: string;
  link: string;
  order: number;
}

export interface UseCategory {
  id: number;
  title: string;
  description: string;
  order: number;
  items: UseItem[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon?: string;
  shortSummary: string;
  detailedScope?: string;
  features: string[];
  deliverables: string[];
  technologies: string[];
  featured: boolean;
  coverImage?: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  publishedDate?: string | null;
  featured: boolean;
  excerpt: string;
  headerImage?: string;
  authorName: string;
  authorRole: string;
  readingTime: number;
  tags: string[];
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
}

export interface ResumeDataRecord {
  id: string;
  versionTag: string;
  targetHeadline: string;
  summaryText: string;
  resumeUrl: string;
  fileName: string;
  customization?: Record<string, any>;
  atsScore?: number;
  atsAudit?: Record<string, any>;
  isPublic?: boolean;
  updatedAt?: string;
}

export interface ResumeDocumentMetadata {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  fileHashSha256: string;
  isActive: boolean;
  isPublic: boolean;
  downloadCount: number;
  uploadedAt: string;
}

export interface ProjectFilterParams {
  category?: string;
  featured?: boolean;
}

export interface ServiceFilterParams {
  featured?: boolean;
}

export interface ExperienceFilterParams {
  type?: string;
}

export interface ArticleFilterParams {
  category?: string;
  featured?: boolean;
  tag?: string;
}

export interface CurrentlyBuildingFilterParams {
  status?: 'active' | 'planned' | 'researching' | string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API Methods
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch owner site profile, bio, statistics, and visible socials.
 * GET /api/v1/profile/
 */
export function getProfile(options?: RequestOptions): Promise<Profile> {
  return apiClient.get<Profile>('/api/v1/profile/', options);
}

/**
 * Fetch categorized workstation setup and hardware/software tools.
 * GET /api/v1/uses/
 */
export function getUses(options?: RequestOptions): Promise<UseCategory[]> {
  return apiClient.get<UseCategory[]>('/api/v1/uses/', options);
}

/**
 * Fetch active development initiatives and learning milestones.
 * GET /api/v1/currently-building/
 */
export function getCurrentlyBuilding(
  params?: CurrentlyBuildingFilterParams,
  options?: RequestOptions
): Promise<CurrentItem[]> {
  return apiClient.get<CurrentItem[]>('/api/v1/currently-building/', {
    ...options,
    params: params as Record<string, string | number | boolean>,
  });
}

/**
 * Fetch published portfolio projects.
 * GET /api/v1/projects/
 */
export function getProjects(
  params?: ProjectFilterParams,
  options?: RequestOptions
): Promise<Project[]> {
  return apiClient.get<Project[]>('/api/v1/projects/', {
    ...options,
    params: params as Record<string, string | number | boolean>,
  });
}

/**
 * Fetch single detailed project case study by slug or id.
 * GET /api/v1/projects/<slug>/
 */
export function getProject(slug: string, options?: RequestOptions): Promise<Project> {
  return apiClient.get<Project>(`/api/v1/projects/${encodeURIComponent(slug)}/`, options);
}

/**
 * Fetch published engineering services.
 * GET /api/v1/services/
 */
export function getServices(
  params?: ServiceFilterParams,
  options?: RequestOptions
): Promise<Service[]> {
  return apiClient.get<Service[]>('/api/v1/services/', {
    ...options,
    params: params as Record<string, string | number | boolean>,
  });
}

/**
 * Fetch single engineering service specification by slug.
 * GET /api/v1/services/<slug>/
 */
export function getService(slug: string, options?: RequestOptions): Promise<Service> {
  return apiClient.get<Service>(`/api/v1/services/${encodeURIComponent(slug)}/`, options);
}

/**
 * Fetch career milestones and educational achievements.
 * GET /api/v1/experience/
 */
export function getExperience(
  params?: ExperienceFilterParams,
  options?: RequestOptions
): Promise<Experience[]> {
  return apiClient.get<Experience[]>('/api/v1/experience/', {
    ...options,
    params: params as Record<string, string | number | boolean>,
  });
}

/**
 * Fetch single career experience record by id.
 * GET /api/v1/experience/<id>/
 */
export function getExperienceDetail(id: string, options?: RequestOptions): Promise<Experience> {
  return apiClient.get<Experience>(`/api/v1/experience/${encodeURIComponent(id)}/`, options);
}

/**
 * Fetch hierarchical skill categories and competencies.
 * GET /api/v1/skills/
 */
export function getSkills(options?: RequestOptions): Promise<SkillCategory[]> {
  return apiClient.get<SkillCategory[]>('/api/v1/skills/', options);
}

/**
 * Fetch published technical blog articles.
 * GET /api/v1/articles/
 */
export function getArticles(
  params?: ArticleFilterParams,
  options?: RequestOptions
): Promise<ArticleSummary[]> {
  return apiClient.get<ArticleSummary[]>('/api/v1/articles/', {
    ...options,
    params: params as Record<string, string | number | boolean>,
  });
}

/**
 * Fetch single published article with full markdown content by slug.
 * GET /api/v1/articles/<slug>/
 */
export function getArticle(slug: string, options?: RequestOptions): Promise<ArticleDetail> {
  return apiClient.get<ArticleDetail>(`/api/v1/articles/${encodeURIComponent(slug)}/`, options);
}

/**
 * Fetch active structured ATS resume document data.
 * GET /api/v1/resume/
 */
export function getActiveResumeData(options?: RequestOptions): Promise<ResumeDataRecord> {
  return apiClient.get<ResumeDataRecord>('/api/v1/resume/', options);
}

/**
 * Fetch active uploaded resume document metadata (excluding binary).
 * GET /api/v1/resume/metadata/
 */
export function getActiveResumeMetadata(options?: RequestOptions): Promise<ResumeDocumentMetadata> {
  return apiClient.get<ResumeDocumentMetadata>('/api/v1/resume/metadata/', options);
}

/**
 * Return canonical URL for direct binary resume PDF download.
 * GET /api/v1/resume/download/
 */
export function getResumeDownloadUrl(): string {
  return buildUrl('/api/v1/resume/download/', undefined, DJANGO_API_BASE_URL);
}
