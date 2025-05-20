
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Loader2, LinkIcon, ExternalLink } from 'lucide-react';

const GoogleSearchConsoleIntegration = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [properties, setProperties] = useState<{name: string, url: string}[]>([]);

  // This would be replaced with actual integration if the Google Search Console API was implemented
  const handleConnect = () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }
    
    setIsLoading(true);
    
    // Normally this would use Google OAuth flow and APIs
    // This is a simulated implementation for UI purposes
    setTimeout(() => {
      setConnected(true);
      setProperties([
        { 
          name: websiteUrl,
          url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        }
      ]);
      toast.success(`Connected to Google Search Console for ${websiteUrl}`);
      setIsLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setProperties([]);
    toast.success("Disconnected from Google Search Console");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Search Console Integration</CardTitle>
        <CardDescription>
          Connect to Google Search Console to import your SEO data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your website URL (e.g., example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleConnect} 
                disabled={isLoading || !websiteUrl}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting will allow Merge Insights AI to import SEO data and provide better analytics.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-500">Connected</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Connected Properties</h3>
              {properties.map((property, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{property.name}</span>
                  <a 
                    href={property.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    Visit <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                Last sync: Just now
              </span>
              <Button variant="outline" size="sm">
                Sync data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSearchConsoleIntegration;
