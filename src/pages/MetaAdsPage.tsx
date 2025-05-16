
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignTable from '@/components/CampaignTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  dailyPerformance, 
  getOverviewMetrics,
  Campaign
} from '@/data/mockData';

// Extended Campaign type to include roas
interface MetaCampaign extends Campaign {
  roas: number;
  dailyBudget: number;
}

// Mock data for Meta Ads campaigns
const metaCampaigns: MetaCampaign[] = [
  {
    id: "meta-1",
    name: "Spring Collection - Facebook",
    status: "Active" as const,
    spend: 1350.32,
    impressions: 592800,
    clicks: 12850,
    conversions: 342,
    cpc: 0.11,
    costPerConversion: 3.95,
    conversionRate: 2.66,
    ctr: 2.17,  // (clicks / impressions) * 100
    roas: 4.8,
    dailyBudget: 50.00
  },
  {
    id: "meta-2",
    name: "Instagram Story Ads",
    status: "Active" as const,
    spend: 1876.42,
    impressions: 734500,
    clicks: 22670,
    conversions: 587,
    cpc: 0.08,
    costPerConversion: 3.20,
    conversionRate: 2.59,
    ctr: 3.09, // (clicks / impressions) * 100
    roas: 5.2,
    dailyBudget: 75.00
  },
  {
    id: "meta-3",
    name: "Retargeting - Carousel",
    status: "Active" as const,
    spend: 1120.89,
    impressions: 428600,
    clicks: 18970,
    conversions: 524,
    cpc: 0.06,
    costPerConversion: 2.14,
    conversionRate: 2.76,
    ctr: 4.43, // (clicks / impressions) * 100
    roas: 6.5,
    dailyBudget: 45.00
  }
];

const MetaAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshing Meta Ads data...');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial Meta Ads data fetch with date range:', dateRange);
  }, []);

  // Calculate revenue data
  const totalRevenue = metaCampaigns.reduce((total, campaign) => {
    return total + (campaign.spend * campaign.roas);
  }, 0);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Meta Ads Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Meta Ads Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <PerformanceChart data={dailyPerformance} />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>Facebook</div>
                  <div className="font-medium">62%</div>
                </div>
                <div className="flex justify-between">
                  <div>Instagram</div>
                  <div className="font-medium">31%</div>
                </div>
                <div className="flex justify-between">
                  <div>Audience Network</div>
                  <div className="font-medium">7%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <div>Facebook</div>
                  <div className="font-medium">${(totalRevenue * 0.62).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
                <div className="flex justify-between">
                  <div>Instagram</div>
                  <div className="font-medium">${(totalRevenue * 0.31).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
                <div className="flex justify-between">
                  <div>Audience Network</div>
                  <div className="font-medium">${(totalRevenue * 0.07).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="campaigns" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="budget">Budget & Bidding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead className="text-right">Daily Budget</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metaCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="text-right">${campaign.dailyBudget.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${campaign.spend.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.roas.toFixed(1)}x</TableCell>
                      <TableCell className="text-right">${(campaign.spend * campaign.roas).toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Age Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>18-24</div>
                      <div className="w-2/3">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: "22%" }}></div>
                      </div>
                      <div>22%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>25-34</div>
                      <div className="w-2/3">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: "38%" }}></div>
                      </div>
                      <div>38%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>35-44</div>
                      <div className="w-2/3">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: "25%" }}></div>
                      </div>
                      <div>25%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Gender</h4>
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 bg-blue-100 p-3 rounded text-center">
                      <div className="font-bold">46%</div>
                      <div className="text-sm">Male</div>
                    </div>
                    <div className="flex-1 bg-pink-100 p-3 rounded text-center">
                      <div className="font-bold">52%</div>
                      <div className="text-sm">Female</div>
                    </div>
                    <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                      <div className="font-bold">2%</div>
                      <div className="text-sm">Other</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creative" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Creative Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Summer Collection Video", 
                    type: "Video Ad", 
                    ctr: "3.8%", 
                    engagement: "High",
                    thumbnail: "https://placehold.co/60x60/blue/white"
                  },
                  { 
                    title: "Product Carousel", 
                    type: "Carousel Ad", 
                    ctr: "2.4%", 
                    engagement: "Medium",
                    thumbnail: "https://placehold.co/60x60/green/white" 
                  },
                  { 
                    title: "Customer Testimonial", 
                    type: "Image Ad", 
                    ctr: "1.9%", 
                    engagement: "Medium",
                    thumbnail: "https://placehold.co/60x60/orange/white" 
                  },
                ].map((ad, i) => (
                  <div key={i} className="flex gap-4 items-center border-b pb-4">
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded overflow-hidden">
                      <div className="w-full h-full bg-blue-200 flex items-center justify-center text-xs">Ad</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{ad.title}</div>
                      <div className="text-sm text-muted-foreground">{ad.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{ad.ctr} CTR</div>
                      <div className="text-sm text-muted-foreground">{ad.engagement} Engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Budget & Bidding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metaCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">Budget: ${campaign.dailyBudget.toFixed(2)}/day</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="font-medium">ROAS: </span>{campaign.roas.toFixed(1)}x
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">CPC: </span>${campaign.cpc.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs">Daily Budget</label>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm font-medium">$</span>
                          <input
                            type="number"
                            className="ml-1 flex-1 border-0 border-b focus:ring-0 focus:border-black text-sm p-0"
                            defaultValue={campaign.dailyBudget}
                            step="1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs">Bid Strategy</label>
                        <select className="w-full mt-1 bg-transparent border-0 border-b focus:ring-0 focus:border-black text-sm p-0">
                          <option>Lowest Cost</option>
                          <option>Target CPA</option>
                          <option>Target ROAS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaAdsPage;
