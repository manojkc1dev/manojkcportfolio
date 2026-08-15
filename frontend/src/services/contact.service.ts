import { api } from './api';

// Contact interfaces
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  ip: string;
  country: string;
  browser: string;
  device: string;
  status: string;
  starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Contact service
export const contactService = {
  // Get all contact messages
  getAll: async (params?: any) => {
    return api.get<ContactMessage[]>('/contact/', params);
  },

  // Get single contact message
  getById: async (id: string) => {
    return api.get<ContactMessage>(`/contact/${id}/`);
  },

  // Submit contact form
  submit: async (data: ContactFormData) => {
    return api.post<ContactMessage>('/contact/', data);
  },

  // Update contact message
  update: async (id: string, data: Partial<ContactMessage>) => {
    return api.put<ContactMessage>(`/contact/${id}/`, data);
  },

  // Patch contact message
  patch: async (id: string, data: Partial<ContactMessage>) => {
    return api.patch<ContactMessage>(`/contact/${id}/`, data);
  },

  // Delete contact message
  delete: async (id: string) => {
    return api.delete(`/contact/${id}/`);
  },
};
