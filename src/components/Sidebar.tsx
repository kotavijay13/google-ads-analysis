
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
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Google Ads', href: '/google-ads', icon: Target },
  { name: 'Meta Ads', href: '/meta-ads', icon: BarChart3 },
  { name: 'SEO', href: '/seo', icon: TrendingUp },
  { name: 'Competition Analysis', href: '/competition', icon: Zap },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Lead Administration', href: '/lead-admin', icon: UserCog },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
  { name: 'Forms', href: '/forms', icon: FileText },
  { name: 'Integrations', href: '/integrations', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-blue-600 shadow-lg transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-0 h-screen z-10",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">Merge Insights AI</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-white hover:bg-blue-500 hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'flex-shrink-0 h-5 w-5',
                  isActive ? 'text-white' : 'text-blue-200 group-hover:text-white',
                  isCollapsed ? 'mx-auto' : 'mr-3'
                )}
                aria-hidden="true"
              />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
