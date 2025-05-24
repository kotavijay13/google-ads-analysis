
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ExternalLink, RefreshCw, Loader2, LinkIcon } from 'lucide-react';

interface WebsiteSelectorProps {
  selectedWebsite: string;
  availableWebsites: string[];
  connected: boolean;
  gscLoading: boolean;
  isRefreshing: boolean;
  onWebsiteChange: (website: string) => void;
  onConnect: () => void;
  onRefresh: () => void;
}

const WebsiteSelector = ({
  selectedWebsite,
  availableWebsites,
  connected,
  gscLoading,
  isRefreshing,
  onWebsiteChange,
  onConnect,
  onRefresh
}: WebsiteSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Website Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Website
          </label>
          <Select value={selectedWebsite} onValueChange={onWebsiteChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a website" />
            </SelectTrigger>
            <SelectContent>
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
        
        <div className="flex items-center gap-2 pt-2">
          <span className="text-lg font-semibold text-blue-600">{selectedWebsite}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://${selectedWebsite}`, '_blank')}
            className="p-1 h-6 w-6"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={connected ? () => {} : onConnect}
            disabled={gscLoading}
            variant={connected ? "secondary" : "default"}
            className="flex items-center gap-2 w-full"
          >
            {gscLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            {connected ? 'Connected to GSC' : 'Connect Google Search Console'}
          </Button>
          
          <Button 
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2 w-full"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteSelector;
