
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ExternalLink, RefreshCw, Loader2, LinkIcon, CheckCircle2 } from 'lucide-react';

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
  // Filter out empty, null, or undefined websites
  const validWebsites = availableWebsites.filter(website => 
    website && typeof website === 'string' && website.trim().length > 0
  );

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-fit">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Globe className="h-3 w-3 text-blue-600" />
          </div>
          Website Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
            Select Website
          </label>
          <Select value={selectedWebsite || ''} onValueChange={onWebsiteChange}>
            <SelectTrigger className="w-full h-8 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 transition-colors text-xs">
              <SelectValue placeholder="Choose a website to analyze" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {validWebsites.map((website) => (
                <SelectItem key={website} value={website} className="rounded-md text-xs">
                  <div className="flex items-center gap-2 py-0.5">
                    <Globe className="h-3 w-3 text-blue-600" />
                    <span className="font-medium truncate max-w-[200px]">{website}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedWebsite && (
          <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="p-1 bg-blue-500 rounded-md">
                  <Globe className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-blue-700">Selected Website</p>
                  <p className="text-xs font-bold text-blue-900 truncate">{selectedWebsite}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://${selectedWebsite}`, '_blank')}
                className="p-1 h-6 w-6 hover:bg-blue-100 rounded-md flex-shrink-0"
              >
                <ExternalLink className="h-2.5 w-2.5 text-blue-600" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={connected ? () => {} : onConnect}
            disabled={gscLoading}
            variant={connected ? "secondary" : "default"}
            className={`flex items-center gap-2 w-full h-8 rounded-lg font-medium transition-all duration-200 text-xs ${
              connected 
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {gscLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : connected ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <LinkIcon className="h-3 w-3" />
            )}
            {connected ? 'Connected to GSC' : 'Connect Google Search Console'}
          </Button>
          
          <Button 
            onClick={onRefresh}
            disabled={isRefreshing || !selectedWebsite}
            variant="outline"
            className="flex items-center gap-2 w-full h-8 rounded-lg font-medium border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-xs"
          >
            {isRefreshing ? (
              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
            ) : (
              <RefreshCw className="h-3 w-3 text-blue-600" />
            )}
            <span className={isRefreshing ? 'text-blue-600' : 'text-gray-700'}>
              {isRefreshing ? 'Refreshing Data...' : 'Refresh SEO Data'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteSelector;
