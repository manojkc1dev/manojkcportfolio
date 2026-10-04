/**
 * Bidirectional Adapter between AdminProject and Django Project schemas.
 *
 * Bridges the frontend Admin CMS representation (AdminProject) and the canonical
 * Django REST Framework backend schema (Project / ProjectAdminSerializer) without
 * data loss.
 */

import type { AdminProject } from '../../../pages/admin/types';

/**
 * Transforms a raw Django Project REST API response into an AdminProject object.
 */
export function toAdminProject(drfProject: any): AdminProject {
  if (!drfProject || typeof drfProject !== 'object') {
    throw new Error('Invalid project payload received from Django API.');
  }

  const rawStatus = drfProject.status || 'live';
  let adminStatus: AdminProject['status'] = 'In Production';
  if (['Deployed', 'In Production', 'In Development', 'Completed', 'Archived'].includes(rawStatus)) {
    adminStatus = rawStatus as AdminProject['status'];
  } else if (rawStatus === 'ongoing') {
    adminStatus = 'In Development';
  } else if (rawStatus === 'archived') {
    adminStatus = 'Archived';
  } else if (rawStatus === 'live') {
    adminStatus = 'In Production';
  }

  const slug = drfProject.slug || drfProject.id || '';
  const id = drfProject.id || slug;

  const rawHighlights = drfProject.highlights;
  let keyHighlightsStr = drfProject.key_highlights || drfProject.keyHighlights || '';
  if (!keyHighlightsStr && Array.isArray(rawHighlights)) {
    keyHighlightsStr = rawHighlights.join('\n');
  }

  return {
    id,
    slug,
    title: drfProject.title || '',
    tagline: drfProject.tagline || '',
    category: drfProject.category || 'backend',
    status: adminStatus,
    visibility: drfProject.visibility === 'Draft' ? 'Draft' : 'Published',
    featured: Boolean(drfProject.featured),
    thumbnail: drfProject.thumbnail || drfProject.image || '',
    client: drfProject.client || '',
    industry: drfProject.industry || '',
    yearDuration:
      drfProject.year_duration ||
      drfProject.yearDuration ||
      drfProject.duration ||
      (drfProject.year ? String(drfProject.year) : ''),
    shortDescription:
      drfProject.short_description ||
      drfProject.shortDescription ||
      drfProject.description ||
      drfProject.tagline ||
      '',
    fullCaseStudy:
      drfProject.full_case_study ||
      drfProject.fullCaseStudy ||
      drfProject.description ||
      '',
    liveUrl: drfProject.live_url || drfProject.liveUrl || drfProject.links?.live || '',
    githubUrl: drfProject.github_url || drfProject.githubUrl || drfProject.links?.github || '',
    caseStudyUrl:
      drfProject.case_study_url ||
      drfProject.caseStudyUrl ||
      drfProject.links?.caseStudy ||
      (slug ? `/projects/${slug}` : ''),
    apiDocsUrl:
      drfProject.api_docs_url ||
      drfProject.apiDocsUrl ||
      drfProject.links?.apiDocs ||
      '',
    technologies: Array.isArray(drfProject.tech)
      ? drfProject.tech
      : Array.isArray(drfProject.technologies)
      ? drfProject.technologies
      : [],
    languages: Array.isArray(drfProject.languages) ? drfProject.languages : [],
    keyHighlights: keyHighlightsStr,
    gallery: Array.isArray(drfProject.gallery) ? drfProject.gallery : [],
    metrics: Array.isArray(drfProject.metrics)
      ? drfProject.metrics.map((m: any) => ({
          label: m.label || '',
          value: m.value || '',
          icon: m.icon || 'speed',
        }))
      : [],
    proof: Array.isArray(drfProject.proof) ? drfProject.proof : [],
    problem: drfProject.problem || '',
    solution: drfProject.solution || '',
    architecture: drfProject.architecture || '',
    role: drfProject.role || '',
  };
}

/**
 * Transforms an AdminProject object into the canonical payload accepted by
 * Django REST Framework (ProjectAdminSerializer).
 */
export function toDjangoProjectPayload(adminProject: AdminProject): Record<string, any> {
  if (!adminProject || typeof adminProject !== 'object') {
    throw new Error('Invalid AdminProject object provided to serializer.');
  }

  const slug = (adminProject.slug || adminProject.id || '').trim();
  const id = slug || adminProject.id;
  const title = (adminProject.title || '').trim();

  // Extract highlights array from keyHighlights string
  let highlightsArray: string[] = [];
  if (adminProject.keyHighlights && adminProject.keyHighlights.trim()) {
    highlightsArray = adminProject.keyHighlights
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
  } else if (adminProject.shortDescription) {
    highlightsArray = [adminProject.shortDescription];
  }

  // Map status
  let djangoStatus = 'live';
  if (adminProject.status === 'In Development') {
    djangoStatus = 'ongoing';
  } else if (adminProject.status === 'Archived') {
    djangoStatus = 'archived';
  } else {
    djangoStatus = 'live';
  }

  // Map metrics
  const metrics = (adminProject.metrics || []).map((m, idx) => ({
    label: m.label,
    value: m.value,
    icon: m.icon || 'speed',
    order: idx + 1,
  }));

  return {
    id,
    slug,
    title,
    tagline: adminProject.tagline || adminProject.shortDescription || title,
    description: adminProject.fullCaseStudy || adminProject.shortDescription || title,
    short_description: adminProject.shortDescription || '',
    shortDescription: adminProject.shortDescription || '',
    full_case_study: adminProject.fullCaseStudy || '',
    fullCaseStudy: adminProject.fullCaseStudy || '',
    category: adminProject.category || 'backend',
    status: djangoStatus,
    visibility: adminProject.visibility === 'Draft' ? 'Draft' : 'Published',
    featured: Boolean(adminProject.featured),
    image: adminProject.thumbnail || '',
    thumbnail: adminProject.thumbnail || '',
    highlights: highlightsArray,
    tech: adminProject.technologies || [],
    technologies: adminProject.technologies || [],
    languages: adminProject.languages || [],
    links: {
      live: adminProject.liveUrl || '',
      github: adminProject.githubUrl || '',
      caseStudy: adminProject.caseStudyUrl || (slug ? `/projects/${slug}` : ''),
      apiDocs: adminProject.apiDocsUrl || '',
    },
    gallery: adminProject.gallery || [],
    proof: adminProject.proof || [],
    role: adminProject.role || '',
    duration: adminProject.yearDuration || '',
    year_duration: adminProject.yearDuration || '',
    yearDuration: adminProject.yearDuration || '',
    client: adminProject.client || '',
    industry: adminProject.industry || '',
    live_url: adminProject.liveUrl || '',
    liveUrl: adminProject.liveUrl || '',
    github_url: adminProject.githubUrl || '',
    githubUrl: adminProject.githubUrl || '',
    case_study_url: adminProject.caseStudyUrl || (slug ? `/projects/${slug}` : ''),
    caseStudyUrl: adminProject.caseStudyUrl || (slug ? `/projects/${slug}` : ''),
    api_docs_url: adminProject.apiDocsUrl || '',
    apiDocsUrl: adminProject.apiDocsUrl || '',
    key_highlights: adminProject.keyHighlights || '',
    keyHighlights: adminProject.keyHighlights || '',
    problem: adminProject.problem || '',
    solution: adminProject.solution || '',
    architecture: adminProject.architecture || '',
    metrics,
  };
}
