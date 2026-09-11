import { api, ApiResponse } from './api';
import { Project as FrontendProject } from '../types';

// Backend project interface (snake_case)
interface BackendProject {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  thumbnail: string;
  cover_image: string;
  short_description: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  role: string;
  client: string;
  company: string;
  duration: string;
  team_size: number;
  responsibilities: string;
  programming_language: string;
  framework: string;
  database: string;
  api: string;
  authentication: string;
  deployment: string;
  github_url: string;
  live_demo_url: string;
  documentation_url: string;
  figma_url: string;
  case_study_url: string;
  visibility: string;
  is_featured: boolean;
  is_pinned: boolean;
  challenges: string;
  future_improvements: string;
  view_count: number;
  like_count: number;
  share_count: number;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformProjectData(data: BackendProject): FrontendProject {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    category: data.category || '',
    thumbnail: data.thumbnail,
    coverImage: data.cover_image,
    gallery: [],
    description: data.description,
    problem: data.problem,
    solution: data.solution,
    architectureNodes: [],
    architectureDescription: data.architecture,
    features: [],
    challenges: data.challenges ? data.challenges.split('\n').filter(Boolean) : [],
    futureImprovements: data.future_improvements ? data.future_improvements.split('\n').filter(Boolean) : [],
    role: data.role,
    client: data.client,
    company: data.company,
    duration: data.duration,
    teamSize: data.team_size,
    responsibilities: data.responsibilities ? data.responsibilities.split('\n').filter(Boolean) : [],
    techStack: [],
    programmingLanguages: data.programming_language ? [data.programming_language] : [],
    frameworks: data.framework ? [data.framework] : [],
    databases: data.database ? [data.database] : [],
    apis: data.api ? [data.api] : [],
    authentication: data.authentication,
    deployment: data.deployment,
    githubUrl: data.github_url,
    liveDemoUrl: data.live_demo_url,
    documentationUrl: data.documentation_url,
    caseStudyUrl: data.case_study_url,
    status: (data.status.charAt(0).toUpperCase() + data.status.slice(1)) as 'Published' | 'Draft',
    isPrivate: data.visibility === 'private',
    featured: data.is_featured,
    pinned: data.is_pinned,
    order: data.order,
    viewsCount: data.view_count,
    likesCount: data.like_count,
    sharesCount: data.share_count,
    seoTitle: data.title,
    seoDescription: data.short_description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Project service
export const projectsService = {
  // Get all projects
  getAll: async (params?: any) => {
    const response = await api.get<BackendProject[]>('/projects/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformProjectData) as FrontendProject[],
      } as unknown as ApiResponse<FrontendProject[]>;
    }
    return response as unknown as ApiResponse<FrontendProject[]>;
  },

  // Get single project by slug
  getBySlug: async (slug: string) => {
    const response = await api.get<BackendProject>(`/projects/${slug}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformProjectData(response.data) as FrontendProject,
      } as unknown as ApiResponse<FrontendProject>;
    }
    return response as unknown as ApiResponse<FrontendProject>;
  },

  // Create project
  create: async (data: Partial<FrontendProject>) => {
    const response = await api.post<BackendProject>('/projects/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformProjectData(response.data) as FrontendProject,
      } as unknown as ApiResponse<FrontendProject>;
    }
    return response as unknown as ApiResponse<FrontendProject>;
  },

  // Update project
  update: async (slug: string, data: Partial<FrontendProject>) => {
    const response = await api.put<BackendProject>(`/projects/${slug}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformProjectData(response.data) as FrontendProject,
      } as unknown as ApiResponse<FrontendProject>;
    }
    return response as unknown as ApiResponse<FrontendProject>;
  },

  // Patch project
  patch: async (slug: string, data: Partial<FrontendProject>) => {
    const response = await api.patch<BackendProject>(`/projects/${slug}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformProjectData(response.data) as FrontendProject,
      } as unknown as ApiResponse<FrontendProject>;
    }
    return response as unknown as ApiResponse<FrontendProject>;
  },

  // Delete project
  delete: async (slug: string) => {
    return api.delete(`/projects/${slug}/`);
  },

  // Increment like count
  like: async (slug: string) => {
    return api.post(`/projects/${slug}/like/`);
  },

  // Increment share count
  share: async (slug: string) => {
    return api.post(`/projects/${slug}/share/`);
  },

  // Publish project
  publish: async (slug: string) => {
    return api.post(`/projects/${slug}/publish/`);
  },
};
