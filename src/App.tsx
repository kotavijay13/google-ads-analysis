
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import GoogleAdsPage from "./pages/GoogleAdsPage";
import MetaAdsPage from "./pages/MetaAdsPage";
import SEOPage from "./pages/SEOPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import GoogleCallback from "./pages/GoogleCallback";
import MetaCallback from "./pages/MetaCallback";
import LeadsPage from "./pages/LeadsPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import FormsPage from "./pages/FormsPage";
import CompetitionAnalysis from "./pages/CompetitionAnalysis";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/google-callback" element={<GoogleCallback />} />
                <Route path="/meta-callback" element={<MetaCallback />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/google-ads" element={<GoogleAdsPage />} />
                            <Route path="/meta-ads" element={<MetaAdsPage />} />
                            <Route path="/seo" element={<SEOPage />} />
                            <Route path="/integrations" element={<IntegrationsPage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/leads" element={<LeadsPage />} />
                            <Route path="/whatsapp" element={<WhatsAppPage />} />
                            <Route path="/forms" element={<FormsPage />} />
                            <Route path="/competition" element={<CompetitionAnalysis />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
