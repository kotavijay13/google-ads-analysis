
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

  // Show loading only when actually loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <span className="mt-4 block text-lg font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // If not loading and no user, show nothing (redirect will happen)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
