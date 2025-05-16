
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';
import MetaAdsIntegration from '@/components/MetaAdsIntegration';

const IntegrationsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="API Integrations" onRefresh={handleRefresh} />
      
      <div className="grid gap-8 mt-8">
        <GoogleAdsIntegration />
        <MetaAdsIntegration />
      </div>
    </div>
  );
};

export default IntegrationsPage;
