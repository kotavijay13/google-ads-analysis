
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading && !user && location.pathname !== '/auth') {
      console.log('No user detected, redirecting to auth page');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Only render children if user is authenticated
  // This prevents flashing content before redirect
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
