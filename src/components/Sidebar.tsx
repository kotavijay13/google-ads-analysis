
import { LayoutDashboard, TrendingUp, MessageSquare, ListChecks, Users, Settings, LogOut, Link, FileText, PieChart, Search } from "lucide-react";
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
    color: "text-purple-600",
    logo: "🔗"
  },
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    color: "text-blue-600",
    logo: "📊"
  },
  {
    title: "Google Ads",
    path: "/google-ads",
    icon: TrendingUp,
    color: "text-green-600",
    logo: "🅖"
  },
  {
    title: "Meta Ads",
    path: "/meta-ads",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: "text-blue-700",
    logo: "f"
  },
  {
    title: "WhatsApp",
    path: "/whatsapp",
    icon: MessageSquare,
    color: "text-green-500",
    logo: "💬"
  },
  {
    title: "SEO",
    path: "/seo",
    icon: ListChecks,
    color: "text-orange-600",
    logo: "🔍"
  },
  {
    title: "Search Console",
    path: "/search-console",
    icon: Search,
    color: "text-red-600",
    logo: "🌐"
  },
  {
    title: "Leads",
    path: "/leads",
    icon: Users,
    color: "text-indigo-600",
    logo: "👥"
  },
  {
    title: "Forms",
    path: "/forms",
    icon: FileText,
    color: "text-gray-600",
    logo: "📝"
  },
  {
    title: "Competition Analysis",
    path: "/competition",
    icon: PieChart,
    color: "text-pink-600",
    logo: "📈"
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
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.logo}</span>
                      <span>{item.title}</span>
                    </div>
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
