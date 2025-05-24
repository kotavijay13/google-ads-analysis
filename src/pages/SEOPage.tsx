
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Globe, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

// Sample SEO data for visualization
const seoData = [
  { date: '2025-04-20', organicTraffic: 1200, impressions: 8500, clicks: 420, position: 18 },
  { date: '2025-04-21', organicTraffic: 1250, impressions: 9000, clicks: 450, position: 17 },
  { date: '2025-04-22', organicTraffic: 1300, impressions: 9200, clicks: 470, position: 16 },
  { date: '2025-04-23', organicTraffic: 1320, impressions: 9400, clicks: 490, position: 15 },
  { date: '2025-04-24', organicTraffic: 1400, impressions: 9600, clicks: 510, position: 15 },
  { date: '2025-04-25', organicTraffic: 1450, impressions: 9800, clicks: 530, position: 14 },
  { date: '2025-04-26', organicTraffic: 1500, impressions: 10000, clicks: 550, position: 14 },
  { date: '2025-04-27', organicTraffic: 1550, impressions: 10200, clicks: 570, position: 13 },
  { date: '2025-04-28', organicTraffic: 1600, impressions: 10400, clicks: 590, position: 13 },
  { date: '2025-04-29', organicTraffic: 1650, impressions: 10600, clicks: 610, position: 12 },
  { date: '2025-04-30', organicTraffic: 1700, impressions: 10800, clicks: 630, position: 12 },
  { date: '2025-05-01', organicTraffic: 1750, impressions: 11000, clicks: 650, position: 11 },
  { date: '2025-05-02', organicTraffic: 1800, impressions: 11200, clicks: 670, position: 11 },
  { date: '2025-05-03', organicTraffic: 1850, impressions: 11400, clicks: 690, position: 10 },
  { date: '2025-05-04', organicTraffic: 1900, impressions: 11600, clicks: 710, position: 10 },
  { date: '2025-05-05', organicTraffic: 1950, impressions: 11800, clicks: 730, position: 9 },
  { date: '2025-05-06', organicTraffic: 2000, impressions: 12000, clicks: 750, position: 9 },
  { date: '2025-05-07', organicTraffic: 2050, impressions: 12200, clicks: 770, position: 8 },
  { date: '2025-05-08', organicTraffic: 2100, impressions: 12400, clicks: 790, position: 8 },
  { date: '2025-05-09', organicTraffic: 2150, impressions: 12600, clicks: 810, position: 7 },
  { date: '2025-05-10', organicTraffic: 2200, impressions: 12800, clicks: 830, position: 7 },
  { date: '2025-05-11', organicTraffic: 2250, impressions: 13000, clicks: 850, position: 6 },
  { date: '2025-05-12', organicTraffic: 2300, impressions: 13200, clicks: 870, position: 6 },
  { date: '2025-05-13', organicTraffic: 2350, impressions: 13400, clicks: 890, position: 5 },
  { date: '2025-05-14', organicTraffic: 2400, impressions: 13600, clicks: 910, position: 5 },
  { date: '2025-05-15', organicTraffic: 2450, impressions: 13800, clicks: 930, position: 4 },
  { date: '2025-05-16', organicTraffic: 2500, impressions: 14000, clicks: 950, position: 4 },
  { date: '2025-05-17', organicTraffic: 2550, impressions: 14200, clicks: 970, position: 3 },
  { date: '2025-05-18', organicTraffic: 2600, impressions: 14400, clicks: 990, position: 3 },
  { date: '2025-05-19', organicTraffic: 2650, impressions: 14600, clicks: 1010, position: 2 },
  { date: '2025-05-20', organicTraffic: 2700, impressions: 14800, clicks: 1030, position: 2 },
];

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

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
  const { user } = useAuth();
  const [activeMetric, setActiveMetric] = useState('organicTraffic');
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

  // Get last 30 days data
  const last30Days = seoData.slice(-30);

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
      {/* Website Details Section */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-primary p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Website Analysis</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleRefreshSerpData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRefreshing ? 'Analyzing...' : 'Refresh SERP Data'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Google Search Console Integration */}
      <div className="mb-6">
        <GoogleSearchConsoleIntegration />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-primary p-2 bg-primary/10 rounded-lg">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SEO Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {format(new Date(), "dd/MM/yyyy, HH:mm:ss")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">SEO Overview</h2>
        
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

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Keyword Performance over Time</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={last30Days}
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
                        activeMetric === 'position' 
                          ? value.toFixed(1) 
                          : value >= 1000 
                            ? `${(value/1000).toFixed(1)}k` 
                            : value
                      }
                    />
                    <Tooltip 
                      formatter={(value: any) => [
                        activeMetric === 'position' 
                          ? value.toFixed(1) 
                          : value.toLocaleString(),
                        activeMetric === 'organicTraffic' 
                          ? 'Organic Traffic' 
                          : activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)
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
                      name={
                        activeMetric === 'organicTraffic' 
                          ? 'Organic Traffic' 
                          : activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
