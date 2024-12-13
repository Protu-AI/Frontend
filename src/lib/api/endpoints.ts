import { apiClient } from './client';
import type { User, LoginCredentials, RegisterData } from '@/types/auth';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: RegisterData) =>
    apiClient.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient.request('/auth/logout', {
      method: 'POST',
    }),
} as const;