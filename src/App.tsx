
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
import SEOPage from "./pages/SEOPage";
import LeadsPage from "./pages/LeadsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import GoogleCallback from "./pages/GoogleCallback";
import MetaCallback from "./pages/MetaCallback";
import NotFound from "./pages/NotFound";
import MainSidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

// Layout component to conditionally render sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isCallbackPage = location.pathname.includes('callback');
  
  // Hide sidebar on auth pages and callback pages
  const showSidebar = user && !isAuthPage && !isCallbackPage;
  
  return (
    <div className="flex min-h-svh w-full">
      {showSidebar && <MainSidebar />}
      <div className={`flex-1 ${!showSidebar ? 'w-full' : ''}`}>
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
            <Layout>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/google-ads" element={<ProtectedRoute><GoogleAdsPage /></ProtectedRoute>} />
                <Route path="/meta-ads" element={<ProtectedRoute><MetaAdsPage /></ProtectedRoute>} />
                <Route path="/seo" element={<ProtectedRoute><SEOPage /></ProtectedRoute>} />
                <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                <Route path="/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
                <Route path="/google-callback" element={<GoogleCallback />} />
                <Route path="/meta-callback" element={<MetaCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
