
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
    // Full-screen centered loading indicator
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/80 z-50 w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <span className="mt-4 block text-lg font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  // This prevents flashing content before redirect
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
