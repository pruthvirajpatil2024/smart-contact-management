import axios from 'axios';
import { Contact } from '../types';
const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to the backend server. Please ensure the server is running on http://localhost:8081');
    }
    
    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error occurred. Please try again later');
    }
    
    throw error;
  }
);

export const contactsApi = {
  // Get all contacts
  getAll: async (): Promise<Contact[]> => {
    try {
      const response = await api.get<Contact[]>('/contacts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      // Return mock data if backend is not available
      return [];
    }
  },

  // Get single contact
  getById: async (id: string): Promise<Contact> => {
    const response = await api.get<Contact>(`/contacts/${id}`);
    return response.data;
  },

  // Create new contact
  create: async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts', contact);
    return response.data;
  },

  // Update contact
  update: async (id: string, contact: Partial<Contact>): Promise<Contact> => {
    const response = await api.put<Contact>(`/contacts/${id}`, contact);
    return response.data;
  },

  // Delete contact
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },

  // Search contacts
  search: async (query: string): Promise<Contact[]> => {
    const response = await api.get<Contact[]>(`/contacts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Export contacts
  export: async (): Promise<void> => {
    try {
      const response = await api.get('/contacts/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export contacts');
    }
  },

  // Import contacts
  import: async (file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ message: string }>('/contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Sync contacts
  sync: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/contacts/sync');
    return response.data;
  },
};
