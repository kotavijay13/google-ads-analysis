
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecurityHeaders from '@/components/SecurityHeaders';
import Sidebar from '@/components/Sidebar';
import './App.css';

// Import page components
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import GoogleAdsPage from '@/pages/GoogleAdsPage';
import MetaAdsPage from '@/pages/MetaAdsPage';
import SEOPage from '@/pages/SEOPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import AdminPage from '@/pages/AdminPage';
import CompetitionAnalysis from '@/pages/CompetitionAnalysis';
import FormsPage from '@/pages/FormsPage';
import LeadsPage from '@/pages/LeadsPage';
import WhatsAppPage from '@/pages/WhatsAppPage';
import GoogleCallback from '@/pages/GoogleCallback';
import MetaCallback from '@/pages/MetaCallback';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <SecurityHeaders />
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/google-callback" element={<GoogleCallback />} />
              <Route path="/meta-callback" element={<MetaCallback />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <Index />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/google-ads" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <GoogleAdsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/meta-ads" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <MetaAdsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/seo" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <SEOPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <IntegrationsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <AdminPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/competition" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <CompetitionAnalysis />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/forms" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <FormsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <LeadsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/whatsapp" element={
                <ProtectedRoute>
                  <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 ml-64">
                      <WhatsAppPage />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
