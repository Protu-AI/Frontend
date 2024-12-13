import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/auth';
import { APP_CONFIG } from '@/config/constants';
import type { LoginCredentials, RegisterData } from '@/types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.token);
      navigate(APP_CONFIG.ROUTES.DASHBOARD);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.token);
      navigate(APP_CONFIG.ROUTES.DASHBOARD);
    },
  });

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate(APP_CONFIG.ROUTES.HOME);
    }
  }, [clearAuth, navigate]);

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
}