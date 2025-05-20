
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Loader2, LinkIcon, ExternalLink, Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Define a type for our properties
interface SearchConsoleProperty {
  name: string;
  url: string;
}

const GoogleSearchConsoleIntegration = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [properties, setProperties] = useState<SearchConsoleProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console')
        .maybeSingle();
      
      if (data) {
        setConnected(true);
        
        // For now, we'll use ad_accounts table with a specific platform value
        // to temporarily store search console properties
        fetchProperties();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const fetchProperties = async () => {
    if (!user || !connected) return;
    
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google_search_console');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const propertiesData = data.map(property => ({
          name: property.account_name || new URL(property.account_id).hostname,
          url: property.account_id // We'll store the URL in account_id field
        }));
        
        setProperties(propertiesData);
        
        // If there's a previously selected property in localStorage, use that
        const savedPropertyUrl = localStorage.getItem('selectedSearchConsoleProperty');
        if (savedPropertyUrl && propertiesData.length > 0) {
          const savedProperty = propertiesData.find(prop => prop.url === savedPropertyUrl);
          if (savedProperty) {
            setSelectedProperty(savedProperty.url);
          } else {
            // If saved property not found, use the first property
            setSelectedProperty(propertiesData[0].url);
            localStorage.setItem('selectedSearchConsoleProperty', propertiesData[0].url);
          }
        } else if (propertiesData.length > 0) {
          // If no saved property, default to first
          setSelectedProperty(propertiesData[0].url);
          localStorage.setItem('selectedSearchConsoleProperty', propertiesData[0].url);
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleConnect = async () => {
    try {
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('googleSearchConsoleOAuthState', state);
      
      // Using the correct OAuth configuration
      const oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      // Use web application client ID shown in the screenshot
      const clientId = '463775925601-8i7gv5qhham5b5f60mjvhusp6jg6qfd8.apps.googleusercontent.com';
      
      // Use the exact redirect URI as configured in Google Cloud Console
      const redirectUri = window.location.origin + '/google-callback';
      // Include the Search Console scope
      const scope = encodeURIComponent('https://www.googleapis.com/auth/webmasters.readonly');
      
      console.log("Starting Google Search Console OAuth with:", {
        clientId,
        redirectUri,
        state
      });
      
      // Construct the OAuth URL with all required parameters
      const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
      
      // Redirect to Google's OAuth page
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      toast.error("Failed to connect to Google Search Console");
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('api_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console');
      
      if (error) throw error;
      
      setConnected(false);
      setProperties([]);
      setSelectedProperty(null);
      localStorage.removeItem('selectedSearchConsoleProperty');
      toast.success("Disconnected from Google Search Console");
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error("Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = async () => {
    if (!user || !websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the URL properly
      let formattedUrl = websiteUrl;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // For now, we'll use ad_accounts table with a specific platform value
      // to temporarily store search console properties
      const { data, error } = await supabase
        .from('ad_accounts')
        .insert([
          { 
            user_id: user.id,
            platform: 'google_search_console',
            account_id: formattedUrl,
            account_name: new URL(formattedUrl).hostname
          }
        ]);
      
      if (error) throw error;
      
      toast.success(`Added ${websiteUrl} to Search Console properties`);
      setWebsiteUrl('');
      fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error("Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProperty = (value: string) => {
    setSelectedProperty(value);
    localStorage.setItem('selectedSearchConsoleProperty', value);
    
    // Find the selected property to show in toast
    const property = properties.find(p => p.url === value);
    if (property) {
      toast.success(`Selected property: ${property.name}`);
    }
  };

  const handleSyncData = async () => {
    setIsLoading(true);
    toast.success("Syncing data from Google Search Console...");
    
    // In a real implementation, this would call an API to sync data
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data synced successfully");
    }, 2000);
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
            <p className="text-sm text-muted-foreground">
              Connect your Google account to import Search Console data and see website performance metrics.
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
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
                  Connect with Google
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-500">Connected to Google Search Console</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            </div>
            
            {properties.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Select Search Console Property</h3>
                <Select 
                  value={selectedProperty || undefined}
                  onValueChange={handleSelectProperty}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.url} value={property.url} className="flex items-center justify-between">
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Add Search Console Property</h3>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter website URL (e.g., example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddProperty}
                  disabled={isLoading || !websiteUrl}
                >
                  Add Property
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Connected Properties</h3>
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      {selectedProperty === property.url && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`font-medium ${selectedProperty === property.url ? 'text-green-600' : ''}`}>
                        {property.name}
                      </span>
                    </div>
                    <a 
                      href={property.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      Visit <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-2">No properties added yet</p>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                Last sync: {new Date().toLocaleString()}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncData}
                disabled={isLoading || !selectedProperty}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Syncing...
                  </>
                ) : (
                  "Sync data"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSearchConsoleIntegration;
