
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Settings, User } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onRefresh: () => void;
  title: string;
  isLoading?: boolean;
}

const Header = ({ onRefresh, title, isLoading }: HeaderProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { accounts, currentAccount, switchAccount } = useGoogleAccounts();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Brain size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold flex items-center text-primary">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleRefresh} size="sm" disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
              <span className="sr-only">Marketing Account</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Marketing Account</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || 'marketing@example.com'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="py-2 px-2 text-sm font-medium">Select Marketing Account</div>
            <div className="max-h-60 overflow-auto px-1">
              {accounts.map(account => (
                <DropdownMenuItem key={account.id} onClick={() => handleAccountSwitch(account)} className="cursor-pointer mb-1">
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {account.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground">ID: {account.id} • {account.email}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
