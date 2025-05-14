
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChartColumnBig, ChartBar, Google } from "lucide-react";

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
          <Google size={24} className="text-blue-600" />
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
      </div>
    </header>
  );
};

export default Header;
