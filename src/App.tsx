
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import GoogleAdsPage from "./pages/GoogleAdsPage";
import MetaAdsPage from "./pages/MetaAdsPage";
import SearchConsolePage from "./pages/SearchConsolePage";
import SEOPage from "./pages/SEOPage";
import CompetitionAnalysis from "./pages/CompetitionAnalysis";
import IntegrationsPage from "./pages/IntegrationsPage";
import AdminPage from "./pages/AdminPage";
import GoogleCallback from "./pages/GoogleCallback";
import MetaCallback from "./pages/MetaCallback";
import LeadsPage from "./pages/LeadsPage";
import FormsPage from "./pages/FormsPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route path="/meta-callback" element={<MetaCallback />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/google-ads" element={
              <ProtectedRoute>
                <GoogleAdsPage />
              </ProtectedRoute>
            } />
            <Route path="/meta-ads" element={
              <ProtectedRoute>
                <MetaAdsPage />
              </ProtectedRoute>
            } />
            <Route path="/search-console" element={
              <ProtectedRoute>
                <SearchConsolePage />
              </ProtectedRoute>
            } />
            <Route path="/seo" element={
              <ProtectedRoute>
                <SEOPage />
              </ProtectedRoute>
            } />
            <Route path="/competition" element={
              <ProtectedRoute>
                <CompetitionAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/integrations" element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute>
                <LeadsPage />
              </ProtectedRoute>
            } />
            <Route path="/forms" element={
              <ProtectedRoute>
                <FormsPage />
              </ProtectedRoute>
            } />
            <Route path="/whatsapp" element={
              <ProtectedRoute>
                <WhatsAppPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
