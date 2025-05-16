
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-svh w-full">
              <MainSidebar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/google-ads" element={<GoogleAdsPage />} />
                  <Route path="/meta-ads" element={<MetaAdsPage />} />
                  <Route path="/seo" element={<SEOPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/google-callback" element={<GoogleCallback />} />
                  <Route path="/meta-callback" element={<MetaCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
