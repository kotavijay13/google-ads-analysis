
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Link } from 'lucide-react';

interface WebsiteFilterCardProps {
  selectedWebsite: string;
  connectedWebsite: string;
  availableWebsites: string[];
  onWebsiteChange: (website: string) => void;
  onConnect: () => void;
}

const WebsiteFilterCard = ({ selectedWebsite, connectedWebsite, availableWebsites, onWebsiteChange, onConnect }: WebsiteFilterCardProps) => {
  // Check if the selected website is actually in the available websites list (meaning it has connected forms)
  const isActuallyConnected = selectedWebsite && selectedWebsite !== 'All' && availableWebsites.includes(selectedWebsite);
  
  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Website Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 flex-1">
            <label className="text-sm font-medium text-gray-700 min-w-fit">
              Select Website:
            </label>
            <Select value={selectedWebsite} onValueChange={onWebsiteChange}>
              <SelectTrigger className="w-full lg:w-80">
                <SelectValue placeholder="Choose a website to view leads" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="All">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    All Websites
                  </div>
                </SelectItem>
                {availableWebsites.map((website) => (
                  <SelectItem key={website} value={website}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {website}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onConnect}
            disabled={!selectedWebsite || selectedWebsite === 'All' || isActuallyConnected}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Link className="h-4 w-4" />
            {isActuallyConnected ? 'Connected' : 'Connect'}
          </Button>
        </div>
        
        {selectedWebsite !== 'All' && selectedWebsite && !isActuallyConnected && (
          <div className="text-sm text-orange-600 mt-4">
            This website is not connected. Click "Connect" to set up form tracking for: <span className="font-semibold">{selectedWebsite}</span>
          </div>
        )}
        {isActuallyConnected && (
            <div className="text-sm text-green-600 mt-4">
                Connected to: <span className="font-semibold">{selectedWebsite}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteFilterCard;
