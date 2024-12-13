// Application-wide constants
export const APP_CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  QUERY: {
    STALE_TIME: 1000 * 60 * 5, // 5 minutes
    CACHE_TIME: 1000 * 60 * 30, // 30 minutes
  },
  ROUTES: {
    HOME: '/',
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
  },
} as const;