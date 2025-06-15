
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Link } from 'lucide-react';

interface WebsiteFilterCardProps {
  selectedWebsite: string;
  availableWebsites: string[];
  onWebsiteChange: (website: string) => void;
  onConnect: () => void;
}

const WebsiteFilterCard = ({ selectedWebsite, availableWebsites, onWebsiteChange, onConnect }: WebsiteFilterCardProps) => {
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
            disabled={!selectedWebsite || selectedWebsite === 'All'}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Link className="h-4 w-4" />
            Connect
          </Button>
        </div>
        
        {selectedWebsite !== 'All' && selectedWebsite && (
          <div className="text-sm text-gray-600 mt-4">
            Ready to connect to: <span className="font-semibold text-blue-600">{selectedWebsite}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteFilterCard;
