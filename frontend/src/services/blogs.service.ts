import { api, ApiResponse } from './api';
import { BlogPost as FrontendBlogPost } from '../types';

// Backend blog interface (snake_case)
interface BackendBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time_minutes: number;
  featured_image: string;
  status: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  view_count: number;
  like_count: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

// Transform backend data to frontend format
function transformBlogData(data: BackendBlogPost): FrontendBlogPost {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    category: data.category,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags,
    readingTimeMinutes: data.reading_time_minutes,
    featuredImage: data.featured_image,
    status: (data.status.charAt(0).toUpperCase() + data.status.slice(1)) as 'Published' | 'Draft',
    publishedAt: data.published_at,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    viewsCount: data.view_count,
    likesCount: data.like_count,
    authorName: data.author_name,
  };
}

// Blog service
export const blogsService = {
  // Get all blog posts
  getAll: async (params?: any) => {
    const response = await api.get<BackendBlogPost[]>('/blog/', params);
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformBlogData) as FrontendBlogPost[],
      } as unknown as ApiResponse<FrontendBlogPost[]>;
    }
    return response as unknown as ApiResponse<FrontendBlogPost[]>;
  },

  // Get single blog post by slug
  getBySlug: async (slug: string) => {
    const response = await api.get<BackendBlogPost>(`/blog/${slug}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformBlogData(response.data) as FrontendBlogPost,
      } as unknown as ApiResponse<FrontendBlogPost>;
    }
    return response as unknown as ApiResponse<FrontendBlogPost>;
  },

  // Create blog post
  create: async (data: Partial<FrontendBlogPost>) => {
    const response = await api.post<BackendBlogPost>('/blog/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformBlogData(response.data) as FrontendBlogPost,
      } as unknown as ApiResponse<FrontendBlogPost>;
    }
    return response as unknown as ApiResponse<FrontendBlogPost>;
  },

  // Update blog post
  update: async (slug: string, data: Partial<FrontendBlogPost>) => {
    const response = await api.put<BackendBlogPost>(`/blog/${slug}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformBlogData(response.data) as FrontendBlogPost,
      } as unknown as ApiResponse<FrontendBlogPost>;
    }
    return response as unknown as ApiResponse<FrontendBlogPost>;
  },

  // Patch blog post
  patch: async (slug: string, data: Partial<FrontendBlogPost>) => {
    const response = await api.patch<BackendBlogPost>(`/blog/${slug}/`, data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformBlogData(response.data) as FrontendBlogPost,
      } as unknown as ApiResponse<FrontendBlogPost>;
    }
    return response as unknown as ApiResponse<FrontendBlogPost>;
  },

  // Delete blog post
  delete: async (slug: string) => {
    return api.delete(`/blog/${slug}/`);
  },
};
