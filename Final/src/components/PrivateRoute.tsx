import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import type { Role } from '../types/data';

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <p className="state">Перевіряємо вхід...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/requests" replace />;
  }

  return <>{children}</>;
}
