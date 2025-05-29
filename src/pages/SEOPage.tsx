
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useSearchConsoleIntegration } from '@/components/google-search-console/useSearchConsoleIntegration';
import { useGoogleAdsIntegration } from '@/components/google-ads/useGoogleAdsIntegration';
import WebsiteSelector from '@/components/seo/WebsiteSelector';
import SEOStatsCards from '@/components/seo/SEOStatsCards';
import KeywordTable from '@/components/seo/KeywordTable';

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

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [availableWebsites, setAvailableWebsites] = useState<string[]>([]);
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

  // Use Google Ads integration to get connected accounts
  const { 
    accounts: googleAdsAccounts, 
    connected: googleAdsConnected 
  } = useGoogleAdsIntegration();

  // Extract websites from Google Ads accounts
  useEffect(() => {
    if (googleAdsConnected && googleAdsAccounts.length > 0) {
      // Extract website domains from Google Ads account names or create mock websites
      // In real implementation, you'd get actual website URLs from campaigns or account data
      const websites = googleAdsAccounts.map(account => {
        // Try to extract domain from account name or use a default pattern
        const accountName = account.name.toLowerCase().replace(/\s+/g, '');
        return `${accountName}.com`;
      });
      
      // Add some default websites as fallback
      const defaultWebsites = ['mergeinsights.ai', 'example.com'];
      const allWebsites = [...new Set([...defaultWebsites, ...websites])];
      
      setAvailableWebsites(allWebsites);
      
      // Set first website as default if none selected
      if (!selectedWebsite && allWebsites.length > 0) {
        setSelectedWebsite(allWebsites[0]);
      }
    } else {
      // Fallback to default websites if Google Ads not connected
      const defaultWebsites = ['mergeinsights.ai', 'example.com', 'testsite.org', 'mydomain.net'];
      setAvailableWebsites(defaultWebsites);
      if (!selectedWebsite) {
        setSelectedWebsite(defaultWebsites[0]);
      }
    }
  }, [googleAdsAccounts, googleAdsConnected, selectedWebsite]);

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

      {!googleAdsConnected && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-orange-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-orange-800">Connect Google Ads for Better SEO Insights</h3>
                <p className="text-sm text-orange-600 mt-1">
                  Connect your Google Ads account to automatically populate website options and get more comprehensive SEO data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Website Selection */}
        <div className="lg:col-span-1">
          <WebsiteSelector
            selectedWebsite={selectedWebsite}
            availableWebsites={availableWebsites}
            connected={connected}
            gscLoading={gscLoading}
            isRefreshing={isRefreshing}
            onWebsiteChange={handleWebsiteChange}
            onConnect={handleConnect}
            onRefresh={handleRefreshSerpData}
          />
        </div>

        {/* SEO Overview Stats */}
        <div className="lg:col-span-2">
          <SEOStatsCards serpStats={serpStats} />
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
          <KeywordTable keywords={serpKeywords} />
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
