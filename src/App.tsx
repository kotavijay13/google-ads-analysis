
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { SEOProvider } from '@/context/SEOContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import GoogleAdsPage from '@/pages/GoogleAdsPage';
import MetaAdsPage from '@/pages/MetaAdsPage';
import SEOPage from '@/pages/SEOPage';
import CompetitionAnalysis from '@/pages/CompetitionAnalysis';
import LeadsPage from '@/pages/LeadsPage';
import LeadAdminPage from '@/pages/LeadAdminPage';
import ChatsPage from '@/pages/ChatsPage';
import FormsPage from '@/pages/FormsPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import AuthPage from '@/pages/AuthPage';
import AdminPage from '@/pages/AdminPage';
import GoogleCallback from '@/pages/GoogleCallback';
import MetaCallback from '@/pages/MetaCallback';
import NotFound from '@/pages/NotFound';
import LeadDetailPage from '@/pages/LeadDetailPage';

const queryClient = new QueryClient();

// Component to conditionally render layout with sidebar
function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isCallbackPage = location.pathname.includes('/callback') || location.pathname.includes('-callback');
  
  // Don't show sidebar on auth page or callback pages
  const shouldShowSidebar = !isAuthPage && !isCallbackPage;

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {shouldShowSidebar && <Sidebar />}
      <div className={`flex-1 transition-all duration-300 ${shouldShowSidebar ? 'lg:ml-64' : ''}`}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/meta/callback" element={<MetaCallback />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/google-ads" element={<ProtectedRoute><GoogleAdsPage /></ProtectedRoute>} />
          <Route path="/meta-ads" element={<ProtectedRoute><MetaAdsPage /></ProtectedRoute>} />
          <Route path="/seo" element={<ProtectedRoute><SEOPage /></ProtectedRoute>} />
          <Route path="/competition" element={<ProtectedRoute><CompetitionAnalysis /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
          <Route path="/leads/:id" element={<ProtectedRoute><LeadDetailPage /></ProtectedRoute>} />
          <Route path="/lead-admin" element={<ProtectedRoute><LeadAdminPage /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />
          <Route path="/forms" element={<ProtectedRoute><FormsPage /></ProtectedRoute>} />
          <Route path="/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SEOProvider>
          <Router>
            <AppLayout />
            <Toaster />
          </Router>
        </SEOProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
