import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute() {
  const { signed, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-purple border-t-transparent"></div>
      </div>
    );
  }


  return signed ? <Outlet /> : <Navigate to="/login" />;
}