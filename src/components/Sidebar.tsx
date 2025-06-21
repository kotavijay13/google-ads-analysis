import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Settings, 
  Users, 
  MessageSquare, 
  FileText, 
  Zap,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Menu,
  X,
  Package,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'AI Insights', href: '/', icon: Brain },
  { name: 'Google Ads', href: '/google-ads', icon: Target },
  { name: 'Meta Ads', href: '/meta-ads', icon: BarChart3 },
  { name: 'SEO Report', href: '/seo', icon: TrendingUp },
  { name: 'Competition Analysis', href: '/competition', icon: Zap },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Product Sales', href: '/product-sales', icon: Package },
  { name: 'Lead Administration', href: '/lead-admin', icon: UserCog },
  { name: 'Chats', href: '/chats', icon: MessageSquare },
  { name: 'Forms', href: '/forms', icon: FileText },
  { name: 'Integrations', href: '/integrations', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white hover:bg-blue-700"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-blue-600 shadow-lg transition-all duration-300 ease-in-out flex flex-col h-screen z-40",
        // Desktop styles
        "hidden lg:flex lg:fixed lg:left-0 lg:top-0",
        isCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile styles
        isMobile ? (
          isMobileOpen 
            ? "fixed left-0 top-0 w-64 flex" 
            : "hidden"
        ) : ""
      )}>
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          {(!isCollapsed || isMobile) && (
            <h1 className="text-lg lg:text-xl font-bold text-white truncate">
              Merge Insights AI
            </h1>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1.5 text-white hover:bg-blue-500 hover:text-white"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileSidebar}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                )}
                title={isCollapsed && !isMobile ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-5 w-5',
                    isActive ? 'text-white' : 'text-blue-200 group-hover:text-white',
                    (isCollapsed && !isMobile) ? 'mx-auto' : 'mr-3'
                  )}
                  aria-hidden="true"
                />
                {(!isCollapsed || isMobile) && item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
