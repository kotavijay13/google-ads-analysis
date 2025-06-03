
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
  ChevronRight
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
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
  { name: 'Forms', href: '/forms', icon: FileText },
  { name: 'Integrations', href: '/integrations', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900">Merge Insights AI</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'flex-shrink-0 h-5 w-5',
                  isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
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
