
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface WebsiteFilterCardProps {
  selectedWebsite: string;
  availableWebsites: string[];
  onWebsiteChange: (website: string) => void;
}

const WebsiteFilterCard = ({ selectedWebsite, availableWebsites, onWebsiteChange }: WebsiteFilterCardProps) => {
  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Website Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 min-w-fit">
            Select Website:
          </label>
          <Select value={selectedWebsite} onValueChange={onWebsiteChange}>
            <SelectTrigger className="w-80">
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
          {selectedWebsite !== 'All' && (
            <div className="text-sm text-gray-600">
              Showing leads from: <span className="font-semibold text-blue-600">{selectedWebsite}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteFilterCard;
