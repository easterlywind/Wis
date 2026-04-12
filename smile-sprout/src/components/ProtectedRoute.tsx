import { Navigate } from 'react-router-dom';
import { hasActiveSession } from '@/lib/auth-session';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Route guard – redirect về trang Auth nếu chưa đăng nhập.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!hasActiveSession()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
