
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useSearchConsoleIntegration } from '@/components/google-search-console/useSearchConsoleIntegration';
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

// Available websites for selection
const availableWebsites = [
  'mergeinsights.ai',
  'example.com',
  'testsite.org',
  'mydomain.net'
];

const SEOPage = () => {
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
