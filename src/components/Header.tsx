
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChartColumnBig, ChartBar, LineChart, Settings, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGoogleAccounts, GoogleAccount } from "@/hooks/use-google-accounts";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  onRefresh: () => void;
}

const Header = ({ onRefresh }: HeaderProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { accounts, currentAccount, switchAccount } = useGoogleAccounts();

  const handleRefresh = () => {
    setLastUpdated(new Date());
    onRefresh();
  };

  const handleAccountSwitch = (account: GoogleAccount) => {
    if (switchAccount(account.id)) {
      toast({
        title: "Account switched",
        description: `Now using ${account.name}`,
      });
    }
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Avatar className="h-6 w-6 mr-1">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {currentAccount.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{currentAccount.name}</span>
                <span className="text-xs text-muted-foreground">ID: {currentAccount.id}</span>
              </div>
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              <div className="text-sm font-medium px-2 py-1.5">
                Switch Google Ads Account
              </div>
              {accounts.map(account => (
                <Button
                  key={account.id}
                  variant={account.id === currentAccount.id ? "secondary" : "ghost"}
                  className="justify-start text-sm"
                  onClick={() => handleAccountSwitch(account)}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {account.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span>{account.name}</span>
                    <span className="text-xs text-muted-foreground">ID: {account.id} • {account.email}</span>
                  </div>
                </Button>
              ))}
              <DropdownMenuSeparator className="my-1" />
              <Button variant="ghost" size="sm" className="justify-start text-sm">
                <Settings size={16} className="mr-2" />
                <span>Manage accounts</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

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
