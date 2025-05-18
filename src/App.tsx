
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import GoogleAdsPage from "./pages/GoogleAdsPage";
import MetaAdsPage from "./pages/MetaAdsPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import SEOPage from "./pages/SEOPage";
import LeadsPage from "./pages/LeadsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import FormsPage from "./pages/FormsPage";
import CompetitionAnalysis from "./pages/CompetitionAnalysis";
import GoogleCallback from "./pages/GoogleCallback";
import MetaCallback from "./pages/MetaCallback";
import NotFound from "./pages/NotFound";
import MainSidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Layout component to conditionally render sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Don't wrap auth page or callback pages with sidebar
  const isAuthPage = location.pathname === '/auth';
  const isCallbackPage = location.pathname.includes('callback');
  
  if (isAuthPage || isCallbackPage) {
    return <>{children}</>;
  }
  
  // For all other routes, use the normal layout with sidebar
  return (
    <div className="flex min-h-svh w-full bg-gray-50">
      <MainSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider defaultOpen={true}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/google-callback" element={<GoogleCallback />} />
              <Route path="/meta-callback" element={<MetaCallback />} />
              <Route path="/" element={
                <Layout>
                  <ProtectedRoute><Index /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/google-ads" element={
                <Layout>
                  <ProtectedRoute><GoogleAdsPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/meta-ads" element={
                <Layout>
                  <ProtectedRoute><MetaAdsPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/whatsapp" element={
                <Layout>
                  <ProtectedRoute><WhatsAppPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/seo" element={
                <Layout>
                  <ProtectedRoute><SEOPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/leads" element={
                <Layout>
                  <ProtectedRoute><LeadsPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/forms" element={
                <Layout>
                  <ProtectedRoute><FormsPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin" element={
                <Layout>
                  <ProtectedRoute><AdminPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/integrations" element={
                <Layout>
                  <ProtectedRoute><IntegrationsPage /></ProtectedRoute>
                </Layout>
              } />
              <Route path="/competition" element={
                <Layout>
                  <ProtectedRoute><CompetitionAnalysis /></ProtectedRoute>
                </Layout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
