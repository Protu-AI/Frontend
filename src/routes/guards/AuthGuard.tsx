import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { APP_CONFIG } from '@/config/constants';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={APP_CONFIG.ROUTES.AUTH} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}