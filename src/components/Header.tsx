
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChartColumnBig, ChartBar, LineChart, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onRefresh: () => void;
}

const Header = ({ onRefresh }: HeaderProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    onRefresh();
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <LineChart size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Google Ads Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ChartBar size={16} />
          <span>Reports</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ChartColumnBig size={16} />
          <span>Analytics</span>
        </Button>
        <Button onClick={handleRefresh} size="sm">Refresh Data</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
              <span className="sr-only">Google Account</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Marketing Account</span>
                <span className="text-xs text-muted-foreground">marketing@example.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
