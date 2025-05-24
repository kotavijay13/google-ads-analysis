
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ExternalLink, RefreshCw, Loader2, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { useSearchConsoleIntegration } from '@/components/google-search-console/useSearchConsoleIntegration';

// Top pages sample data
const topPages = [
  { url: '/homepage', impressions: 3500, clicks: 320, ctr: 9.1, position: 2.3 },
  { url: '/product', impressions: 2800, clicks: 240, ctr: 8.6, position: 3.1 },
  { url: '/blog', impressions: 2200, clicks: 195, ctr: 8.9, position: 2.8 },
  { url: '/contact', impressions: 1900, clicks: 175, ctr: 9.2, position: 2.2 },
  { url: '/about', impressions: 1600, clicks: 140, ctr: 8.8, position: 3.0 },
];

// Initial sample keywords
const initialKeywords = [
  { keyword: 'digital marketing agency', impressions: 5400, clicks: 260, ctr: 9.3, position: 3, change: '+2' },
  { keyword: 'social media services', impressions: 3200, clicks: 220, ctr: 9.2, position: 5, change: '-1' },
  { keyword: 'ppc management', impressions: 2800, clicks: 190, ctr: 9.0, position: 2, change: '+4' },
  { keyword: 'content marketing', impressions: 1900, clicks: 170, ctr: 8.9, position: 6, change: '+1' },
  { keyword: 'seo services', impressions: 1500, clicks: 130, ctr: 8.7, position: 4, change: '+3' },
];

// Available websites for selection
const availableWebsites = [
  'mergeinsights.ai',
  'example.com',
  'testsite.org',
  'mydomain.net'
];

const SEOPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('keywords');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('mergeinsights.ai');
  const [serpKeywords, setSerpKeywords] = useState(initialKeywords);
  const [serpStats, setSerpStats] = useState({
    totalKeywords: 5,
    top10Keywords: 3,
    avgPosition: '3.6',
    estTraffic: 970
  });

  const {
    connected,
    handleConnect,
    isLoading: gscLoading
  } = useSearchConsoleIntegration();

  const handleRefreshSerpData = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website to analyze');
      return;
    }

    setIsRefreshing(true);
    console.log(`Fetching SERP data for: ${selectedWebsite}`);

    try {
      const { data, error } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl: selectedWebsite }
      });

      if (error) {
        console.error('SERP API error:', error);
        throw error;
      }

      if (data.keywords && data.keywords.length > 0) {
        setSerpKeywords(data.keywords);
        setSerpStats(data.stats);
        toast.success(`Successfully loaded ${data.keywords.length} keywords from SERP analysis`);
      } else {
        toast.warning('No keyword data found for this website');
      }
    } catch (error) {
      console.error('Error fetching SERP data:', error);
      toast.error('Failed to fetch SERP data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWebsiteChange = (website: string) => {
    setSelectedWebsite(website);
    console.log(`Selected website: ${website}`);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-primary p-2 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SEO Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Comprehensive SEO analytics and insights
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Website Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Website Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Website
                </label>
                <Select value={selectedWebsite} onValueChange={handleWebsiteChange}>
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
                  onClick={connected ? () => {} : handleConnect}
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
                  onClick={handleRefreshSerpData}
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
        </div>

        {/* SEO Overview Stats */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">SEO Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Organic Traffic</p>
                  <p className="text-3xl font-bold">5,238</p>
                  <p className="text-sm text-green-500">+12% from last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Keywords Ranked</p>
                  <p className="text-3xl font-bold">{serpStats.totalKeywords}</p>
                  <p className="text-sm text-green-500">+{serpStats.top10Keywords} in top 10</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Average Position</p>
                  <p className="text-3xl font-bold">{serpStats.avgPosition}</p>
                  <p className="text-sm text-green-500">Improved by 1.2</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Est. Traffic</p>
                  <p className="text-3xl font-bold">{serpStats.estTraffic.toLocaleString()}</p>
                  <p className="text-sm text-green-500">+18% from SERP data</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Search Console Integration */}
      <div className="mb-6">
        <GoogleSearchConsoleIntegration />
      </div>

      <Tabs defaultValue="keywords" className="mt-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="urlData">URL Meta Data</TabsTrigger>
          <TabsTrigger value="sitePerformance">Site Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Top Ranking Keywords</h3>
              <p className="text-sm text-muted-foreground">Data from SERP API analysis</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Keyword</th>
                    <th className="text-center py-3 px-4">Position</th>
                    <th className="text-center py-3 px-4">Change</th>
                    <th className="text-center py-3 px-4">Search Volume</th>
                    <th className="text-right py-3 px-4">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {serpKeywords.map((keyword, index) => (
                    <tr key={index} className="border-b hover:bg-muted/20">
                      <td className="py-3 px-4">{keyword.keyword}</td>
                      <td className="py-3 px-4 text-center">{keyword.position}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={cn(
                          "font-medium",
                          keyword.change.startsWith("+") ? "text-green-500" : "text-red-500"
                        )}>
                          {keyword.change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{keyword.impressions?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          keyword.position <= 3 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {keyword.position <= 3 ? "High" : "Medium"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Pages</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Page</th>
                      <th className="text-right pb-2">Impressions</th>
                      <th className="text-right pb-2">Clicks</th>
                      <th className="text-right pb-2">CTR</th>
                      <th className="text-right pb-2">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 text-blue-600">{page.url}</td>
                        <td className="py-3 text-right">{page.impressions.toLocaleString()}</td>
                        <td className="py-3 text-right">{page.clicks.toLocaleString()}</td>
                        <td className="py-3 text-right">{page.ctr.toFixed(1)}%</td>
                        <td className="py-3 text-right">{page.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="urlData">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold">URL Meta Data Analysis</h3>
              <p className="text-muted-foreground mb-6">Meta title and description optimization status for {selectedWebsite}</p>
              <div className="p-6 border rounded-lg bg-muted/20">
                <p>URL meta data analysis will be populated from Google Search Console data when connected</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sitePerformance">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold">Site Performance Metrics</h3>
              <p className="text-muted-foreground mb-6">Page speed and core web vitals for {selectedWebsite}</p>
              <div className="p-6 border rounded-lg bg-muted/20">
                <p>Performance metrics will be integrated with Google Search Console data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOPage;
