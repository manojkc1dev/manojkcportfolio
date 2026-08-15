import { api } from './api';

// Newsletter interfaces
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

// Newsletter service
export const newsletterService = {
  // Get all subscribers
  getAll: async (params?: any) => {
    return api.get<NewsletterSubscriber[]>('/newsletter/', params);
  },

  // Subscribe
  subscribe: async (email: string, source?: string) => {
    return api.post<NewsletterSubscriber>('/newsletter/', { email, source });
  },

  // Unsubscribe
  unsubscribe: async (email: string) => {
    return api.post('/newsletter/unsubscribe/', { email });
  },

  // Delete subscriber
  delete: async (id: string) => {
    return api.delete(`/newsletter/${id}/`);
  },
};
