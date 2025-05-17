
import { LayoutDashboard, TrendingUp, Facebook, ListChecks, Users, Settings, LogOut, Link, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const navigationItems = [
  {
    title: "Integrations",
    path: "/integrations",
    icon: Link,
  },
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Google Ads",
    path: "/google-ads",
    icon: TrendingUp,
  },
  {
    title: "Meta Ads",
    path: "/meta-ads",
    icon: Facebook,
  },
  {
    title: "WhatsApp",
    path: "/whatsapp",
    icon: MessageSquare,
  },
  {
    title: "SEO",
    path: "/seo",
    icon: ListChecks,
  },
  {
    title: "Leads",
    path: "/leads",
    icon: Users,
  },
  {
    title: "Admin",
    path: "/admin",
    icon: Settings,
  }
];

export const MainSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      // Don't need to navigate here, the ProtectedRoute will handle it
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };

  // Don't render sidebar during loading or if no user
  if (loading || !user) return null;

  // Don't render sidebar on auth pages
  if (location.pathname === '/auth') return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 py-3 mb-2">
              <h1 className="text-xl font-bold">Merge Insights AI</h1>
            </div>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={currentPath === item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "cursor-pointer",
                      currentPath === item.path && "bg-primary/10"
                    )}
                    tooltip={item.title}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button 
            variant="ghost" 
            className="w-full flex justify-start" 
            onClick={handleSignOut}
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
