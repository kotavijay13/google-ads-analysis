
import { LayoutDashboard, TrendingUp, Facebook, ListChecks, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
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
    title: "SEO",
    path: "/seo",
    icon: ListChecks,
  },
  {
    title: "Leads",
    path: "/leads",
    icon: Users,
  },
];

export const MainSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
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
    </Sidebar>
  );
};

export default MainSidebar;
