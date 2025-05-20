import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from '@/components/ui/sonner';
import { Loader2, LinkIcon, ExternalLink } from 'lucide-react';

// Define a type for our properties
interface SearchConsoleProperty {
  name: string;
  url: string;
}

const searchConsoleData = [
  { date: '2025-04-20', clicks: 420, impressions: 8500, ctr: 4.9, position: 18 },
  { date: '2025-04-21', clicks: 450, impressions: 9000, ctr: 5.0, position: 17 },
  { date: '2025-04-22', clicks: 470, impressions: 9200, ctr: 5.1, position: 16 },
  { date: '2025-04-23', clicks: 490, impressions: 9400, ctr: 5.2, position: 15 },
  { date: '2025-04-24', clicks: 510, impressions: 9600, ctr: 5.3, position: 15 },
  { date: '2025-04-25', clicks: 530, impressions: 9800, ctr: 5.4, position: 14 },
  { date: '2025-04-26', clicks: 550, impressions: 10000, ctr: 5.5, position: 14 },
  { date: '2025-04-27', clicks: 570, impressions: 10200, ctr: 5.6, position: 13 },
  { date: '2025-04-28', clicks: 590, impressions: 10400, ctr: 5.7, position: 13 },
  { date: '2025-04-29', clicks: 610, impressions: 10600, ctr: 5.8, position: 12 },
  { date: '2025-04-30', clicks: 630, impressions: 10800, ctr: 5.8, position: 12 },
];

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

const SearchConsolePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [properties, setProperties] = useState<SearchConsoleProperty[]>([]);
  const [activeMetric, setActiveMetric] = useState('clicks');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Check if user has connected to Google Search Console
      const { data: tokenData, error: tokenError } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console')
        .maybeSingle();
      
      if (tokenData) {
        setConnected(true);
        
        // Fetch properties from ad_accounts table with google_search_console platform
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('ad_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'google_search_console');
        
        if (propertiesError) throw propertiesError;
        
        if (propertiesData && propertiesData.length > 0) {
          const formattedProperties = propertiesData.map(property => ({
            name: property.account_name || property.account_id,
            url: property.account_id // We're storing the URL in account_id field
          }));
          
          setProperties(formattedProperties);
          
          // Set the first property as selected by default
          if (formattedProperties.length > 0 && !selectedProperty) {
            setSelectedProperty(formattedProperties[0].url);
          }
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes only - would connect to actual SEO data API
  const handleRefresh = () => {
    toast.success("Refreshing Search Console data...");
    checkConnection();
  };

  // Redirect to integrations page to connect
  const goToIntegrations = () => {
    window.location.href = '/integrations';
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Google Search Console" onRefresh={handleRefresh} />

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="lg:w-2/3">
          {connected ? (
            <Card>
              <CardHeader>
                <CardTitle>Search Performance</CardTitle>
                <CardDescription>
                  Key metrics from Google Search Console
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={activeMetric === 'clicks' ? 'default' : 'outline'}
                    onClick={() => setActiveMetric('clicks')}
                  >
                    Clicks
                  </Button>
                  <Button 
                    size="sm" 
                    variant={activeMetric === 'impressions' ? 'default' : 'outline'}
                    onClick={() => setActiveMetric('impressions')}
                  >
                    Impressions
                  </Button>
                  <Button 
                    size="sm" 
                    variant={activeMetric === 'ctr' ? 'default' : 'outline'}
                    onClick={() => setActiveMetric('ctr')}
                  >
                    CTR
                  </Button>
                  <Button 
                    size="sm" 
                    variant={activeMetric === 'position' ? 'default' : 'outline'}
                    onClick={() => setActiveMetric('position')}
                  >
                    Position
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={searchConsoleData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                        tickCount={7}
                      />
                      <YAxis 
                        tickFormatter={(value) => 
                          activeMetric === 'ctr' 
                            ? `${value}%` 
                            : activeMetric === 'position'
                              ? value.toFixed(1)
                              : value >= 1000 
                                ? `${(value/1000).toFixed(1)}k` 
                                : value
                        }
                      />
                      <Tooltip 
                        formatter={(value: any) => [
                          activeMetric === 'ctr' 
                            ? `${value}%` 
                            : activeMetric === 'position'
                              ? value.toFixed(1)
                              : value.toLocaleString(),
                          activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={activeMetric} 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        name={activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Connect Google Search Console</CardTitle>
                <CardDescription>
                  Import and analyze your Google Search Console data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>To view Search Console data, connect your Google account in the Integrations page.</p>
                <Button 
                  onClick={goToIntegrations}
                  className="gap-2"
                >
                  <LinkIcon className="h-4 w-4" />
                  Go to Integrations
                </Button>
              </CardContent>
            </Card>
          )}

          {connected && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5,130</div>
                    <p className="text-xs text-muted-foreground">
                      +15.3% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">96,500</div>
                    <p className="text-xs text-muted-foreground">
                      +8.7% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5.3%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.4% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14.5</div>
                    <p className="text-xs text-muted-foreground">
                      Improved by 3.5 positions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
        
        <div className="lg:w-1/3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>
                Google Search Console connected properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <div className="p-6 text-center border rounded-lg">
                  <p className="text-muted-foreground">
                    No properties connected yet.
                  </p>
                  <p className="mt-2 text-sm">
                    Connect your Google account in the Integrations page.
                  </p>
                  <Button 
                    onClick={goToIntegrations}
                    className="mt-4 gap-2"
                    variant="outline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Go to Integrations
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-500">Connected</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToIntegrations}
                    >
                      Manage
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Connected Properties</h3>
                    {properties.length > 0 ? (
                      properties.map((property, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between py-2 border-b last:border-0 ${selectedProperty === property.url ? 'bg-muted/90 -mx-2 px-2 rounded' : ''}`}
                          onClick={() => setSelectedProperty(property.url)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="font-medium">{property.name}</span>
                          <a 
                            href={property.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-2">No properties found</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      Last sync: Just now
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isLoading}
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
        </div>
      </div>

      {connected && (
        <Tabs defaultValue="queries">
          <TabsList>
            <TabsTrigger value="queries">Top Queries</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Top Search Queries</CardTitle>
                <CardDescription>
                  Search terms bringing visitors to your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Query</th>
                        <th className="text-right pb-2">Clicks</th>
                        <th className="text-right pb-2">Impressions</th>
                        <th className="text-right pb-2">CTR</th>
                        <th className="text-right pb-2">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">digital marketing services</td>
                        <td className="py-3 text-right">356</td>
                        <td className="py-3 text-right">5,432</td>
                        <td className="py-3 text-right">6.6%</td>
                        <td className="py-3 text-right">3.2</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">seo company near me</td>
                        <td className="py-3 text-right">289</td>
                        <td className="py-3 text-right">4,765</td>
                        <td className="py-3 text-right">6.1%</td>
                        <td className="py-3 text-right">4.5</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">social media marketing agency</td>
                        <td className="py-3 text-right">243</td>
                        <td className="py-3 text-right">3,987</td>
                        <td className="py-3 text-right">6.1%</td>
                        <td className="py-3 text-right">5.1</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">ppc management services</td>
                        <td className="py-3 text-right">198</td>
                        <td className="py-3 text-right">2,876</td>
                        <td className="py-3 text-right">6.9%</td>
                        <td className="py-3 text-right">4.7</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">content marketing strategy</td>
                        <td className="py-3 text-right">167</td>
                        <td className="py-3 text-right">2,345</td>
                        <td className="py-3 text-right">7.1%</td>
                        <td className="py-3 text-right">6.3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>
                  Pages with highest visibility in search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Page</th>
                          <th className="text-right pb-2">Clicks</th>
                          <th className="text-right pb-2">Impressions</th>
                          <th className="text-right pb-2">CTR</th>
                          <th className="text-right pb-2">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">/services</td>
                          <td className="py-3 text-right">245</td>
                          <td className="py-3 text-right">3,870</td>
                          <td className="py-3 text-right">6.3%</td>
                          <td className="py-3 text-right">4.1</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">/about</td>
                          <td className="py-3 text-right">189</td>
                          <td className="py-3 text-right">2,980</td>
                          <td className="py-3 text-right">6.3%</td>
                          <td className="py-3 text-right">5.2</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">/blog/seo-tips</td>
                          <td className="py-3 text-right">156</td>
                          <td className="py-3 text-right">2,450</td>
                          <td className="py-3 text-right">6.4%</td>
                          <td className="py-3 text-right">3.8</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">/contact</td>
                          <td className="py-3 text-right">132</td>
                          <td className="py-3 text-right">1,980</td>
                          <td className="py-3 text-right">6.7%</td>
                          <td className="py-3 text-right">5.5</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">/testimonials</td>
                          <td className="py-3 text-right">105</td>
                          <td className="py-3 text-right">1,650</td>
                          <td className="py-3 text-right">6.4%</td>
                          <td className="py-3 text-right">7.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-lg">
                    <p className="text-muted-foreground">
                      Select a property to view top pages.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="countries">
            <Card>
              <CardHeader>
                <CardTitle>Countries</CardTitle>
                <CardDescription>
                  Search traffic by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Country</th>
                          <th className="text-right pb-2">Clicks</th>
                          <th className="text-right pb-2">Impressions</th>
                          <th className="text-right pb-2">CTR</th>
                          <th className="text-right pb-2">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">United States</td>
                          <td className="py-3 text-right">2,145</td>
                          <td className="py-3 text-right">38,700</td>
                          <td className="py-3 text-right">5.5%</td>
                          <td className="py-3 text-right">12.3</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">United Kingdom</td>
                          <td className="py-3 text-right">985</td>
                          <td className="py-3 text-right">18,900</td>
                          <td className="py-3 text-right">5.2%</td>
                          <td className="py-3 text-right">13.8</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Canada</td>
                          <td className="py-3 text-right">720</td>
                          <td className="py-3 text-right">14,500</td>
                          <td className="py-3 text-right">5.0%</td>
                          <td className="py-3 text-right">14.2</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Australia</td>
                          <td className="py-3 text-right">612</td>
                          <td className="py-3 text-right">12,800</td>
                          <td className="py-3 text-right">4.8%</td>
                          <td className="py-3 text-right">15.1</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Germany</td>
                          <td className="py-3 text-right">445</td>
                          <td className="py-3 text-right">9,300</td>
                          <td className="py-3 text-right">4.8%</td>
                          <td className="py-3 text-right">16.7</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-lg">
                    <p className="text-muted-foreground">
                      Select a property to view country data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>
                  Search traffic by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Device</th>
                          <th className="text-right pb-2">Clicks</th>
                          <th className="text-right pb-2">Impressions</th>
                          <th className="text-right pb-2">CTR</th>
                          <th className="text-right pb-2">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Mobile</td>
                          <td className="py-3 text-right">2,985</td>
                          <td className="py-3 text-right">58,400</td>
                          <td className="py-3 text-right">5.1%</td>
                          <td className="py-3 text-right">14.8</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Desktop</td>
                          <td className="py-3 text-right">1,745</td>
                          <td className="py-3 text-right">32,100</td>
                          <td className="py-3 text-right">5.4%</td>
                          <td className="py-3 text-right">13.7</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Tablet</td>
                          <td className="py-3 text-right">400</td>
                          <td className="py-3 text-right">6,000</td>
                          <td className="py-3 text-right">6.7%</td>
                          <td className="py-3 text-right">15.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-lg">
                    <p className="text-muted-foreground">
                      Select a property to view device data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SearchConsolePage;
