
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';

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

// Top keywords sample data
const topKeywords = [
  { keyword: 'digital marketing', impressions: 2800, clicks: 260, ctr: 9.3, position: 2.1 },
  { keyword: 'seo services', impressions: 2400, clicks: 220, ctr: 9.2, position: 2.3 },
  { keyword: 'ppc management', impressions: 2100, clicks: 190, ctr: 9.0, position: 2.7 },
  { keyword: 'social media marketing', impressions: 1900, clicks: 170, ctr: 8.9, position: 2.9 },
  { keyword: 'content strategy', impressions: 1500, clicks: 130, ctr: 8.7, position: 3.2 },
];

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMetric, setActiveMetric] = useState('organicTraffic');

  // For demo purposes only - would connect to actual SEO data API
  const handleRefresh = () => {
    console.log('Refreshing SEO data...');
  };

  // Get last 30 days data
  const last30Days = seoData.slice(-30);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="SEO Performance" onRefresh={handleRefresh} />

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="lg:w-2/3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>SEO Performance Overview</CardTitle>
              <CardDescription>
                Track your organic search performance
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant={activeMetric === 'organicTraffic' ? 'default' : 'outline'}
                  onClick={() => setActiveMetric('organicTraffic')}
                >
                  Traffic
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
                  variant={activeMetric === 'clicks' ? 'default' : 'outline'}
                  onClick={() => setActiveMetric('clicks')}
                >
                  Clicks
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{last30Days[last30Days.length - 1].organicTraffic.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{((last30Days[last30Days.length - 1].organicTraffic - last30Days[0].organicTraffic) / last30Days[0].organicTraffic * 100).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{last30Days[last30Days.length - 1].impressions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{((last30Days[last30Days.length - 1].impressions - last30Days[0].impressions) / last30Days[0].impressions * 100).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{last30Days[last30Days.length - 1].clicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{((last30Days[last30Days.length - 1].clicks - last30Days[0].clicks) / last30Days[0].clicks * 100).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{last30Days[last30Days.length - 1].position.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  {last30Days[0].position - last30Days[last30Days.length - 1].position > 0 ? '+' : ''}
                  {(last30Days[0].position - last30Days[last30Days.length - 1].position).toFixed(1)} from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <GoogleSearchConsoleIntegration />
        </div>
      </div>

      <Tabs defaultValue="topPages" className="mt-6">
        <TabsList>
          <TabsTrigger value="topPages">Top Pages</TabsTrigger>
          <TabsTrigger value="topKeywords">Top Keywords</TabsTrigger>
        </TabsList>
        <TabsContent value="topPages">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Pages with the highest search visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
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
        <TabsContent value="topKeywords">
          <Card>
            <CardHeader>
              <CardTitle>Top Keywords</CardTitle>
              <CardDescription>
                Keywords driving the most traffic to your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Keyword</th>
                      <th className="text-right pb-2">Impressions</th>
                      <th className="text-right pb-2">Clicks</th>
                      <th className="text-right pb-2">CTR</th>
                      <th className="text-right pb-2">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topKeywords.map((keyword, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{keyword.keyword}</td>
                        <td className="py-3 text-right">{keyword.impressions.toLocaleString()}</td>
                        <td className="py-3 text-right">{keyword.clicks.toLocaleString()}</td>
                        <td className="py-3 text-right">{keyword.ctr.toFixed(1)}%</td>
                        <td className="py-3 text-right">{keyword.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOPage;
