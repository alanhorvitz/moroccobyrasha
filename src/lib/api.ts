import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

// User API functions
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  create: async (userData: { email: string; name?: string }): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Post API functions
export const postApi = {
  getAll: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },

  create: async (postData: { title: string; content?: string; authorId: number }): Promise<Post> => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  update: async (id: number, postData: Partial<Post>): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  getByAuthor: async (authorId: number): Promise<Post[]> => {
    const response = await api.get(`/posts?authorId=${authorId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api; 