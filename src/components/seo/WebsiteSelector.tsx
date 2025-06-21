
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
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          Website Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Select Website
          </label>
          <Select value={selectedWebsite || ''} onValueChange={onWebsiteChange}>
            <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Choose a website to analyze" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {validWebsites.map((website) => (
                <SelectItem key={website} value={website} className="rounded-lg">
                  <div className="flex items-center gap-3 py-1">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{website}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedWebsite && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Selected Website</p>
                  <p className="text-lg font-bold text-blue-900">{selectedWebsite}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://${selectedWebsite}`, '_blank')}
                className="p-2 h-8 w-8 hover:bg-blue-100 rounded-lg"
              >
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={connected ? () => {} : onConnect}
            disabled={gscLoading}
            variant={connected ? "secondary" : "default"}
            className={`flex items-center gap-3 w-full h-12 rounded-xl font-medium transition-all duration-200 ${
              connected 
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {gscLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : connected ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            {connected ? 'Connected to GSC' : 'Connect Google Search Console'}
          </Button>
          
          <Button 
            onClick={onRefresh}
            disabled={isRefreshing || !selectedWebsite}
            variant="outline"
            className="flex items-center gap-3 w-full h-12 rounded-xl font-medium border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <RefreshCw className="h-4 w-4 text-blue-600" />
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
